<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 脑力小镇（前后端一体版）

这个版本已经包含：
- React + Vite 前端
- Express 后端 API
- Supabase 数据库存储

## 1) 安装依赖

```bash
npm install
```

## 2) 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写以下值：

```env
PORT=4000
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
# 如果你还没有 service_role key，可临时用：
SUPABASE_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

说明：
- `SUPABASE_URL` 填项目根地址（`https://xxx.supabase.co`），如果你手里是 `.../rest/v1/` 也可以，后端会自动处理。
- 推荐使用 `SUPABASE_SERVICE_ROLE_KEY`（服务端专用，不可暴露到前端）。
- 你提供的 `sb_publishable_...` 可以先用于本地调试，但要配合 RLS 策略。

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

会同时启动：
- 前端：`http://localhost:3000`
- 后端：`http://localhost:4000`

## 5) 当前联通逻辑

- 用户填写性别/年龄后，前端请求 `POST /api/sessions` 创建会话
- 用户完成测评后，前端请求 `PATCH /api/sessions/:id` 保存答题结果和分数
- 数据写入 Supabase 表 `brain_sessions`

## 6) 部署到 iPad 可安装（PWA 方式）

推荐组合：**Render 部署后端 + Vercel 部署前端**。

### 6.1 部署后端到 Render

1. 将项目推送到 GitHub。
2. 在 Render 创建 `Web Service`，连接你的仓库。
3. 配置：
   - Build Command: `npm install`
   - Start Command: `npm run start:server`
4. 在 Render 的 Environment 中设置：
   - `PORT=4000`（Render 也会自动注入端口，保留即可）
   - `SUPABASE_URL=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`（推荐）
   - `CORS_ORIGIN=https://你的前端域名.vercel.app`
5. 部署成功后记下后端地址，例如 `https://your-app.onrender.com`。

### 6.2 部署前端到 Vercel

1. 在 Vercel 导入同一个仓库。
2. Framework 选择 Vite（通常自动识别）。
3. 在 Vercel 的 Environment Variables 中设置：
   - `VITE_API_BASE_URL=https://your-app.onrender.com`
4. 点击 Deploy。

### 6.3 iPad 安装

1. 在 iPad Safari 打开你的 Vercel 前端地址。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。
4. 以后可像 App 一样从桌面打开。

## 7) 生产环境注意事项

- 当前为快速验证流程版本，RLS 策略可能是宽松的，正式上线前请收紧。
- 若后端返回跨域错误，检查 `CORS_ORIGIN` 是否和前端实际域名完全一致。
