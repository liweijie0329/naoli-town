# Git 操作规范（AI 助手必读）

> 本文档记录 2026-05-27 的 force push 事件，作为后续 AI 操作的提醒。

## 核心原则：永远不要 `git init`

**本项目已托管在 GitHub**：`https://github.com/trchen12/cognition-hearing-game.git`

任何时候改代码，第一步必须是 **clone 或 pull**，不是新建仓库。

## 正确操作流程

### 在新电脑上开始工作

```bash
git clone https://github.com/trchen12/cognition-hearing-game.git
cd cognition-hearing-game
```

### 日常改代码

```bash
git pull                          # 先拉最新
# ... 改代码 ...
git add .
git commit -m "描述你的改动"
git push                          # 不应该需要 --force
```

### 如果要新建分支

```bash
git checkout main                 # 切换到 main
git pull                          # 确保 main 是最新的
git checkout -b 新分支名称         # 基于最新 main 建新分支
# ... 改代码 ...
git push -u origin 新分支名称      # 首次 push，不需要 force
```

## 禁止的操作

| 禁止 | 原因 | 正确替代 |
|------|------|---------|
| `git init` | 创建独立历史，和远程不相关 | `git clone` |
| `git push --force` | 覆盖他人工作 | 先 `git pull` 再 `git push` |
| `git push --force-with-lease` | 不安全，可能覆盖远程更新 | 开新分支避免冲突 |

## Force Push 为什么会发生

2026-05-27：Mac AI 使用 `git init` 创建独立仓库，导致本地历史与 GitHub 不相关，push 被拒绝后使用 `--force` 覆盖了远程 character-guide 分支。

此后修复：先 `git fetch` + `git clone` 获得完整历史，再正常操作。

## 如果 push 被拒绝

```bash
# 不要用 --force。做这个：
git pull --rebase origin 你的分支名
# 解决冲突（如果有）
git push
```

## 当前分支结构

- `main`：导师的主版本
- `character-guide`：角色引导系统
- `version-2`：v2 版本
- `village-preview-design`：村庄预览设计

如需新功能，请基于最新的 `main` 创建新分支。
