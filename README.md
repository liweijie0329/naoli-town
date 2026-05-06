<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 脑力小镇（纯前端 + Supabase）

这个版本已经包含：
- React + Vite 前端
- Supabase 直连存储（无需单独后端服务）

## 1) 安装依赖

```bash
npm install
```

## 2) 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写以下值：

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

说明：
- `VITE_SUPABASE_URL` 填项目根地址（`https://xxx.supabase.co`）。
- `VITE_SUPABASE_ANON_KEY` 填 `anon/publishable` key。

## 3) 在 Supabase 执行建表 SQL

在 Supabase 的 SQL Editor 里执行：

```sql
create table if not exists public.brain_sessions (
  id uuid primary key default gen_random_uuid(),
  gender text not null,
  age integer not null check (age > 0 and age < 130),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  completed_stages integer not null default 0,
  total_score integer not null default 0,
  answers jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
```

## 4) 启动项目

```bash
npm run dev
```

启动后访问：`http://localhost:3000`

## 5) 当前联通逻辑

- 用户填写性别/年龄后，前端直接写入 Supabase 创建会话
- 用户完成测评后，前端直接更新会话记录和分数
- 数据写入 Supabase 表 `brain_sessions`

## 6) 部署到 iPad 可安装（PWA 方式）

只需要部署前端到 Vercel：

1. 在 Vercel 导入同一个仓库。
2. Framework 选择 Vite（通常自动识别）。
3. 在 Vercel 的 Environment Variables 中设置：
   - `VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY`
4. 点击 Deploy。

部署后在 iPad 安装：

1. 在 iPad Safari 打开你的 Vercel 前端地址。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。
4. 以后可像 App 一样从桌面打开。

## 7) 生产环境注意事项

- 当前为快速验证流程版本，RLS 策略可能是宽松的，正式上线前请收紧。
