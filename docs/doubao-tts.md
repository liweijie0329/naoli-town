# 豆包预生成语音包

Web 端读题优先播放 `assets/audio/manifest.json` 中登记的本地音频文件。豆包 API 只在本地生成音频包时调用，线上网页运行时不需要豆包密钥，也不会实时消耗 TTS 额度。

## 生成音频

先配置火山引擎语音合成环境变量，再运行生成脚本：

```bash
DOUBAO_TTS_APP_ID=你的AppID \
DOUBAO_TTS_ACCESS_KEY=你的AccessToken或AccessKey \
DOUBAO_TTS_VOICE_TYPE=zh_female_xiaohe_uranus_bigtts \
npm run generate:audio
```

脚本会读取 `data/tts-texts.json`，生成：

- `assets/audio/*.mp3`
- `assets/audio/manifest.json`

如果音频文件已存在，脚本会跳过；需要重新生成时加 `-- --force`：

```bash
npm run generate:audio -- --force
```

只想检查会生成哪些文件时：

```bash
npm run generate:audio -- --dry-run
```

## 修改题目语音

固定朗读文本维护在 `data/tts-texts.json`。每条语音都有一个稳定的 `key`，网页用这个 key 从 manifest 找对应 mp3。

常见 key：

- `instruction:trail:0`: 题目指导语
- `stimulus:memory1:word:0`: 记忆词逐词朗读
- `stimulus:digitForward:digit:0`: 数字顺背逐字朗读
- `stimulus:sentence:0`: 句子复述材料

改完文本后重新运行 `npm run generate:audio -- --force`。

## 可选变量

- `DOUBAO_TTS_API_VERSION`: 默认 `v3`，如需旧版 HTTP 接口可设为 `v1`。
- `DOUBAO_TTS_ENDPOINT`: 自定义火山接口地址。
- `DOUBAO_TTS_RESOURCE_ID`: V3 资源 ID，豆包语音合成模型 2.0 默认 `seed-tts-2.0`。
- `DOUBAO_TTS_FORMAT`: 默认 `mp3`。
- `DOUBAO_TTS_SAMPLE_RATE`: 默认 `24000`。
- `DOUBAO_TTS_VOICE_TYPE`: 默认音色。豆包语音合成模型 2.0 可直接填控制台音色表里的 `Voice_type`，例如 `zh_female_xiaohe_uranus_bigtts`。
- `DOUBAO_TTS_VOICE_CARTOON` / `DOUBAO_TTS_VOICE_GENTLE` / `DOUBAO_TTS_VOICE_CLEAR` / `DOUBAO_TTS_VOICE_SYSTEM`: 按网页内的语音风格覆盖音色。

如果使用旧版 HTTP 接口，通常还需要：

```bash
DOUBAO_TTS_API_VERSION=v1
DOUBAO_TTS_ACCESS_TOKEN=你的AccessToken
```

## 运行时回退

如果某个 key 没有生成音频，网页会自动回退到浏览器自带 `speechSynthesis`。这方便开发时先跑页面，再逐步补齐语音包。

## 参考文档

- 火山引擎语音合成大模型 API 文档：<https://www.volcengine.com/docs/6561/1257584>
- 旧版 HTTP 接口文档：<https://www.volcengine.com/docs/6561/79820>
