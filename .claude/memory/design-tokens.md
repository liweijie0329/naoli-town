---
name: design-tokens
description: 脑力闯关项目设计规范与 UI 审计
type: project
---

## ui-ux-pro-max 审计结果 (2026-06-03)

### 通过的检查
- 触控目标：大部分使用 clamp() 自适应
- 反馈：确认弹窗、绿色按钮、音效反馈
- 导航：始终有返回/关闭按钮
- 间距：触控目标间有 8px+ 间距

### 待修复
- 触控目标：13 处 min-height < 44px
- 字体：55 处 < 18pt（老年人最低要求）
- 对比度：部分灰色文字可能不足 4.5:1
- 圆角：20+ 种值不统一
- 焦点态：缺少可见的 focus ring

## 设计令牌（建议统一使用）

```css
:root {
  --color-primary: #5a9b6e;
  --color-primary-dark: #4a8560;
  --color-primary-shadow: #3a6e50;
  --color-bg: #FDFBF7;
  --color-bubble: rgba(250,248,243,0.82);
  --color-gold: #f5c842;
  --radius-btn: 14px;
  --radius-card: 16px;
  --radius-modal: 20px;
  --radius-pill: 999px;
  --touch-min: 44px;
  --font-body: 18px;
}
```
