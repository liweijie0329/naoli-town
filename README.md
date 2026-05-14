# MoCA 游戏化筛查小程序原型

这是一个面向智能平板横屏使用的 MoCA 游戏化测评 Web 原型，按附件中文 MoCA 量表题目与评分规则映射。

## 运行

```bash
npm start
```

打开 `http://localhost:5177`。

## 联网部署

项目已经适配公网 Web 部署：

- `Dockerfile`: 云端容器部署
- `render.yaml`: Render 自动部署和持久化磁盘配置
- `/api/health`: 健康检查接口
- `DATA_DIR`: 云端数据目录环境变量
- `functions/`: Cloudflare Pages Functions 后端接口
- `schema.sql`: Cloudflare D1 数据库建表脚本
- `npm run build`: 生成 Cloudflare Pages 静态目录 `dist/`

详细步骤见 [docs/deploy-online.md](./docs/deploy-online.md)。

Cloudflare Pages + D1 的部署步骤见 [docs/cloudflare-d1.md](./docs/cloudflare-d1.md)。

豆包预生成语音包接入见 [docs/doubao-tts.md](./docs/doubao-tts.md)。Web 端读题优先播放 `assets/audio/manifest.json` 中登记的本地音频；认知测试题干缺失时会回退到浏览器自带语音，登录页和听力测试提示语缺失时会静默，不再使用 macOS/浏览器系统朗读。

如果云平台要求绑定付费信息，可以先走免费路线：

- GitHub Pages / Cloudflare Pages：纯静态网页，任何平板可访问，数据保存在当前平板浏览器。
- 微信小程序：见 `wechat-miniprogram/`，可导入微信开发者工具预览，默认使用本机微信缓存。

详细说明见 [docs/free-deploy-options.md](./docs/free-deploy-options.md)。

## 主要能力

- 15 张任务卡覆盖附件 MoCA 的 30 分项目与 2 次不计分记忆学习。
- 交替连线、复制立方体、画钟表使用画布，并上传画布图片到 AI 评分接口。
- 选择题为主，句子复述、动物流畅性、延迟回忆、定向和画图题提交后由 AI 直接评分。
- 自动记录总分、教育水平加分、每题得分、每题用时、总用时、连线序列、敲击反应、画图图片、AI 评分结果。
- 本地开发的后台数据库为 JSON 文件：`data/sessions.json`；Cloudflare 部署后使用 D1 数据库。
- 纯静态免费网页或小程序免费模式下，后台记录会退化为当前设备本地缓存。

## AI 评分接入

默认 `POST /api/ai-score` 是演示评分服务；复制立方体和画钟表没有真实视觉模型时会返回 0 分并提示未配置。

生产环境推荐直接配置 OpenAI 视觉模型：

```bash
OPENAI_API_KEY=sk-... npm start
```

可选变量：

- `OPENAI_VISION_MODEL`：视觉评分模型，默认 `gpt-4.1-mini`
- `OPENAI_RESPONSES_ENDPOINT`：Responses API 地址，默认 `https://api.openai.com/v1/responses`
- `AI_SCORE_ENDPOINT`：保留的外部评分服务兼容入口；通常不需要配置

Cloudflare Pages 上线时，在项目 `Settings` → `Variables and Secrets` 中添加：

- `OPENAI_API_KEY`
- 可选 `OPENAI_VISION_MODEL`

内置视觉评分会接收：

```json
{
  "taskId": "clock",
  "image": "data:image/png;base64,...",
  "rubric": "评分标准文本",
  "rubricDetails": {},
  "clientAutoScore": null,
  "maxScore": 3
}
```

评分结果格式：

```json
{
  "scoreSuggestion": 2,
  "confidence": 0.82,
  "requiresHumanReview": false,
  "rubricMatched": true,
  "comment": "数字完整，指针方向不准确。",
  "criteria": []
}
```

## 研究注意

游戏化和选择题化会改变 MoCA 的原始作答负荷与猜测概率，不能直接等同纸笔版常模。正式基层大规模筛查前，建议完成授权、伦理审查、设备一致性测试、操作人员培训、AI 评分一致性验证，以及与标准 MoCA 的并测等值研究。
