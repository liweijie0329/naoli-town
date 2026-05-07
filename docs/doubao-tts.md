# 豆包语音合成接入

Web 端播放语音时会先调用后端代理 `POST /api/tts`。如果豆包配置缺失或接口失败，前端会自动回退到浏览器自带的 `speechSynthesis`，因此未配置时仍可继续演示。

## 本地环境变量

推荐使用火山引擎语音合成大模型 V3：

```bash
DOUBAO_TTS_APP_ID=你的AppID \
DOUBAO_TTS_ACCESS_KEY=你的AccessToken或AccessKey \
DOUBAO_TTS_VOICE_TYPE=zh_female_wanwanxiaohe_moon_bigtts \
npm start
```

可选变量：

- `DOUBAO_TTS_API_VERSION`: 默认 `v3`，如需旧版 HTTP 接口可设为 `v1`。
- `DOUBAO_TTS_ENDPOINT`: 自定义火山接口地址。
- `DOUBAO_TTS_RESOURCE_ID`: V3 资源 ID，默认 `volc.service_type.10029`。
- `DOUBAO_TTS_FORMAT`: 默认 `mp3`。
- `DOUBAO_TTS_SAMPLE_RATE`: 默认 `24000`。
- `DOUBAO_TTS_VOICE_TYPE`: 默认音色。
- `DOUBAO_TTS_VOICE_CARTOON` / `DOUBAO_TTS_VOICE_GENTLE` / `DOUBAO_TTS_VOICE_CLEAR` / `DOUBAO_TTS_VOICE_SYSTEM`: 按网页内的语音风格覆盖音色。

## Cloudflare Pages

在 Cloudflare Pages 项目里进入 `Settings > Environment variables`，添加同名变量即可。密钥只保存在后端函数环境中，前端不会拿到豆包 token。

## 参考文档

- 火山引擎语音合成大模型 API 文档：<https://www.volcengine.com/docs/6561/1257584>
- 旧版 HTTP 接口文档：<https://www.volcengine.com/docs/6561/79820>
