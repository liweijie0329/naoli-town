---
name: project-skill-architecture
description: MoCA AI 技能系统的三层架构设计决策
type: project
---

当前决策：MoCA Skill 系统拆分为三个独立模块。

## 架构

```
skills/
├── moca-game/       — 游戏交互协议（怎么问）
├── moca-clinic/     — AI 医护评分（怎么判）
└── moca-design/     — 视觉风格规范（长什么样）
```

## 为什么分开

- 改风格只改 design，不动业务逻辑
- 改评分只改 clinic，不动交互流程
- 加新题加 game + clinic，复用 design

## 已有成果

- skills/moca-naming/SKILL.md — 命名题（对话版 + 游戏集成版）+ demo.html
- skills/moca-trail/SKILL.md — 交替连线（游戏集成版，含练习+正式流程）+ demo.html
- 参考：RedSkill 安装的 fitness-island 商业 Skill

## 和 app.js 的关系

app.js 已有：角色动画、画布渲染、音频、UI 交互
Skill 补的：判断逻辑、引导策略、追问机制、评分规则

Skill 通过 JSON 协议与 App 通信，不直接操作 DOM。
