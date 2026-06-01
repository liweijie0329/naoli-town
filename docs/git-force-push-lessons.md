# Git Force Push 事故复盘与经验总结

> 2026-05-27 ~ 2026-06-01，Windows ↔ Mac 双机协作中的 Git 踩坑记录

---

## 事故 1：`git init` 导致历史断裂（2026-05-27）

### 发生了什么

Mac AI 在新电脑上初始化项目时，用了 `git init` 创建了一个全新仓库，而不是 `git clone` 已有仓库。

```
正确：git clone https://github.com/trchen12/...  ← 拉取完整历史
错误：git init                                    ← 创建孤立仓库
```

### 后果

- 本地仓库和 GitHub 远程仓库拥有**完全不同的根 commit**
- 两条历史线没有任何共同祖先
- `git push` 被拒绝 → 被迫 `git push --force`，覆盖了远程 `character-guide` 分支

### 教训

**永远不要 `git init` 一个已托管在 GitHub 的项目。用 `git clone`。**

---

## 事故 2：基于旧 main 建新分支导致历史不同（2026-06-01）

### 发生了什么

Windows 本地仓库的 main 还是旧版本（1 个 commit），但远程 main 已被导师更新了 9 个 commit。我们基于旧 main 建了 `docs` 分支并 push。

```
远程 main：  d6c0fe0 → ... → 9e038cf (9 commits)
本地 main：  2c46089 (只有 1 个旧 commit)

本地 docs：  2c46089 → f4acf4e → 6dc1e6a (基于旧 main)
远程 docs：  不存在（但推送后和 main 历史不同）
```

### 后果

- `docs` 分支和远程 main **没有共同祖先**（`merge-base` 返回空）
- 无法正常 merge，无法和 main 同步
- 即使只是一个文档文件，也成了孤立分支

### 教训

**建新分支前，先确保本地 main 是最新的：**
```bash
git checkout main
git pull
git checkout -b 新分支名
```

---

## 事故 3：`git push --force` 覆盖远程（两次）

### 发生了什么

两次事故中都用了裸 `git push --force`，没有用更安全的 `--force-with-lease`。

### 后果

- 覆盖了远程分支的已有内容
- 如果远程有他人的 commit，会直接丢失

### 教训

**禁止 `git push --force`。如果必须 force，用 `--force-with-lease`：**
```bash
git push --force-with-lease origin 分支名
```
`--force-with-lease` 会在 push 前检查远程分支是否被他人更新过，有人家的新 commit 就拒绝。

---

## 正确操作流程（记住这个）

### 第一次在新电脑上工作
```bash
git clone <仓库URL>              # ✅ clone，不要 init
cd 项目目录
git checkout <你的分支>           # ✅ 检出已有分支
```

### 日常改代码
```bash
git checkout main && git pull     # 先拉最新 main
git checkout <你的分支>
git merge main                    # 把 main 的更新合进来
# ... 改代码 ...
git add . && git commit -m "描述"
git push                          # ✅ 不需要 force
```

### 如果要建新分支
```bash
git checkout main && git pull               # 确保 main 最新
git checkout -b <新功能分支>                 # 从最新 main 开
# ... 改代码 ...
git push -u origin <新功能分支>              # ✅ 首次 push 不需要 force
```

### push 被拒绝时
```bash
# ❌ 不要用 --force！
git pull --rebase origin <分支名>  # ✅ 先拉取合并
# 解决冲突（如果有）
git push                           # ✅ 再次 push
```

---

## 为什么不用 force push

| 操作 | 风险 |
|------|------|
| `git push --force` | 直接覆盖远程，不管别人有没有新 commit |
| `git push --force-with-lease` | 相对安全：远程有新 commit 就拒绝 |
| 正常 `git push` | 安全：只有在能 fast-forward 时才成功 |

**一句话：如果 push 被拒，说明你的本地落后了，先 pull 而不是 force。**

---

## 当前仓库状态（2026-06-01）

| 仓库 | 用途 |
|------|------|
| `trchen12/cognition-hearing-game` | 导师仓库，不动 |
| `liweijie0329/naoli-town` | 个人仓库，双机同步，安全操作 |

`.claude/` 上下文（skills + memory + CLAUDE.md）已纳入 Git 版本管理，两台电脑 `git pull` 即可同步。

---

## 检查清单（每次 push 前）

- [ ] 我是用 `git clone` 初始化的吗？
- [ ] 我今天 pull 过 main 吗？
- [ ] 我的分支是基于最新 main 的吗？
- [ ] 我确认不需要 `--force` 吗？
- [ ] 我不会动 `main` 分支和别人的分支吗？
