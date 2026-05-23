# 豆包预生成语音包

Web 端读题优先播放 `assets/audio/manifest.json` 中登记的本地音频文件。豆包 API 只在本地生成音频包时调用，线上网页运行时不需要豆包密钥，也不会实时消耗 TTS 额度。

## 生成音频

如果改了 `app.js` 里的记忆词库、警觉性数字串、数字顺背/倒背题本、数字键盘或连续减法题干，先把网页程序同步到语音文本清单：

```bash
npm run sync:audio-texts
```

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

普通运行会自动补齐新增 MP3；如果同一个 key 的文本变了，也会只重生成这些变更条目，不需要全量 `--force`。

只想处理文本已变化的旧条目时：

```bash
npm run generate:audio -- --changed-only
```

只想处理某一组 key 时：

```bash
npm run generate:audio -- --key-prefix stimulus:vigilance:digit
```

如果已经手动替换了本地 MP3，只需要刷新 manifest，可加 `--manifest-only`。

只想检查会生成哪些文件时：

```bash
npm run generate:audio -- --dry-run
```

## 修改题目语音

固定朗读文本维护在 `data/tts-texts.json`。每条语音都有一个稳定的 `key`，网页用这个 key 从 manifest 找对应 mp3。

常见 key：

- `instruction:trail:0`: 题目指导语
- `word:memory:01`: 50 个记忆词库中的第 1 个词，用于学习播报和候选按钮
- `digit:0`: 数字小键盘按钮语音
- `stimulus:digitForward:bank:01`: 数字顺背 50 道题本中的第 1 道，固定 5 位
- `stimulus:digitBackward:bank:01`: 数字倒背 50 道题本中的第 1 道，固定 3 位
- `instruction:serialSubtraction:3:0`: 随机减数为 3 时第一步题干，“100 减 3 等于多少？”
- `stimulus:sentence:0`: 句子复述材料
- `setup:intro` / `setup:option:*`: 登录页提示语和教育水平选项语音
- `hearing:intro` / `hearing:channel:*` / `hearing:practice` / `hearing:test` / `hearing:summary`: 听力测试流程提示语

改完文本后重新运行 `npm run generate:audio -- --force`。

## 随机题目语音包

随机题目仍然可以继续使用豆包预生成 MP3。原则是提前准备有限题本池，做题时从题本池随机抽取，避免线上实时合成。

- 记忆 10 选 5：预先准备 50 个记忆词，并为每个词生成一个 MP3；每次测评从这 50 个词中随机抽 10 个候选词和 5 个目标词，学习播报和候选按钮都引用这些词的音频 key。
- 数字顺背/倒背：数字顺背预先生成 50 道题和对应 MP3，每题固定 5 位数字；数字倒背预先生成 50 道题和对应 MP3，每题固定 3 位数字。做题时从各自题本池随机抽取一条，并播放该序列对应的 MP3。可同时保留 0-9 单数字 MP3 作为按钮语音或回退。
- 连续减法：为 1-9 的减数生成有限题干音频，例如“100 减 3 等于多少？”和“再减 3，等于多少？”。
- 词语相似性/定向选项：为正确答案池、错误答案池、星期、日期、地点等有限选项生成 MP3；随机选项只改变引用顺序。

如果语音条目增加到几百或几千个，仍可放在 `assets/audio/` 随 Cloudflare Pages 静态发布。若后续词库、场地库很大，可以把 MP3 上传到对象存储或 CDN，并在 `assets/audio/manifest.json` 中保存绝对 URL；网页读取 manifest 的方式不需要改变。

当前已提供 `npm run sync:audio-texts`：它会从 `app.js` 自动同步 50 个记忆词、警觉性数字串、50 道顺背数字题、50 道倒背数字题、数字键盘和连续减法题干，生成稳定 key；生成脚本会跳过已存在且文本未变化的文件，只补齐新增或文本已变化的条目。

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

如果认知测试题干的某个 key 没有生成音频，网页会自动回退到浏览器自带 `speechSynthesis`。登录页和听力测试提示语只播放本地语音包；缺少对应 MP3 时会静默，不再使用 macOS/浏览器系统朗读。

## 参考文档

- 火山引擎语音合成大模型 API 文档：<https://www.volcengine.com/docs/6561/1257584>
- 旧版 HTTP 接口文档：<https://www.volcengine.com/docs/6561/79820>
