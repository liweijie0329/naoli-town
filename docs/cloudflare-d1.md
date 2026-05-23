# Cloudflare Pages Functions + D1 部署

这个版本已经支持 Cloudflare Pages Functions 和 D1 数据库。部署后，任何平板打开同一个 HTTPS 网页，测评结果都会写入云端 D1。

## 1. 推送代码到 GitHub

Cloudflare Pages Functions 需要通过 Git 集成或 Wrangler 部署，单纯拖拽 zip 只能发布静态网页，不能发布 `functions/` 后端接口。

```bash
git add .
git commit -m "Add Cloudflare Pages Functions and D1 storage"
git push origin main
```

如果你的默认分支叫 `master`，把最后一行改成：

```bash
git push origin master
```

## 2. 创建 D1 数据库

进入 Cloudflare Dashboard：

1. `Workers & Pages`
2. `D1 SQL Database`
3. `Create database`
4. 数据库名填：`cognition_hearing_game`

创建后打开这个数据库的 `Console` / `Query`，把项目根目录的 `schema.sql` 全部复制进去运行。

如果是已经创建过的旧数据库，保存接口会自动补充 `case_number` 和 `participant_age` 列；也可以在 D1 Console 手动执行：

```sql
ALTER TABLE sessions ADD COLUMN case_number TEXT;
ALTER TABLE sessions ADD COLUMN participant_age INTEGER;
```

也可以用 Wrangler CLI：

```bash
npx wrangler d1 create cognition_hearing_game
npx wrangler d1 execute cognition_hearing_game --file=./schema.sql
```

## 3. 创建 Pages 项目

进入 Cloudflare Dashboard：

1. `Workers & Pages`
2. `Create application`
3. `Pages`
4. `Connect to Git`
5. 选择仓库：`trchen12/cognition-hearing-game`

构建设置：

```text
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: 留空
```

## 4. 绑定 D1

部署 Pages 项目后，进入：

```text
Pages 项目 > Settings > Functions > D1 database bindings
```

添加绑定：

```text
Variable name: DB
D1 database: cognition_hearing_game
```

保存后重新部署一次。

## 5. 验证

打开：

```text
https://你的项目名.pages.dev/api/health
```

如果看到：

```json
{
  "ok": true,
  "database": true,
  "storageMode": "cloudflare-d1"
}
```

说明后端和 D1 已接通。然后用平板打开 Pages 网址，完成测评后点保存，后台页面的记录会来自云端 D1。

## 6. 数据表

- `sessions`: 每次测评的参加者信息、总分、原始分、教育加分、总用时、各小类得分。
- `item_responses`: 每道题的答案、得分、开始结束时间、题目用时、行为指标、画图图片、语音题音频和 AI 评分结果。
- `hearing_events`: 听力环境检测、声道检查、练习反应、正式测试每一次“听到了/没听到”反应，便于 D1 SQL 查询。

语音题原始音频会写入 `item_responses.answer_json.audioRecordings`，后台详情可直接播放；如后续样本量很大或希望长期保存无压缩音频，建议下一步接 Cloudflare R2。

当前网页会把语音题保存音频压到 8 kHz WAV，句子复述单段 30 秒自动停止，动物词语流畅性 60 秒自动停止，单题音频 JSON 控制在 D1 单行/字符串限制以内。Cloudflare D1 免费库总容量适合小规模试用；样本量扩大后，原始音频建议迁移到 R2，D1 只保留音频 URL、转写文本和评分数据。
