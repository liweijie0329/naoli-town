module.exports = {
  // 留空时使用微信本地缓存，不需要付费服务器。
  // 后续如果有 HTTPS 后端或云函数网关，把地址填在这里，例如：
  // apiBase: "https://example.com"
  apiBase: "",

  // 可选：填入腾讯位置服务 Key 后，定向题会把经纬度反查为城市和地点标准答案。
  // 正式小程序还需要把 https://apis.map.qq.com 加入 request 合法域名。
  tencentMapKey: ""
};
