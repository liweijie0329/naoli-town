# 联网网页版部署说明

目标：把 MoCA 游戏化测试 App 部署成公网 Web 服务，让任何平板通过浏览器访问，并让后续修改自动同步上线。

## 推荐架构

- 应用服务：Render Web Service
- 部署方式：Docker
- 自动更新：绑定 GitHub 仓库，开启 Auto Deploy
- 数据存储：Render Persistent Disk，挂载到 `/data`
- 本地数据文件：`sessions.json`
- 健康检查：`/api/health`

## 已完成的部署适配

- `server.mjs` 支持 `PORT`、`HOST`、`DATA_DIR` 环境变量。
- `Dockerfile` 可直接构建公网服务镜像。
- `render.yaml` 配置了 Web Service、持久化磁盘、健康检查和自动部署。
- `.gitignore` 和 `.dockerignore` 避免把本地测评数据、系统文件、临时文件推到云端。

## 上线步骤

1. 把 `cognition-hearing-game` 作为一个 GitHub 仓库推送。
2. 在 Render 新建 Blueprint 或 Web Service，选择该仓库。
3. Render 会读取 `render.yaml`，创建服务和 1GB 持久化磁盘。
4. 部署成功后，Render 会分配一个公网地址，形如：

   ```text
   https://cognition-hearing-game.onrender.com
   ```

5. 平板打开这个 HTTPS 链接即可使用。

## 后续同步更新

修改本地文件后，提交并推送到 GitHub：

```bash
git add .
git commit -m "Update MoCA game app"
git push
```

Render 开启 Auto Deploy 后会自动重新构建和上线，平板刷新页面即可看到新版。

## 数据注意

当前原型用 JSON 文件保存测评记录。小规模试点可以用持久化磁盘；正式大规模研究建议升级为 PostgreSQL 或其他受控数据库，并加入：

- 管理员账号登录
- 数据导出
- 访问权限控制
- HTTPS 域名
- 备份策略
- 伦理审批和隐私合规说明
