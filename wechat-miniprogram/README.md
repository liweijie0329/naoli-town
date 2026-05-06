# MoCA Quest 微信小程序原型

这是 `cognition-hearing-game` 的微信小程序版本，适合先在微信开发者工具和真实平板上预览。

## 导入

1. 打开微信开发者工具。
2. 选择 `导入项目`。
3. 项目目录选择本文件夹：`wechat-miniprogram`。
4. 没有正式 AppID 时，可先用测试号或游客模式运行。

## 当前能力

- 参加者姓名、年龄、性别、教育水平登录。
- 覆盖附件 MoCA 的 15 张任务卡。
- 交替连线、复制立方体、画钟表提供画布区域。
- 点击下一题时自动提交并评分。
- 后台记录总分、每题得分、总用时、每题用时、行为指标、画图临时图片路径和评分结果。
- 默认使用微信本地缓存保存记录，不需要付费服务器。
- 后台页支持复制 JSON，便于试点期手工汇总。

## 接入联网后台

编辑：

```text
utils/config.js
```

把 `apiBase` 改成 HTTPS 后端地址，例如：

```js
module.exports = {
  apiBase: "https://example.com"
};
```

后端需要支持：

- `POST /api/ai-score`
- `GET /api/sessions`
- `POST /api/sessions`

正式发布微信小程序时，还需要在微信公众平台配置合法服务器域名。
