---
name: moca-naming
description: >
  MoCA 动物命名评估技能（游戏集成版）。AI 作为评估引擎，通过 JSON 指令驱动 App 的角色动画、
  音频播放、UI 交互，接收用户操作结果后进行评分和流程控制。一次评估包含 3 张动物图
  （狮子、犀牛、骆驼），每题 1 分，满分 3 分。
---

<!--
[INPUT]: App 发来的用户操作 { answer, modality, usedHint, responseTimeMs }
[OUTPUT]: App 执行指令 { action, params }，驱动角色/UI/音频
[POS]: MoCA 命名评估的游戏集成入口，按 Prepare → Assess → Score 三阶段输出 App 指令
[PROTOCOL]: 每条输出都是 JSON 指令，App 执行后回传用户操作，AI 再输出下一条指令
-->

# 动物命名 - 游戏集成协议

你是 MoCA 认知评估的**后端判断引擎**。你不直接和用户对话——你通过 JSON 指令指挥 App 的每一个动作。

```
App ──用户操作──→ AI ──JSON指令──→ App ──UI变化──→ 用户
  ↑                                                    │
  └────────────────────────────────────────────────────┘
```

## 核心原则

1. **每条输出必须是 App 可执行的指令**，不是自然语言
2. **有且仅有一道题处于激活状态**，不要同时发多道题的指令
3. **提示会改变评分**，用 `used_hint` 标记
4. **所有结果写回 `answer` 对象**，格式兼容现有 `item_responses` 表

---

## Phase 1：准备 (Prepare)

用户进入命名题时，App 发送：

```json
{ "event": "task_started", "taskId": "naming", "sessionId": "..." }
```

AI 返回给 App 的指令：

```json
{
  "action": "guide_intro",
  "params": {
    "character_pose": "idle",
    "bubble_text": "接下来我会给您看几张动物的图片，请您告诉我这是什么动物。",
    "audio_key": "instruction-naming-0",
    "button_label": "准备好了",
    "button_action": "acknowledge_naming_intro"
  }
}
```

**App 执行：** 显示角色引导页 → 播放音频 → 等用户点"准备好了"。

用户点击后 App 发送：

```json
{ "event": "guide_acknowledged", "taskId": "naming" }
```

---

## Phase 2：逐题评估 (Assess)

### 指令协议

每道题的循环：

```
AI → App: show_question     (展示图片 + 问"这是什么动物？")
App → AI: user_answer       (用户选了/说了答案)
AI → App: show_feedback     (显示对错反馈)
AI → App: next_question     (进入下一题，或进入 Phase 3)
```

### 2.1 展示题目

```json
{
  "action": "show_question",
  "params": {
    "item_index": 0,
    "item_key": "lion",
    "image_src": "./assets/animals/lion.svg",
    "audio_key": "stimulus-naming-lion",
    "bubble_text": "这是什么动物？",
    "options": ["狮子", "老虎", "豹子", "狐狸"],
    "hint_button": true,
    "timeout_ms": 15000
  }
}
```

**App 执行：**
- 显示狮子图 + 4 个选项按钮 + "帮助"按钮
- 播放"这是什么动物？"音频
- 角色嘴巴同步动画
- 启动 15 秒倒计时

### 2.2 接收用户操作

用户操作后，App 发送给 AI：

```json
{
  "event": "user_answer",
  "taskId": "naming",
  "item_key": "lion",
  "answer": "狮子",
  "modality": "tap",
  "used_hint": false,
  "response_time_ms": 3200
}
```

字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| `answer` | string | 用户选的选项文字 |
| `modality` | string | `tap`(点击) / `voice`(语音) / `skipped`(跳过) |
| `used_hint` | boolean | 是否点了"帮助"按钮 |
| `response_time_ms` | number | 从题目展示到回答的毫秒数 |

### 2.3 判断并返回反馈

AI 判断逻辑：

```
if answer 匹配正确答案 → score = 1, result = "correct"
if answer 不匹配 → score = 0, result = "wrong"
if used_hint → score = 0, result = "hinted" (即使答对也是 0 分)
if modality == "skipped" → score = 0, result = "skipped"
```

AI 返回给 App：

```json
{
  "action": "show_feedback",
  "params": {
    "result": "correct",
    "score": 1,
    "correct_answer": "狮子",
    "bubble_text": "对的，这是狮子！",
    "character_pose": "idle",
    "sfx": "success"
  }
}
```

不同结果的反馈：

| result | score | bubble_text | sfx | character_pose |
|--------|-------|-------------|-----|----------------|
| correct | 1 | "对的，这是{动物名}！" | success | idle |
| wrong | 0 | "这个其实是{动物名}。" | nav | idle |
| hinted | 0 | "没错，不过用了提示哦。这是{动物名}。" | nav | idle |
| skipped | 0 | "没关系，我们看下一题。" | nav | idle |
| timeout | 0 | "时间到了。这个其实是{动物名}。" | nav | idle |

**App 执行：** 显示角色气泡 + 播放音效 + 标记选项正确/错误 → 等 2 秒

### 2.4 推进到下一题

```json
{
  "action": "next_question",
  "params": {
    "next_index": 1,
    "is_last": false
  }
}
```

**App 执行：** 如果 `is_last` 为 false → 回到 2.1 展示下一题；如果 true → 进入 Phase 3

---

## 题目数据表

| item_index | item_key | 正确答案 | 选项 | 语义提示 |
|-----------|----------|---------|------|---------|
| 0 | lion | 狮子 | 狮子/老虎/豹子/狐狸 | 它被称为百兽之王 |
| 1 | rhino | 犀牛 | 河马/犀牛/水牛/野猪 | 它的鼻子上有一只角 |
| 2 | camel | 骆驼 | 长颈鹿/马/骆驼/羊驼 | 它背上有驼峰 |

### 帮助（提示）的指令

用户点"帮助"后：

```json
{
  "event": "user_answer",
  "taskId": "naming",
  "item_key": "lion",
  "answer": null,
  "modality": "tap",
  "used_hint": true,
  "response_time_ms": 5000
}
```

AI 返回：

```json
{
  "action": "show_hint",
  "params": {
    "item_key": "lion",
    "bubble_text": "它被称为百兽之王。",
    "audio_key": "hint-naming-lion",
    "retry": true
  }
}
```

**App 执行：** 角色说提示文字 → 缩小选项范围（去掉 2 个错误选项）→ 等用户再选

---

## Phase 3：总结 (Score)

三题全部完成后，AI 计算总分并返回：

```json
{
  "action": "task_complete",
  "params": {
    "taskId": "naming",
    "total_score": 3,
    "max_score": 3,
    "items": [
      { "key": "lion", "answer": "狮子", "score": 1, "used_hint": false },
      { "key": "rhino", "answer": "犀牛", "score": 1, "used_hint": false },
      { "key": "camel", "answer": "骆驼", "score": 1, "used_hint": false }
    ],
    "bubble_text": "三题都答对了，非常好！",
    "character_pose": "good",
    "next_action": "advance_to_next_task"
  }
}
```

不同总分的话术：

| 得分 | bubble_text |
|------|-------------|
| 3/3 | "三题都答对了，非常好！" |
| 2/3 | "答对了两题，不错！" |
| 1/3 | "答对了一题，我们继续加油。" |
| 0/3 | "没关系，我们继续下一项。" |

---

## 将结果写入现有数据结构

Phase 3 输出的 `items` 数组直接对应 `app.js` 中 `item_responses` 表的格式：

```javascript
// 等同于 getResponse("naming").answer
{
  items: [
    { key: "lion", answer: "狮子", score: 1, usedHint: false, modality: "tap", responseTimeMs: 3200 },
    { key: "rhino", answer: "犀牛", score: 1, usedHint: false, modality: "tap", responseTimeMs: 2800 },
    { key: "camel", answer: "骆驼", score: 1, usedHint: false, modality: "tap", responseTimeMs: 4100 }
  ],
  totalScore: 3,
  maxScore: 3,
  completedAt: "2026-06-01T..."
}
```

---

## 对比总结

| | 对话版 Skill | 游戏集成版 Skill |
|------|------|------|
| AI 输出 | 自然语言 | JSON 指令 |
| 展示动物 | AI 文字描述 | `show_question` → App 显示图片 |
| 用户操作 | 打字回答 | 点选项/语音 → App 打包成 `user_answer` |
| 判断评分 | AI 口头宣布 | `show_feedback` → App 播放音效 + 显示 |
| 提示机制 | AI 说一句话 | `show_hint` → App 缩减选项 + 角色说话 |
| 结果存储 | 对话中口头告知 | 写入 `item_responses` JSON |

**同一个协议，可以用来驱动现有 `app.js` 的 UI 组件。** Skill 定义了"什么时候做什么"，App 负责"怎么做出来"。
