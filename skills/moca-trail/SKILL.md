---
name: moca-trail
description: >
  MoCA 交替连线评估技能（游戏集成版）。AI 作为评估引擎，控制引导页的教学讲解、
  练习画布的拖拽交互、正式连线的节点序列判分，以及最终画布图片的 AI 视觉评分。
  评估包含一个 3 节点练习阶段和一个 10 节点正式测试，满分 1 分。
---

<!--
[INPUT]: App 发来的连线序列、撤销/重试事件、画布图片 data URL
[OUTPUT]: App 执行指令 { action, params }，驱动引导页、练习画布、正式连线画布
[POS]: MoCA 交替连线的游戏集成入口
-->

# 交替连线 - 游戏集成协议

你是认知评估引擎。这个任务比命名复杂得多：它有**教学引导 → 练习 → 正式测试 → AI 视觉评分**四个层级。

---

## 任务数据

**正式序列：** `1 → 甲 → 2 → 乙 → 3 → 丙 → 4 → 丁 → 5 → 戊`

**练习序列：** `1 → 甲 → 2`

**评分规则：** 最终连线序列完全包含正确顺序，且无交叉线 → 1 分；任何错误且未立刻自我纠正 → 0 分。

---

## Phase 1：教学引导

用户进入引导页时，App 发送：

```json
{ "event": "task_started", "taskId": "trail", "sessionId": "..." }
```

AI 返回：

```json
{
  "action": "guide_intro",
  "params": {
    "character_pose": "idle",
    "bubble_text": "我们有时会用\"123……\"或者汉语的\"甲乙丙……\"来表示顺序。请您按照从数字到汉字并逐渐升高的顺序画一条连线。从1连向甲，再连向2，并一直连下去，到戊结束。",
    "bubble_paragraphs": [
      "我们有时会用\"123……\"或者汉语的\"甲乙丙……\"来表示顺序。",
      "请您按照从数字到汉字并逐渐升高的顺序画一条连线。",
      "从1连向甲，再连向2，并一直连下去，到戊结束。"
    ],
    "audio_key": "instruction-trail-0",
    "show_practice": true,
    "practice_label": "试试看：从 1 拖到甲，再拖到 2",
    "button_label": "准备好了",
    "button_action": "acknowledge_trail_intro"
  }
}
```

**App 执行：**
- 显示角色 + 三段式气泡 + 下方练习画布（3 个节点：1、甲、2）
- 播放音频 + 嘴巴同步
- 画布内虚线显示预期路径 `1 → 甲 → 2`
- 绿色三角箭头从当前节点指向目标节点来回移动
- 用户可拖拽连线练习，不受"指令播完"限制

### 练习画布交互

用户拖拽连线时，App 实时发送：

```json
{
  "event": "practice_drag",
  "taskId": "trail",
  "from_node": "1",
  "to_node": "甲",
  "sequence_so_far": ["1", "甲"],
  "expected": ["1", "甲", "2"]
}
```

AI 判断并返回是否需要回滚（连错时的处理）：

```json
{
  "action": "practice_feedback",
  "params": {
    "accepted": true,
    "hint_text": "请从 1 拖到甲，再拖到 2"
  }
}
```

如果 `accepted: false`（连错节点），App 撤销该线段并闪烁提示。

练习完成后（序列 = `["1","甲","2"]`），App 发送：

```json
{ "event": "practice_complete", "taskId": "trail" }
```

AI 返回：

```json
{
  "action": "practice_done",
  "params": {
    "bubble_text": "很好，就是这样！准备好了就开始正式连线吧。",
    "practice_label": "练习完成！"
  }
}
```

用户点击"准备好了"后：

```json
{ "event": "guide_acknowledged", "taskId": "trail" }
```

---

## Phase 2：正式测试

### 2.1 展示正式连线画布

```json
{
  "action": "show_question",
  "params": {
    "taskId": "trail",
    "canvas_nodes": [
      { "label": "1", "x": 0.08, "y": 0.55 },
      { "label": "甲", "x": 0.18, "y": 0.25 },
      { "label": "2", "x": 0.28, "y": 0.68 },
      { "label": "乙", "x": 0.38, "y": 0.20 },
      { "label": "3", "x": 0.48, "y": 0.62 },
      { "label": "丙", "x": 0.58, "y": 0.28 },
      { "label": "4", "x": 0.68, "y": 0.55 },
      { "label": "丁", "x": 0.78, "y": 0.32 },
      { "label": "5", "x": 0.88, "y": 0.48 },
      { "label": "戊", "x": 0.95, "y": 0.22 }
    ],
    "expected_sequence": ["1","甲","2","乙","3","丙","4","丁","5","戊"],
    "allow_undo": true,
    "auto_submit_delay_ms": 5000,
    "audio_key": "stimulus-trail-0"
  }
}
```

**App 执行：** 显示 10 个节点画布 + 撤销按钮。用户拖拽连线。

### 2.2 每次连线后的实时判分

用户每完成一条线，App 发送：

```json
{
  "event": "trail_edge_added",
  "taskId": "trail",
  "from_node": "1",
  "to_node": "甲",
  "sequence_so_far": ["1", "甲"],
  "has_crossing_lines": false,
  "total_edges": 1
}
```

AI 实时检查并返回：

```json
{
  "action": "trail_edge_feedback",
  "params": {
    "accepted": true,
    "is_correct_step": true,
    "correct_step": 1,
    "total_steps": 10
  }
}
```

### 2.3 关键规则：连线错误

如果用户从 `1` 直接连到 `2`（跳过了 `甲`），App 发送：

```json
{
  "event": "trail_edge_added",
  "taskId": "trail",
  "from_node": "1",
  "to_node": "2",
  "sequence_so_far": ["1", "2"],
  "has_crossing_lines": false,
  "total_edges": 1
}
```

AI 判断 `expected_sequence[1]` = "甲"，但用户连了"2" → 错误。返回：

```json
{
  "action": "trail_edge_feedback",
  "params": {
    "accepted": false,
    "is_correct_step": false,
    "error_type": "wrong_node",
    "expected_node": "甲",
    "actual_node": "2",
    "bubble_text": "请从 1 连向甲，然后再连向 2。",
    "auto_undo": true
  }
}
```

**App 执行：** 自动撤销错误线段 + 角色气泡提示 + 等待用户重试。

### 2.4 自我纠正规则（MoCA 关键规则）

> 如果用户连错了但**立刻自己点撤销**改正 → 不算错误，仍可给 1 分。

App 检测到用户在 3 秒内自行撤销并重连正确节点：

```json
{
  "event": "trail_self_corrected",
  "taskId": "trail",
  "wrong_edge": { "from": "1", "to": "2" },
  "corrected_edge": { "from": "1", "to": "甲" },
  "correction_time_ms": 1800
}
```

AI 判断 `correction_time_ms < 3000` → 不算错误：

```json
{
  "action": "trail_edge_feedback",
  "params": {
    "accepted": true,
    "self_corrected": true,
    "penalty": false
  }
}
```

### 2.5 交叉线检测

连线过程中，App 持续检测线是否交叉。如果检测到交叉：

```json
{
  "event": "trail_crossing_detected",
  "taskId": "trail",
  "crossing_edges": [
    { "from": "2", "to": "3" },
    { "from": "甲", "to": "乙" }
  ]
}
```

交叉线的即时警告：

```json
{
  "action": "trail_edge_feedback",
  "params": {
    "accepted": true,
    "warning": "crossing_lines",
    "bubble_text": "线交叉了，请注意不要交叉。您可以用撤销来修正。",
    "allow_continue": true
  }
}
```

> 注意：交叉线出现后如果不撤销直接提交 → **最终得 0 分**。如果用户自己撤销了交叉线段并重新连线 → 不算交叉。

---

## Phase 3：提交 & 判分

### 3.1 用户提交

用户连完所有节点后点"完成"，或 5 秒无操作自动提交：

```json
{
  "event": "trail_submitted",
  "taskId": "trail",
  "final_sequence": ["1","甲","2","乙","3","丙","4","丁","5","戊"],
  "total_edges": 9,
  "has_crossing_lines": false,
  "self_corrections": 0,
  "total_time_ms": 45000,
  "drawing_image": "data:image/png;base64,..."
}
```

### 3.2 AI 判分逻辑

```
score = 0
reasons = []

if final_sequence 包含正确顺序 "1-甲-2-乙-3-丙-4-丁-5-戊":
    score = 1
else if 有自纠正 and 纠正后序列正确:
    score = 1  // MoCA 允许立刻自我纠正
else:
    score = 0
    reasons.push("连线顺序不正确")

if has_crossing_lines and not self_corrected:
    score = 0
    reasons.push("存在交叉线且未纠正")

// 可选：AI 视觉复核
if drawing_image:
    调用视觉模型检查画布
    if 发现未检测到的交叉或漏连:
        score = 0
        reasons.push("AI 视觉复核发现异常")
```

### 3.3 返回结果

```json
{
  "action": "task_complete",
  "params": {
    "taskId": "trail",
    "score": 1,
    "max_score": 1,
    "final_sequence": ["1","甲","2","乙","3","丙","4","丁","5","戊"],
    "crossing_lines": false,
    "self_corrections": 0,
    "total_time_ms": 45000,
    "ai_visual_check": {
      "performed": true,
      "confirmed": true,
      "confidence": 0.94
    },
    "bubble_text": "完全正确，连得很好！",
    "character_pose": "good",
    "next_action": "advance_to_next_task"
  }
}
```

不同结果的话术：

| 情况 | bubble_text |
|------|-------------|
| 完全正确 | "完全正确，连得很好！" |
| 有自纠正但最终正确 | "很好，您自己纠正过来了！" |
| 顺序错误 | "连线的顺序和要求的有些不一样，没关系。" |
| 有交叉线 | "线有一些交叉，下次可以注意避免交叉。" |

---

## 结果写入

```javascript
// 对应 item_responses 表
{
  taskId: "trail",
  score: 1,
  maxScore: 1,
  answer: {
    sequence: ["1","甲","2","乙","3","丙","4","丁","5","戊"],
    submitted: true
  },
  behavior: {
    totalEdges: 9,
    hasCrossingLines: false,
    selfCorrections: 0,
    practiceCompleted: true
  },
  drawingImage: "data:image/png;base64,...",
  ai: {
    mode: "vision_check",
    scoreSuggestion: 1,
    confidence: 0.94,
    requiresHumanReview: false,
    comment: "连线序列完整正确，无交叉线。"
  }
}
```

---

## 和命名题对比：交替连线复杂在哪里

| 对比维度 | 命名题 | 交替连线 |
|------|------|------|
| 交互方式 | 点选项 | 画布拖拽连线 |
| 是否有练习 | 无 | 有（3 节点） |
| 实时判分 | 选完一次性判断 | 每条线实时检查 |
| 自纠正规则 | 无 | 3 秒内撤销不算错 |
| 交叉线检测 | 不适用 | 实时检测 + 最终判定 |
| AI 视觉评分 | 不需要 | 需要（复核画布图片） |
| 提交前的冷却期 | 无 | 5 秒无操作自动提交 |
| 满分 | 3 分（3 题各 1 分） | 1 分（一票否决制） |
