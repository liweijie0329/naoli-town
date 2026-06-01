# 科大讯飞语音识别接入

本项目的 `/api/asr` 会优先使用科大讯飞语音听写 WebAPI。部署时在 Cloudflare Pages 环境变量或 secret 中配置：

```text
ASR_PROVIDER=iflytek
IFLYTEK_APP_ID=你的 AppID
IFLYTEK_API_KEY=你的 APIKey
IFLYTEK_API_SECRET=你的 APISecret
```

前端录音会上传 16k、16bit、单声道 WAV。后端会剥离 WAV 头，按讯飞 WebSocket 协议发送 `audio/L16;rate=16000`、`encoding=raw` 的音频帧，并用 HMAC-SHA256 生成鉴权参数。

可选环境变量：

```text
IFLYTEK_FRAME_BYTES=1280
IFLYTEK_FRAME_DELAY_MS=0
IFLYTEK_TIMEOUT_MS=120000
IFLYTEK_VAD_EOS=10000
IFLYTEK_LANGUAGE=zh_cn
IFLYTEK_ACCENT=mandarin
IFLYTEK_DOMAIN=iat
```

讯飞官方文档建议按帧发送音频，生产环境如果遇到识别不稳定，可以把 `IFLYTEK_FRAME_DELAY_MS` 设为 `40`，让发送速度更接近实时录音。

方言识别需要在讯飞控制台开通对应能力，并按控制台/官方文档给出的参数设置 `IFLYTEK_LANGUAGE`、`IFLYTEK_ACCENT` 或 `IFLYTEK_DOMAIN`。本项目已经把这些参数做成环境变量，不需要再改前端代码。
