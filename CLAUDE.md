# 脑力闯关 — 项目上下文

## 项目简介
面向 60+ 老年人的 MoCA 认知筛查 Web 应用，iPad 横屏触控，PWA 离线可用。

## 技术栈
- 纯 HTML/CSS/JS（无框架），Node.js 后端
- 豆包 TTS 预生成音频（佩奇语音）
- 讯飞 ASR 语音识别
- Cloudflare Pages + D1 数据库（生产环境）

## 核心分支
- main：导师主版本
- character-guide：角色引导系统（脑博士 + 2.5D 动画）

## 角色系统
- 角色名：脑博士
- 素材：assets/character/
- 功能：呼吸动画、自然眨眼、唇形同步、开场引导

## 交互流程
引导页（角色+对话框）→ 用户确认 → 答题 → 反馈 → 下一题

## 设计规范
- 多邻国 × 任天堂风格：圆润、温暖
- 触控目标 >= 44pt，正文字号 >= 18pt
- 每日生活主题化

## Git 规范
- 禁止 git init（已托管，用 git clone）
- 禁止 git push --force
- 不碰 main 分支
