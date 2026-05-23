const MEMORY_WORD_BANK = [
  "面孔", "天鹅绒", "教堂", "菊花", "红色", "学校", "苹果", "火车", "尺子", "蓝色",
  "鼻子", "医院", "绿色", "自行车", "手掌", "杯子", "钥匙", "窗户", "河流", "花园",
  "书包", "茶叶", "雨伞", "月亮", "桌子", "椅子", "电话", "鞋子", "衣服", "香蕉",
  "橙子", "报纸", "钱包", "门票", "铅笔", "毛巾", "手表", "灯泡", "桥梁", "森林",
  "面包", "牛奶", "剪刀", "枕头", "邮票", "照片", "草地", "石头", "海洋", "音乐"
];
const MEMORY_TARGET_COUNT = 5;
const MEMORY_CANDIDATE_COUNT = 10;
const TRAIL_EXPECTED = ["1", "甲", "2", "乙", "3", "丙", "4", "丁", "5", "戊"];
const VIGILANCE_DIGITS = "52945".split("");
const DIGIT_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const DIGIT_FORWARD_BANK = [
  "21854", "49317", "72605", "58429", "13786", "90524", "64139", "37281", "85073", "29614",
  "71942", "46380", "52816", "97035", "31469", "68207", "15938", "74621", "83056", "29175",
  "60824", "47590", "13258", "86413", "52097", "38961", "74105", "92648", "70532", "61482",
  "27950", "83614", "15279", "49720", "36081", "78524", "24196", "90853", "67420", "31985",
  "56290", "84713", "29506", "73048", "41862", "96315", "50729", "68143", "25487", "79016"
].map((stimulus, index) => ({ id: String(index + 1).padStart(2, "0"), stimulus, answer: stimulus }));
const DIGIT_BACKWARD_BANK = [
  "742", "318", "965", "204", "571", "836", "429", "750", "163", "592",
  "847", "306", "918", "275", "640", "381", "729", "504", "196", "852",
  "417", "630", "284", "759", "321", "907", "568", "143", "690", "235",
  "814", "376", "920", "485", "137", "602", "951", "724", "580", "369",
  "248", "791", "430", "865", "129", "704", "586", "312", "947", "260"
].map((stimulus, index) => ({ id: String(index + 1).padStart(2, "0"), stimulus, answer: stimulus.split("").reverse().join("") }));
const MEMORY_WAIT_MS = 5 * 60 * 1000;
const LOCAL_SESSIONS_KEY = "moca-game-local-sessions";
const ADMIN_PASSWORD = "123";
const SERIAL_SUBTRACTION_NUMBER = 7;
const SETUP_PROMPT_TEXT = "请填写姓名、出生日期、性别和教育水平。";
const LOGO_SRC = "./assets/logo.svg";
const MOCA_SHEET_IMAGE = "./assets/moca/moca-page.png";
const MOCA_SCALE_PDF = "./assets/moca/moca-scale.pdf";
const GRANDMA_AVATAR_SRC = "./assets/avatar-grandma.svg";
const GRANDPA_AVATAR_SRC = "./assets/avatar-grandpa.svg";
const NATURAL_VOICE_HINTS = ["xiaoxiao", "xiaoyi", "xiaobei", "ting-ting", "tingting", "mei-jia", "meijia", "google 普通话", "google 國語", "mandarin", "普通话", "美佳", "sin-ji"];
const SETUP_PROMPT_AUDIO_KEY = "setup:intro";
const ABSTRACTION_DISTRACTORS_BY_SUFFIX = {
  工具: ["劳动工具", "清洁工具", "厨房工具", "修理工具", "园艺工具", "写字工具", "绘画工具", "计算工具"],
  用的: ["吃饭用的", "写字用的", "做饭用的", "清洁用的", "照明用的", "穿戴用的", "娱乐用的", "装东西用的"],
  仪器: ["医疗仪器", "音乐仪器", "照明仪器", "通信仪器", "厨房仪器", "运动仪器", "教学仪器", "摄影仪器"]
};
const DEFAULT_CITY = "南京市";
const DEFAULT_PLACE = "医院";
const CITY_DISTRACTORS = [
  "北京市", "上海市", "杭州市", "苏州市", "广州市",
  "深圳市", "成都市", "武汉市", "西安市", "青岛市",
  "厦门市", "天津市", "重庆市", "长沙市", "郑州市",
  "合肥市", "福州市", "济南市", "宁波市", "无锡市"
];
const DEFAULT_CITY_OPTIONS = ["杭州市", "上海市", DEFAULT_CITY, "西安市"];
const PLACE_DISTRACTOR_POOL = ["医院", "学校", "社区中心", "公园", "商场", "超市", "图书馆", "体育中心", "博物馆", "车站"];
const PLACE_CORRECT_CATEGORIES = [...PLACE_DISTRACTOR_POOL, "银行", "药店", "菜市场"];
const DEFAULT_PLACE_OPTIONS = [DEFAULT_PLACE, "学校", "社区中心", "公园"];
const PLACE_SEARCH_TERMS = ["医院", "学校", "社区中心", "大学", "公园", "图书馆", "体育中心", "博物馆"];
const MIN_PLACE_DISTRACTOR_KM = 10;
const DRAWING_CONFIRM_NUDGE_MS = 10000;
const MOCA_AUDIO_DEFAULT_LEVEL_DB_HL = 35;
const MOCA_AUDIO_OFFSET_DB = 30;
const MOCA_AUDIO_REFERENCE_LEVEL_DB_HL = 65;
const MOCA_AUDIO_REFERENCE_VOLUME = 0.72;
const MOCA_AUDIO_MAX_LEVEL_DB_HL = 95;
const SELF_SELECTED_AUDIO_MIN_DB_HL = 20;
const SELF_SELECTED_AUDIO_MAX_DB_HL = 80;
const SELF_SELECTED_AUDIO_STEP_DB_HL = 5;
const VOLUME_SAMPLE_TEXT = "请调到您觉得清楚、舒服的音量。";
const VOLUME_SAMPLE_AUDIO_KEY = "volume:sample";
const NAMING_QUESTION_TEXT = "这是什么动物？";
const NAMING_QUESTION_AUDIO_KEY = "stimulus:naming:question";
const STATIC_TTS_MANIFEST_SRC = "./assets/audio/manifest.json";
const STATIC_AUDIO_BUFFER_CACHE_LIMIT = 96;
const LOCAL_DEV_API_ORIGIN = "http://127.0.0.1:5178";
const API_ORIGIN = location.protocol === "file:" ? LOCAL_DEV_API_ORIGIN : "";
const ASR_ENDPOINT = `${API_ORIGIN}/api/asr`;
const ASR_TIMEOUT_MS = 90000;
const FLUENCY_ASR_TIMEOUT_MS = 45000;
const AI_SCORE_TIMEOUT_MS = 45000;
const FLUENCY_LIVE_ASR_INTERVAL_MS = 5000;
const FLUENCY_LIVE_ASR_MIN_CHUNKS = 12;
const PREFER_CLOUDFLARE_ASR = true;
const MAX_DRAFT_AUDIO_RECORDING_BYTES = 700 * 1024;
const RECORDER_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/aac"
];
const SPEECH_RECOGNITION_RESTART_DELAY_MS = 260;
const SPEECH_RECOGNITION_BLOCKING_ERRORS = ["not-allowed", "service-not-allowed", "audio-capture", "network"];
const SPEECH_RECOGNITION_RECORDING_FALLBACK_ERRORS = ["service-not-allowed", "network"];
const VOICE_PROFILES = {
  cartoon: { label: "卡通童声", hints: ["xiaoxiao", "xiaoyi", "xiaobei", "tingting", "美佳", "sin-ji"], rateScale: 0.96, pitchOffset: 0.1 },
  gentle: { label: "温柔女声", hints: ["xiaoxiao", "ting-ting", "tingting", "mei-jia", "meijia", "female", "美佳"], rateScale: 1, pitchOffset: -0.04 },
  clear: { label: "清晰慢速", hints: ["google 普通话", "google 國語", "mandarin", "普通话", "中文"], rateScale: 0.82, pitchOffset: -0.16 },
  system: { label: "系统默认", hints: [], rateScale: 1.04, pitchOffset: -0.26 }
};
const HEARING_PROTOCOL_VERSION = "web-pure-tone-screening-v1";
const HEARING_SIDES = [
  { key: "right", label: "右耳", shortLabel: "右" },
  { key: "left", label: "左耳", shortLabel: "左" }
];
const HEARING_PRIMARY_FREQUENCIES = [500, 1000, 2000, 4000];
const HEARING_TEST_FREQUENCIES = [500, 1000, 2000, 4000, 8000];
const HEARING_LEVELS_DB_HL = [35, 45, 55, 65];
const HEARING_TONE_DURATION_MS = 1000;
const HEARING_FADE_SECONDS = 0.035;
const HEARING_MAX_NO_RESPONSE_DB_HL = 70;
const HEARING_PASS_PTA_DB_HL = 35;
const HEARING_ENVIRONMENT_SAMPLE_MS = 3000;
const HEARING_ENVIRONMENT_QUIET_RELATIVE_DB = -38;
const HEARING_PRACTICE_STEPS = [
  { ear: "right", frequencyHz: 1000, levelDbHl: 55 },
  { ear: "left", frequencyHz: 1000, levelDbHl: 55 }
];
const HEARING_GAIN_BY_LEVEL = {
  35: 0.035,
  45: 0.07,
  55: 0.14,
  65: 0.26
};
const HEARING_FREQUENCY_GAIN_SCALE = {
  500: 1.05,
  1000: 1,
  2000: 0.95,
  4000: 0.88,
  8000: 0.78
};
const HEARING_PROMPT_AUDIO_KEYS = {
  intro: "hearing:intro",
  practice: "hearing:practice",
  test: "hearing:test",
  summary: "hearing:summary",
  channel: {
    right: "hearing:channel:right",
    left: "hearing:channel:left"
  }
};
const HEARING_INTRO_PROMPT_TEXT = "请戴上耳机，保持安静。";

const TRADITIONAL_PHRASE_REPLACEMENTS = [
  ["甚麼", "什么"],
  ["什麼", "什么"],
  ["為什麼", "为什么"],
  ["怎麼", "怎么"],
  ["這個", "这个"],
  ["那個", "那个"],
  ["裡面", "里面"],
  ["裏面", "里面"],
  ["臺灣", "台湾"],
  ["鐘錶", "钟表"],
  ["時鐘", "时钟"],
  ["語音", "语音"],
  ["轉文字", "转文字"],
  ["識別", "识别"],
  ["動物", "动物"],
  ["詞語", "词语"],
  ["複述", "复述"],
  ["聽力", "听力"],
  ["認知", "认知"],
  ["測驗", "测验"],
  ["測試", "测试"],
  ["記憶", "记忆"],
  ["數字", "数字"],
  ["順序", "顺序"],
  ["畫圖", "画图"],
  ["後台", "后台"],
  ["資料", "数据"]
];

const TRADITIONAL_CHAR_REPLACEMENTS = {
  語: "语", 題: "题", 轉: "转", 錄: "录", 識: "识", 別: "别", 顯: "显", 體: "体", 簡: "简",
  聽: "听", 說: "说", 請: "请", 動: "动", 詞: "词", 暢: "畅", 複: "复", 選: "选", 擇: "择",
  記: "记", 憶: "忆", 測: "测", 驗: "验", 視: "视", 覺: "觉", 執: "执", 結: "结", 資: "资",
  後: "后", 臺: "台", 這: "这", 個: "个", 麼: "么", 為: "为", 對: "对", 還: "还", 會: "会",
  開: "开", 關: "关", 門: "门", 間: "间", 時: "时", 鐘: "钟", 錶: "表", 畫: "画", 圖: "图",
  長: "长", 順: "顺", 應: "应", 該: "该", 歲: "岁", 無: "无", 聲: "声", 麥: "麦", 風: "风",
  權: "权", 傳: "传", 雲: "云", 華: "华", 寫: "写", 廣: "广", 雙: "双", 發: "发", 髮: "发",
  隻: "只", 裡: "里", 裏: "里", 萬: "万", 與: "与", 來: "来", 國: "国", 樂: "乐", 電: "电",
  腦: "脑", 點: "点", 擊: "击", 報: "报", 導: "导", 匯: "汇", 歷: "历", 曆: "历", 實: "实",
  際: "际", 醫: "医", 學: "学", 樣: "样", 標: "标", 準: "准", 儘: "尽", 盡: "尽", 讓: "让",
  讀: "读", 錯: "错", 過: "过", 連: "连", 線: "线", 邊: "边", 張: "张", 將: "将", 區: "区",
  項: "项", 類: "类", 規: "规", 則: "则", 問: "问", 評: "评", 總: "总", 調: "调", 質: "质",
  貓: "猫", 雞: "鸡", 鷄: "鸡", 鴨: "鸭", 鵝: "鹅", 馬: "马", 魚: "鱼", 鳥: "鸟", 豬: "猪",
  龍: "龙", 龜: "龟", 鯨: "鲸", 鯊: "鲨", 鱷: "鳄", 鴿: "鸽", 鷹: "鹰", 鶴: "鹤", 獅: "狮",
  駱: "骆", 駝: "驼", 驢: "驴", 騾: "骡", 犛: "牦", 獵: "猎", 錢: "钱", 獺: "獭",
  鴉: "鸦", 鵲: "鹊", 鴕: "鸵", 鱸: "鲈", 鮭: "鲑", 鮑: "鲍", 蟬: "蝉", 蠍: "蝎",
  蠶: "蚕", 蟲: "虫", 蟻: "蚁", 蠅: "蝇", 蝸: "蜗", 鸚: "鹦", 鵡: "鹉", 蝦: "虾", 鳳: "凤",
  麗: "丽", 壞: "坏", 乾: "干", 併: "并", 並: "并", 於: "于", 卻: "却", 親: "亲", 愛: "爱",
  變: "变", 優: "优", 勢: "势", 劃: "划", 參: "参", 處: "处"
};

function toSimplifiedChinese(text) {
  let output = String(text || "");
  TRADITIONAL_PHRASE_REPLACEMENTS.forEach(([from, to]) => {
    output = output.split(from).join(to);
  });
  return Array.from(output, (char) => TRADITIONAL_CHAR_REPLACEMENTS[char] || char).join("");
}

const SFX_SOURCES = {
  nav: "./assets/sfx/nav.mp3",
  pick: "./assets/sfx/pick.mp3",
  recordStart: "./assets/sfx/record_start.mp3",
  start: "./assets/sfx/start.mp3",
  finish: "./assets/sfx/finish.mp3",
  success: "./assets/sfx/success.mp3"
};
const SFX_VOLUME = {
  nav: 0.045,
  start: 0.045,
  recordStart: 0.05
};

function playSfx(name) {
  if (["pick", "success", "finish"].includes(name)) return;
  const src = SFX_SOURCES[name];
  if (!src) return;
  const audio = new Audio(src);
  audio.volume = SFX_VOLUME[name] ?? 0.04;
  audio.play().catch(() => {});
}

const animalEmojis = {
  lion: "🦁",
  rhino: "🦏",
  camel: "🐫"
};

const animalNameBank = [
  "狗", "猫", "牛", "马", "羊", "猪", "鸡", "鸭", "鹅", "兔", "鼠", "虎", "狮子", "犀牛", "骆驼",
  "大象", "猴", "猩猩", "熊", "鹿", "长颈鹿", "斑马", "豹子", "狼", "狐狸", "河马", "袋鼠", "熊猫",
  "蛇", "乌龟", "鳄鱼", "青蛙", "鱼", "鲸", "海豚", "鲨鱼", "鸟", "鹰", "孔雀", "企鹅", "老虎", "猴子",
  "兔子", "老鼠", "猫头鹰", "燕子", "麻雀", "鹦鹉", "鸽子", "蝴蝶", "蜜蜂", "蚂蚁", "蜻蜓", "蜗牛",
  "螃蟹", "虾", "章鱼", "海星", "海马", "海狮", "海豹", "海龟", "金鱼", "鲤鱼", "鲫鱼", "驴",
  "骡子", "牦牛", "羚羊", "梅花鹿", "驯鹿", "麋鹿", "野猪", "豪猪", "刺猬", "松鼠", "仓鼠",
  "蝙蝠", "猎豹", "金钱豹", "美洲豹", "北极熊", "棕熊", "黑熊", "考拉", "树懒", "水獭", "海獭",
  "鼹鼠", "穿山甲", "食蚁兽", "海牛", "海象", "海鸥", "喜鹊", "乌鸦", "鹤", "天鹅", "火鸡",
  "鸵鸟", "啄木鸟", "百灵鸟", "壁虎", "蜥蜴", "变色龙", "蟒蛇", "眼镜蛇", "娃娃鱼", "蝾螈",
  "河豚", "带鱼", "鲈鱼", "鲑鱼", "鲍鱼", "水母", "海胆", "蚯蚓", "螳螂", "蟋蟀", "蝉",
  "蚊子", "苍蝇", "蟑螂", "蜘蛛", "蝎子", "蜈蚣", "蚕", "瓢虫", "甲虫", "蛾子", "蚂蚱",
  "蝗虫", "龙", "凤凰", "麒麟"
];

const animalAliasPairs = [
  ["小狗", "狗"], ["狗狗", "狗"], ["犬", "狗"],
  ["小猫", "猫"], ["猫咪", "猫"],
  ["黄牛", "牛"], ["水牛", "牛"], ["奶牛", "牛"], ["公牛", "牛"], ["母牛", "牛"], ["小牛", "牛"],
  ["山羊", "羊"], ["绵羊", "羊"], ["羊驼", "羊驼"], ["草泥马", "羊驼"], ["小羊", "羊"], ["公羊", "羊"], ["母羊", "羊"],
  ["公鸡", "鸡"], ["母鸡", "鸡"],
  ["小猪", "猪"], ["野猪", "野猪"],
  ["鸭子", "鸭"], ["鹅子", "鹅"],
  ["兔子", "兔"], ["老鼠", "鼠"], ["耗子", "鼠"], ["老虎", "虎"], ["猴子", "猴"],
  ["鲸鱼", "鲸"], ["鱼儿", "鱼"],
  ["狮", "狮子"], ["豹", "豹子"], ["大熊猫", "熊猫"], ["熊猫", "熊猫"],
  ["象", "大象"], ["鲸鱼", "鲸"], ["鲨", "鲨鱼"], ["鲨鱼", "鲨鱼"], ["海豚", "海豚"],
  ["乌龟", "乌龟"], ["海龟", "海龟"], ["龟", "乌龟"], ["鳄", "鳄鱼"], ["鳄鱼", "鳄鱼"],
  ["青蛙", "青蛙"], ["蛙", "青蛙"], ["蟒", "蟒蛇"], ["蟒蛇", "蟒蛇"], ["眼镜蛇", "眼镜蛇"],
  ["大象", "大象"], ["长颈鹿", "长颈鹿"], ["猫头鹰", "猫头鹰"], ["小白兔", "兔"],
  ["天鹅", "天鹅"], ["鸵鸟", "鸵鸟"], ["海鸥", "海鸥"], ["乌鸦", "乌鸦"], ["喜鹊", "喜鹊"],
  ["狐狸", "狐狸"], ["狐", "狐狸"], ["狼", "狼"], ["熊", "熊"], ["鹿", "鹿"], ["小鹿", "鹿"], ["梅花鹿", "梅花鹿"], ["驴", "驴"],
  ["蚂蚱", "蚂蚱"], ["蚊", "蚊子"], ["苍蝇", "苍蝇"], ["蜗牛", "蜗牛"], ["螃蟹", "螃蟹"],
  ["虫子", "虫"], ["昆虫", "虫"],
  ["恐龙", "恐龙"], ["龙", "龙"], ["凤凰", "凤凰"], ["麒麟", "麒麟"],
  ["鹅鹅", "鹅"], ["小鹅", "鹅"],
  ["幺鸡", "鸡"], ["鸡鸡", "鸡"],
  ["鱼鱼", "鱼"], ["小鱼", "鱼"],
  ["鸟儿", "鸟"], ["小鸟", "鸟"],
  ["耗牛", "牦牛"], ["毛牛", "牦牛"],
  ["卢鱼", "鲈鱼"], ["归鱼", "鲑鱼"], ["包鱼", "鲍鱼"]
];

const fluencyAsrAnimalCorrections = [
  ["老胡", "老虎"], ["脑虎", "老虎"],
  ["西牛", "犀牛"], ["洗牛", "犀牛"],
  ["骆坨", "骆驼"], ["落驼", "骆驼"],
  ["长劲鹿", "长颈鹿"], ["长颈路", "长颈鹿"], ["长景鹿", "长颈鹿"],
  ["斑妈", "斑马"], ["班马", "斑马"],
  ["河嘛", "河马"], ["和马", "河马"],
  ["大想", "大象"], ["大项", "大象"],
  ["毛牛", "牦牛"], ["耗牛", "牦牛"],
  ["卢鱼", "鲈鱼"], ["归鱼", "鲑鱼"], ["包鱼", "鲍鱼"],
  ["猴几", "猴子"], ["猴纸", "猴子"],
  ["兔纸", "兔子"],
  ["松数", "松鼠"], ["仓数", "仓鼠"],
  ["小鸟儿", "鸟"], ["鸟鸟", "鸟"],
  ["蝴铁", "蝴蝶"], ["虎蝶", "蝴蝶"]
];

const fluencyFillerPhrases = [
  "还有", "然后", "再来", "一个", "一种", "动物", "名字", "名称", "我知道", "想到",
  "比如", "例如", "尽可能", "说出", "说一下", "先说", "最后", "马上", "这个", "那个",
  "嗯", "啊", "呃", "额"
];

const DRAWING_AI_RUBRICS = {
  cube: [
    { key: "threeDimensional", label: "三维结构", detail: "图形只要能辨认为三维盒状/立方体结构即可；手绘透视不标准、线条抖动不扣分。" },
    { key: "allLinesPresent", label: "线条完整", detail: "所有主要边线基本存在即可；允许线条轻微断开、重描或歪斜。" },
    { key: "noExtraLines", label: "无多余线", detail: "不能有明显多余线条。" },
    { key: "parallelAndSimilar", label: "平行等长", detail: "相对边大致平行、长度接近即可；允许手绘造成的角度和长度轻微偏差。" }
  ],
  clock: [
    { key: "contour", label: "轮廓", detail: "表盘可以是圆、椭圆或近似圆；允许手抖、轻微开口、变形或不居中。" },
    { key: "numbers", label: "数字", detail: "1-12 基本写全且能辨认，总体按顺时针顺序分布即可；允许歪斜、大小不一、间距不均或轻微偏离象限。" },
    { key: "hands", label: "指针", detail: "必须看得到两根明确的指针/线段才可能给分；没有指针或只有一根指针时本项固定 0 分。允许角度小偏差，但需能看出分针指向 2 附近、时针在 11 附近且时针较短。" }
  ]
};

const orientationPrompts = [
  { key: "year", label: "今年是哪一年？", fields: ["year"] },
  { key: "date", label: "今天是几月几号？", fields: ["month", "day"] },
  { key: "weekday", label: "今天星期几？", fields: ["weekday"] },
  { key: "city", label: "你现在在哪个城市？", fields: ["city"] },
  { key: "place", label: "这里是什么地方？", fields: ["place"] }
];

const tasks = [
  {
    id: "trail",
    domain: "视空间与执行功能",
    title: "交替连线",
    maxScore: 1,
    type: "trail",
    modality: "拖拽连线",
    prompt: "请从一个圆圈拖线连到另一个圆圈，按数字和汉字交替上升的规则完成。",
    instruction: "请按数字和汉字交替上升的规则，把所有圆圈用一条线连起来。每次从当前圆圈拖到下一个圆圈。",
    scoring: "最终连线序列只要包含 1-甲-2-乙-3-丙-4-丁-5-戊 的正确顺序，即给 1 分；重复点击同一节点不扣分，撤销后按最后留下的序列判分。"
  },
  {
    id: "cube",
    domain: "视空间与执行功能",
    title: "复制立方体",
    maxScore: 1,
    type: "drawing",
    drawingKind: "cube",
    modality: "画图",
    prompt: "请照着左侧图形，在空白区域尽可能精确地画一遍。",
    instruction: "请您照着这幅图在下面的空白处再画一遍，并尽可能精确。",
    scoring: "按 MoCA 标准并考虑手绘误差：图形能辨认为三维结构、主要线条基本存在、无明显无关多余线、相对边大致平行且长度接近；四项全部满足给 1 分，任一项明显不满足给 0 分。"
  },
  {
    id: "clock",
    domain: "视空间与执行功能",
    title: "画钟表",
    maxScore: 3,
    type: "drawing",
    drawingKind: "clock",
    modality: "画图",
    prompt: "请画一个钟表，填上所有数字，并指示出 11 点过 10 分。",
    instruction: "请您在此处画一个钟表，填上所有的数字并指示出 11 点 10 分。",
    scoring: "按 MoCA 标准并考虑手绘误差：轮廓 1 分，圆、椭圆或近似圆均可；数字 1 分，1-12 基本写全、可辨认且总体顺时针即可；指针 1 分，必须看得到两根指针且大致表示 11 点 10 分，时针较短。没有指针或只有一根指针时，指针项为 0 分。"
  },
  {
    id: "naming",
    domain: "命名",
    title: "动物命名",
    maxScore: 3,
    type: "naming",
    modality: "逐张看图选择",
    prompt: "这是什么动物？",
    instruction: "请您告诉我这个动物的名字。",
    scoring: "狮子、犀牛、骆驼或单峰骆驼，各 1 分。",
    items: [
      { key: "lion", answer: "狮子", options: ["狮子", "老虎", "豹子", "狐狸"] },
      { key: "rhino", answer: "犀牛", options: ["河马", "犀牛", "水牛", "野猪"] },
      { key: "camel", answer: "骆驼", options: ["长颈鹿", "马", "骆驼", "羊驼"] }
    ]
  },
  {
    id: "memory1",
    domain: "记忆",
    title: "词语学习 第一次",
    maxScore: 0,
    type: "memory",
    modality: "语音+10选5",
    prompt: "我会读几个词，请您注意听并记住。读完后，把记住的词告诉我。",
    instruction: "这是一个记忆力测验。我会给您读几个词，您要注意听，一定要记住，这些词后面还会再问。当我读完后，请选出您记住的词。",
    scoring: "第一次学习不计入总分，仅记录编码表现和用时。",
    trial: 1
  },
  {
    id: "memory2",
    domain: "延迟回忆",
    title: "词语回忆 第二次",
    maxScore: 5,
    type: "memory",
    modality: "10选5",
    prompt: "请从这些词中选出刚才记过的 5 个词。",
    instruction: "刚才我给您读了几个词让您记住，请您再尽量回忆一下，选出这些词都有什么。",
    scoring: "选出一个正确目标词给 1 分，共 5 分。",
    trial: 2
  },
  {
    id: "digitForward",
    domain: "注意",
    title: "数字顺背",
    maxScore: 1,
    type: "choice",
    modality: "听觉+数字卡",
    prompt: "请听一串数字，听完后按原顺序点击数字卡。",
    instruction: "下面我说一些数字，您仔细听。说完后，请按原来的顺序选择出来。",
    scoring: "从 50 道五位数字题本中随机抽取 1 道，按原顺序完全正确给 1 分，否则 0 分。",
    bank: DIGIT_FORWARD_BANK
  },
  {
    id: "digitBackward",
    domain: "注意",
    title: "数字倒背",
    maxScore: 1,
    type: "choice",
    modality: "听觉+数字卡",
    prompt: "请听一串数字，听完后按倒着的顺序点击数字卡。",
    instruction: "下面我再说一些数字，您仔细听。说完后，请按相反的顺序选择出来。",
    scoring: "从 50 道三位数字题本中随机抽取 1 道，倒背完全正确给 1 分，否则 0 分。",
    bank: DIGIT_BACKWARD_BANK
  },
  {
    id: "vigilance",
    domain: "注意",
    title: "听到 1 就敲一下",
    maxScore: 1,
    type: "vigilance",
    modality: "听觉反应",
    prompt: "请听一串数字。每当听到数字 1 时，敲一下按钮；其他数字不要敲。",
    instruction: "下面我要读出一系列数字，请注意听。每当我读到 1 的时候，您就敲一下按钮。当我读其他的数字时不要敲。",
    scoring: "完全正确或只有一次错误给 1 分；错误数大于或等于 2 给 0 分。"
  },
  {
    id: "serial7",
    domain: "注意",
    title: "100 连续减 7",
    maxScore: 3,
    type: "serial7",
    modality: "数字键盘",
    prompt: "请从 100 中连续减 7，一共算 5 次。",
    instruction: "现在请您做一道计算题，从 100 中减 7，而后从得数中再减 7，一直往下减，直到我让您停下为止。",
    scoring: "4-5 个正确给 3 分，2-3 个正确给 2 分，1 个正确给 1 分，0 个正确给 0 分。"
  },
  {
    id: "sentence",
    domain: "语言",
    title: "句子复述",
    maxScore: 2,
    type: "sentence",
    modality: "语音识别",
    prompt: "请尽可能原原本本地复述听到的句子。",
    instruction: "现在我要对您说一句话，我说完后请您把我说的话尽可能原原本本地重复出来。",
    scoring: "每句话准确复述给 1 分。省略、替换、增加或语序变化均不得分。",
    sentences: [
      "我只知道今天张亮是帮过忙的人",
      "当狗在房间里的时候，猫总是藏在沙发下"
    ]
  },
  {
    id: "fluency",
    domain: "语言",
    title: "动物词语流畅性",
    maxScore: 1,
    type: "fluency",
    modality: "60秒语音",
    prompt: "请在 1 分钟内尽可能多地说出动物的名字。",
    instruction: "请您尽可能快、尽可能多地说出您所知道的动物的名称。时间是 1 分钟。",
    scoring: "1 分钟内说出的动物名称不少于 11 个给 1 分，否则 0 分。神化动物也算正确。"
  },
  {
    id: "abstraction",
    domain: "抽象",
    title: "词语相似性",
    maxScore: 2,
    type: "abstractionChoice",
    modality: "4选1",
    prompt: "请选择两样东西在什么方面相类似。",
    instruction: "请您说说两个词在什么方面相类似，或者说它们有什么共性。",
    scoring: "交通/运输工具 1 分；测量仪器/测量用的 1 分。",
    items: [
      { key: "orangeBanana", words: ["桔子", "香蕉"], emojis: ["🍊", "🍌"], answer: "水果", options: ["水果", "电脑", "学校", "无聊"], practice: true },
      { key: "trainBike", words: ["火车", "自行车"], emojis: ["🚆", "🚲"], correctAnswers: ["运输工具", "交通工具", "旅行用的"] },
      { key: "watchRuler", words: ["手表", "尺子"], emojis: ["⌚", "📏"], correctAnswers: ["测量仪器", "测量用的"] }
    ]
  },
  {
    id: "orientation",
    domain: "定向",
    title: "时间地点定向",
    maxScore: 6,
    type: "orientation",
    modality: "选择题+定位",
    prompt: "请选择现在的时间和地点。",
    instruction: "告诉我今天是什么日期。然后请告诉我这是什么地方，它在哪个城市。",
    scoring: "星期、月份、年份、日期、地点、城市各 1 分。"
  }
];

const rubricGroups = [
  {
    title: "视空间与执行功能",
    items: [
      { title: "交替连线测验", prompt: "请您按照从数字到汉字并逐渐升高的顺序画一条连线。从 1 连向甲，再连向 2，并一直连下去，到戊结束。", scoring: "最终连线序列包含 1-甲-2-乙-3-丙-4-丁-5-戊 的正确顺序即给 1 分。重复点击同一节点不扣分，撤销后按最后留下的序列判分。", image: true },
      { title: "复制立方体", prompt: "请您照着这幅图在下面的空白处再画一遍，并尽可能精确。", scoring: "符合下列标准时给 1 分：图形可辨认为三维结构；主要线条基本存在；无明显无关多余线；相对边大致平行且长度接近。允许手绘线条抖动、重描、轻微断开、角度不完美或小幅长度偏差。", image: true },
      { title: "画钟表", prompt: "请您在此处画一个钟表，填上所有的数字并指示出 11 点 10 分。", scoring: "轮廓 1 分：圆、椭圆或近似圆均可，允许轻微缺陷。数字 1 分：1-12 基本写全、可辨认、总体顺时针分布即可，允许歪斜、大小不一、间距不均。指针 1 分：必须看得到两根指针并大致表示 11 点 10 分，时针短于分针；没有指针或只有一根指针时，指针项为 0 分。", image: true }
    ]
  },
  {
    title: "命名与记忆",
    items: [
      { title: "命名", prompt: "请您告诉我这个动物的名字。", scoring: "每答对一个给 1 分。正确回答是：狮子；犀牛；骆驼或单峰骆驼。", image: true },
      { title: "词语学习", prompt: "我会给您读几个词，您要注意听，一定要记住。读完后，把您记住的词告诉我。", scoring: "学习试次不记分。", image: false },
      { title: "延迟回忆", prompt: "刚才我给您读了几个词让您记住，请您再尽量回忆一下，告诉我这些词都有什么？", scoring: "在未经提示下自由回忆正确的词，每词给 1 分。", image: false }
    ]
  },
  {
    title: "注意",
    items: [
      { title: "数字顺背", prompt: "下面我说一些数字，您仔细听。说完后，请按原来的顺序选择出来。", scoring: "复述准确给 1 分。", image: false },
      { title: "数字倒背", prompt: "下面我再说一些数字，您仔细听。说完后，请按相反的顺序选择出来。", scoring: "倒背正确回答为 2-4-7，复述准确给 1 分。", image: false },
      { title: "警觉性", prompt: "下面我要读出一系列数字，请注意听。每当我读到 1 的时候，您就敲一下按钮。当我读其他数字时不要敲。", scoring: "完全正确或只有一次错误给 1 分，否则不给分。错误指读 1 时没有敲，或读其他数字时敲了。", image: false },
      { title: "100 连续减 7", prompt: "从 100 中连续减 7，一共回答 5 步。", scoring: "全部错误记 0 分，1 个正确给 1 分，2-3 个正确给 2 分，4-5 个正确给 3 分。每一步按减 7 单独评定。", image: false }
    ]
  },
  {
    title: "语言与抽象",
    items: [
      { title: "句子复述", prompt: "我说完后请您把我说的话尽可能原原本本地重复出来。", scoring: "复述正确，每句话分别给 1 分。复述必须准确，省略、替换或增加不得分。", image: false },
      { title: "词语流畅性", prompt: "请您尽可能快、尽可能多地说出您所知道的动物的名称。时间是 1 分钟。", scoring: "1 分钟内说出的动物名称不少于 11 个给 1 分。龙、凤凰、麒麟等神化动物也算正确。", image: false },
      { title: "词语相似性", prompt: "请您说说两个词在什么方面相类似，或者说它们有什么共性。", scoring: "火车和自行车：运输工具、交通工具、旅行用的。手表和尺子：测量仪器、测量用的。每组正确给 1 分。", image: false }
    ]
  },
  {
    title: "定向",
    items: [
      { title: "时间地点定向", prompt: "告诉我今天是什么日期。再问：告诉我这是什么地方，它在哪个城市？", scoring: "星期、月份、年份、日期、地点、城市每正确回答一项给 1 分。必须回答精确日期和地点，日期多一天或少一天均不给分。", image: false }
    ]
  }
];

const root = document.querySelector("#app");
const educationLevels = ["", "小学", "初中", "中专", "高中", "大专", "本科及以上"];

localStorage.removeItem("moca-game-draft");

let state = createInitialState();
const sessionDetailCache = new Map();
let activeRubricItem = null;
let activeCanvas = null;
let activeCanvasTaskId = null;
let activeCtx = null;
let drawing = false;
let drawingUndoStacks = {};
let menuOpen = false;
let cognitionMenuOpen = false;
let protectedViewsUnlocked = false;
let adminPasswordDialog = null;
let manualTranscriptComposing = false;
let setupPromptAttempted = false;
let setupPromptPlayed = false;
let setupPromptRetryPending = false;
let hearingIntroPromptStartedAt = 0;
let volumeSampleTimer = null;
let lastVolumeSampleAt = 0;
let playState = "开始";
let voiceState = "待说";
let speechRecognition = null;
let recognizing = false;
let mediaRecorder = null;
let pcmRecorder = null;
let micStream = null;
let recordingAudio = false;
let speechTranscribing = false;
let speechRecognitionWanted = false;
let speechRecognitionBlocked = false;
let speechSessionBaseFinal = "";
let activeSpeechTaskId = null;
let activeSpeechStep = 0;
let audioChunks = [];
let speechPlaybackId = 0;
let speechItemTimer = null;
let speechTextFallbackTimer = null;
let speechRecognitionRestartTimer = null;
let activeSpeechAudio = null;
let activeHearingTone = null;
let staticTtsManifest = null;
let staticTtsManifestPromise = null;
let staticAudioPreloadTimer = null;
const staticAudioBufferCache = new Map();
const staticAudioBufferPromiseCache = new Map();
let instructionTimer = null;
let speechPlaybackPurpose = null;
let speechAudioContext = null;
let activeSpeechBufferSources = [];
let speechItemTimers = [];
let micPermissionReady = false;
let speechRecognitionStartPending = false;
let speechRecognitionLastError = null;
let releaseMicAfterRecordingStop = false;
let recordingWillTranscribe = false;
let activeTranscriptionId = 0;
let vigilanceTimer = null;
let vigilanceAutoAdvanceTimer = null;
let vigilancePointerTapAt = 0;
let fluencyTimer = null;
let fluencyAutoAdvanceInProgress = false;
let trailGuideFrame = null;
let trailGuideTick = 0;
let trailDragStart = null;
let trailDragPoint = null;
let trailGuidePracticeDragStart = null;
let trailGuidePracticeDragPoint = null;
let viewportRenderTimer = null;
let drawingIdleTimers = [];
let pendingAiScoreTaskIds = new Set();
let backgroundSessionSaveTimer = null;
let immediateInstructionPlayback = false;
let setupVoiceRecorder = null;

updateViewportMetrics();
bindViewportMetrics();
migrateState();
render();
void loadStaticTtsManifest();

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  resetState();
  render();
});

function updateViewportMetrics() {
  const viewport = window.visualViewport;
  const width = Math.max(1, Math.floor(viewport?.width || window.innerWidth || document.documentElement.clientWidth || 1024));
  const height = Math.max(1, Math.floor(viewport?.height || window.innerHeight || document.documentElement.clientHeight || 768));
  document.documentElement.style.setProperty("--app-width", `${width}px`);
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.documentElement.style.setProperty("--app-short", `${Math.min(width, height)}px`);
  document.documentElement.style.setProperty("--app-long", `${Math.max(width, height)}px`);
  document.documentElement.dataset.orientation = width >= height ? "landscape" : "portrait";
}

function bindViewportMetrics() {
  const updateOnly = () => updateViewportMetrics();
  const updateAndRender = () => {
    updateViewportMetrics();
    if (isEditableElementFocused()) return;
    window.clearTimeout(viewportRenderTimer);
    viewportRenderTimer = window.setTimeout(() => {
      if (state.view !== "setup") render();
    }, 160);
  };

  window.addEventListener("resize", updateAndRender, { passive: true });
  window.addEventListener("orientationchange", updateAndRender, { passive: true });
  window.visualViewport?.addEventListener("resize", updateAndRender, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateOnly, { passive: true });
}

function isEditableElementFocused() {
  const element = document.activeElement;
  if (!element || element === document.body) return false;
  if (element.isContentEditable) return true;
  if (element.matches?.("textarea, select")) return true;
  if (!element.matches?.("input")) return false;
  const type = (element.getAttribute("type") || "text").toLowerCase();
  return !["button", "checkbox", "color", "file", "hidden", "radio", "range", "reset", "submit"].includes(type);
}

function createInitialState() {
  return {
    view: "setup",
    activeTaskIndex: 0,
    sessionId: crypto.randomUUID(),
    startedAt: null,
    finishedAt: null,
    participant: { name: "", birthYear: "1966-01-01", sex: "", educationLevel: "" },
    hearingScreening: createHearingScreeningState(),
    responses: {},
    drawings: {},
    trail: createTrailState(),
    taskRuntime: createTaskRuntime(),
    memoryWaitStartedAt: null,
    resumeAfterMemory2Index: null,
    playedInstructionKeys: {},
    completedInstructionKeys: {},
    acknowledgedInstructionKeys: {},
    taskSubmitting: null,
    permissions: { microphone: "unknown", location: "unknown" },
    voiceProfile: "cartoon",
    sessionSaveStatus: "idle",
    sessionSaveError: "",
    sessionSavedAt: null,
    setupAttempted: false,
    setupVoiceRecording: false,
    setupVoiceTranscribing: false,
    adminSessions: [],
    selectedSession: null,
    selectedSessionLoading: false
  };
}

function createTrailState(overrides = {}) {
  return {
    sequence: [],
    edges: [],
    errors: 0,
    undoCount: 0,
    correctStep: 0,
    ...overrides
  };
}

function createHearingScreeningState(overrides = {}) {
  return {
    protocolVersion: HEARING_PROTOCOL_VERSION,
    phase: "intro",
    status: "not_started",
    startedAt: null,
    finishedAt: null,
    channelCheckIndex: 0,
    practiceIndex: 0,
    trialIndex: 0,
    levelIndex: 0,
    currentTonePlayed: false,
    currentTonePlaying: false,
    lastToneStartedAt: null,
    lastToneEndedAt: null,
    message: "",
    environment: { status: "not_checked", relativeDb: null, checkedAt: null },
    environmentChecks: [],
    channelChecks: [],
    practiceResponses: [],
    responses: [],
    thresholds: { right: {}, left: {} },
    summary: null,
    selfSelectedAudioLevelDbHl: MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
    selfSelectedAudioConfirmedAt: null,
    mocaAudioLevelDbHl: MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
    mocaAudioAdjustedAt: null,
    trials: createHearingTrials(),
    ...overrides
  };
}

function createHearingTrials() {
  return HEARING_SIDES.flatMap((side) => (
    HEARING_TEST_FREQUENCIES.map((frequencyHz) => ({
      ear: side.key,
      frequencyHz,
      primary: HEARING_PRIMARY_FREQUENCIES.includes(frequencyHz)
    }))
  ));
}

function normalizeHearingScreening(screening = {}) {
  const base = createHearingScreeningState(screening && typeof screening === "object" ? screening : {});
  base.protocolVersion = base.protocolVersion || HEARING_PROTOCOL_VERSION;
  base.phase = base.phase || "intro";
  base.status = base.status || "not_started";
  base.channelCheckIndex = clampInteger(base.channelCheckIndex, 0, HEARING_SIDES.length - 1);
  base.practiceIndex = clampInteger(base.practiceIndex, 0, HEARING_PRACTICE_STEPS.length - 1);
  base.trials = createHearingTrials();
  base.trialIndex = clampInteger(base.trialIndex, 0, base.trials.length - 1);
  base.levelIndex = clampInteger(base.levelIndex, 0, HEARING_LEVELS_DB_HL.length - 1);
  base.currentTonePlayed = Boolean(base.currentTonePlayed);
  base.currentTonePlaying = Boolean(base.currentTonePlaying);
  base.environment = base.environment && typeof base.environment === "object"
    ? { status: "not_checked", relativeDb: null, checkedAt: null, ...base.environment }
    : { status: "not_checked", relativeDb: null, checkedAt: null };
  base.environmentChecks = Array.isArray(base.environmentChecks) ? base.environmentChecks : [];
  base.channelChecks = Array.isArray(base.channelChecks) ? base.channelChecks : [];
  base.practiceResponses = Array.isArray(base.practiceResponses) ? base.practiceResponses : [];
  base.responses = Array.isArray(base.responses) ? base.responses : [];
  base.thresholds = {
    right: base.thresholds?.right && typeof base.thresholds.right === "object" ? base.thresholds.right : {},
    left: base.thresholds?.left && typeof base.thresholds.left === "object" ? base.thresholds.left : {}
  };
  base.mocaAudioLevelDbHl = clampMocaAudioLevelDbHl(base.summary?.mocaAudioLevelDbHl ?? base.mocaAudioLevelDbHl);
  base.mocaAudioAdjustedAt = base.mocaAudioAdjustedAt || null;
  base.selfSelectedAudioLevelDbHl = clampSelfSelectedAudioLevelDbHl(base.summary?.selfSelectedAudioLevelDbHl ?? base.selfSelectedAudioLevelDbHl);
  base.selfSelectedAudioConfirmedAt = base.selfSelectedAudioConfirmedAt || null;
  return base;
}

function clampInteger(value, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clampMocaAudioLevelDbHl(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) return MOCA_AUDIO_DEFAULT_LEVEL_DB_HL;
  return Math.max(
    MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
    Math.min(MOCA_AUDIO_MAX_LEVEL_DB_HL, Math.round(level))
  );
}

function clampSelfSelectedAudioLevelDbHl(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) return MOCA_AUDIO_DEFAULT_LEVEL_DB_HL;
  const stepped = Math.round(level / SELF_SELECTED_AUDIO_STEP_DB_HL) * SELF_SELECTED_AUDIO_STEP_DB_HL;
  return Math.max(SELF_SELECTED_AUDIO_MIN_DB_HL, Math.min(SELF_SELECTED_AUDIO_MAX_DB_HL, stepped));
}

function normalizeTrailState(trail = {}) {
  const base = createTrailState(trail);
  const edges = Array.isArray(base.edges) && base.edges.length
    ? base.edges
    : trailEdgesFromSequence(base.sequence);
  const summary = summarizeTrailEdges(edges);
  return createTrailState({
    ...base,
    edges: summary.edges,
    sequence: summary.sequence,
    errors: summary.errors,
    correctStep: summary.correctStep,
    undoCount: Number(base.undoCount || 0)
  });
}

function trailEdgesFromSequence(sequence = []) {
  return sequence.slice(0, -1).map((from, index) => ({
    from,
    to: sequence[index + 1],
    at: new Date().toISOString()
  }));
}

function summarizeTrailEdges(edges = []) {
  const sequence = [];
  let errors = 0;
  const normalizedEdges = edges
    .filter((edge) => edge?.from && edge?.to && edge.from !== edge.to)
    .map((edge) => {
      if (!sequence.length) sequence.push(edge.from);
      else if (sequence[sequence.length - 1] !== edge.from) sequence.push(edge.from);
      sequence.push(edge.to);
      return { ...edge, correct: false };
    });
  const progressByEdge = trailProgressByEdge(normalizedEdges);
  normalizedEdges.forEach((edge, index) => {
    edge.correct = Boolean(progressByEdge[index]);
    if (!edge.correct) errors += 1;
  });
  const correctStep = Math.max(0, trailSubsequenceProgress(sequence) - 1);
  return { edges: normalizedEdges, sequence, errors, correctStep };
}

function trailProgressByEdge(edges = []) {
  let progress = 0;
  return edges.map((edge) => {
    const before = progress;
    progress = trailSubsequenceProgress([edge.from, edge.to], progress);
    return progress > before;
  });
}

function trailSubsequenceProgress(sequence = [], startIndex = 0) {
  let expectedIndex = Math.max(0, Math.min(TRAIL_EXPECTED.length, Number(startIndex) || 0));
  sequence.forEach((label) => {
    if (label === TRAIL_EXPECTED[expectedIndex]) expectedIndex += 1;
  });
  return expectedIndex;
}

function trailContainsExpectedSequence(sequence = state.trail.sequence || []) {
  return trailSubsequenceProgress(sequence) >= TRAIL_EXPECTED.length;
}

function rebuildTrailFromEdges() {
  state.trail = normalizeTrailState(state.trail);
}

function trailEdgesForDrawing() {
  return Array.isArray(state.trail.edges) && state.trail.edges.length
    ? state.trail.edges
    : trailEdgesFromSequence(state.trail.sequence || []);
}

function safeJson(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function migrateState() {
  state.participant = state.participant || {};
  if (!state.participant.name && state.participant.code) state.participant.name = state.participant.code;
  if (!state.participant.birthYear && state.participant.age) {
    const age = Number(state.participant.age);
    if (Number.isFinite(age) && age > 0) state.participant.birthYear = String(new Date().getFullYear() - age);
  }
  if (!state.participant.educationLevel && state.participant.educationYears) {
    const years = Number(state.participant.educationYears);
    if (Number.isFinite(years)) {
      if (years <= 6) state.participant.educationLevel = "小学";
      else if (years <= 9) state.participant.educationLevel = "初中";
      else if (years <= 12) state.participant.educationLevel = "高中";
      else if (years <= 15) state.participant.educationLevel = "大专";
      else state.participant.educationLevel = "本科及以上";
    }
  }
  delete state.participant.code;
  delete state.participant.age;
  delete state.participant.educationYears;
  delete state.participant.expectedPlace;
  delete state.participant.expectedCity;
  state.hearingScreening = normalizeHearingScreening(state.hearingScreening);
  if (state.view === "volume") {
    state.view = "hearing";
    state.hearingScreening.selfSelectedAudioConfirmedAt = state.hearingScreening.selfSelectedAudioConfirmedAt || new Date().toISOString();
  }
  state.responses = state.responses || {};
  state.drawings = state.drawings || {};
  state.taskRuntime = normalizeTaskRuntime(state.taskRuntime);
  state.trail = normalizeTrailState(state.trail);
  state.playedInstructionKeys = state.playedInstructionKeys || {};
  state.completedInstructionKeys = state.completedInstructionKeys || { ...state.playedInstructionKeys };
  state.acknowledgedInstructionKeys = state.acknowledgedInstructionKeys || {};
  state.permissions = state.permissions || { microphone: "unknown", location: "unknown" };
  state.voiceProfile = VOICE_PROFILES[state.voiceProfile] ? state.voiceProfile : "cartoon";
  state.setupAttempted = Boolean(state.setupAttempted);
  state.setupVoiceRecording = Boolean(state.setupVoiceRecording);
  state.setupVoiceTranscribing = Boolean(state.setupVoiceTranscribing);
  state.resumeAfterMemory2Index = Number.isInteger(state.resumeAfterMemory2Index) ? state.resumeAfterMemory2Index : null;
}

function saveDraft() {
  try {
    localStorage.setItem("moca-game-draft", JSON.stringify(state));
  } catch {
    try {
      localStorage.setItem("moca-game-draft", JSON.stringify(compactStateForDraft(state)));
    } catch {
      // Mobile browsers can have very small localStorage quotas; the live test state remains in memory.
    }
  }
}

function compactStateForDraft(value) {
  const copy = JSON.parse(JSON.stringify(value || {}));
  Object.values(copy.responses || {}).forEach((response) => {
    if (response?.answer?.audioRecordings) delete response.answer.audioRecordings;
  });
  return copy;
}

function resetState() {
  stopTimers();
  stopAudioPlayback();
  stopHearingTone();
  stopSetupVoiceCapture({ releaseMic: true });
  stopVoiceInput({ releaseMic: true, shouldRender: false });
  pendingAiScoreTaskIds = new Set();
  if (backgroundSessionSaveTimer) window.clearTimeout(backgroundSessionSaveTimer);
  backgroundSessionSaveTimer = null;
  localStorage.removeItem("moca-game-draft");
  state = createInitialState();
  drawingUndoStacks = {};
  menuOpen = false;
  cognitionMenuOpen = false;
  protectedViewsUnlocked = false;
  adminPasswordDialog = null;
  manualTranscriptComposing = false;
  resetSetupPromptPlayback();
  fluencyAutoAdvanceInProgress = false;
  hearingIntroPromptStartedAt = 0;
  playState = "开始";
  voiceState = "待说";
  speechTranscribing = false;
}

function isParticipantComplete() {
  return ["name", "birthYear", "sex", "educationLevel"].every((key) => String(state.participant[key] || "").trim());
}

function html(strings, ...values) {
  return strings.map((part, index) => `${part}${values[index] ?? ""}`).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getResponse(taskId) {
  if (!state.responses[taskId]) {
    const task = tasks.find((entry) => entry.id === taskId);
    state.responses[taskId] = {
      taskId,
      startedAt: null,
      endedAt: null,
      durationMs: 0,
      score: 0,
      maxScore: task ? task.maxScore : 0,
      answer: {},
      behavior: {}
    };
  }
  return state.responses[taskId];
}

function createTaskRuntime() {
  const memoryCandidates = shuffle(MEMORY_WORD_BANK).slice(0, MEMORY_CANDIDATE_COUNT);
  const memoryTargets = shuffle(memoryCandidates).slice(0, MEMORY_TARGET_COUNT);
  const memoryRecallCandidates = shuffledRecallWords(memoryCandidates);
  const digitForward = randomBankItem(DIGIT_FORWARD_BANK);
  const digitBackward = randomBankItem(DIGIT_BACKWARD_BANK);
  return {
    memoryCandidateWords: memoryCandidates,
    memoryRecallCandidateWords: memoryRecallCandidates,
    memoryTargetWords: memoryTargets,
    digitForwardBankId: digitForward.id,
    digitForwardStimulus: digitForward.stimulus,
    digitForwardAnswer: digitForward.answer,
    digitBackwardBankId: digitBackward.id,
    digitBackwardStimulus: digitBackward.stimulus,
    digitBackwardAnswer: digitBackward.answer,
    serialSubtractionNumber: SERIAL_SUBTRACTION_NUMBER
  };
}

function normalizeTaskRuntime(runtime = {}) {
  const base = runtime && typeof runtime === "object" ? { ...runtime } : {};
  const candidates = Array.isArray(base.memoryCandidateWords)
    ? base.memoryCandidateWords.filter((word) => MEMORY_WORD_BANK.includes(word))
    : [];
  const targets = Array.isArray(base.memoryTargetWords)
    ? base.memoryTargetWords.filter((word) => candidates.includes(word))
    : [];
  if (candidates.length !== MEMORY_CANDIDATE_COUNT || targets.length !== MEMORY_TARGET_COUNT) {
    const fresh = createTaskRuntime();
    base.memoryCandidateWords = fresh.memoryCandidateWords;
    base.memoryRecallCandidateWords = fresh.memoryRecallCandidateWords;
    base.memoryTargetWords = fresh.memoryTargetWords;
  }
  const recallCandidates = Array.isArray(base.memoryRecallCandidateWords)
    ? base.memoryRecallCandidateWords.filter((word) => base.memoryCandidateWords.includes(word))
    : [];
  if (recallCandidates.length !== MEMORY_CANDIDATE_COUNT) {
    base.memoryRecallCandidateWords = shuffledRecallWords(base.memoryCandidateWords);
  }
  const forward = DIGIT_FORWARD_BANK.find((entry) => entry.id === base.digitForwardBankId)
    || DIGIT_FORWARD_BANK.find((entry) => entry.stimulus === base.digitForwardStimulus)
    || randomBankItem(DIGIT_FORWARD_BANK);
  base.digitForwardBankId = forward.id;
  base.digitForwardStimulus = forward.stimulus;
  base.digitForwardAnswer = forward.answer;

  const backward = DIGIT_BACKWARD_BANK.find((entry) => entry.id === base.digitBackwardBankId)
    || DIGIT_BACKWARD_BANK.find((entry) => entry.stimulus === base.digitBackwardStimulus)
    || randomBankItem(DIGIT_BACKWARD_BANK);
  base.digitBackwardBankId = backward.id;
  base.digitBackwardStimulus = backward.stimulus;
  base.digitBackwardAnswer = backward.answer;

  base.serialSubtractionNumber = SERIAL_SUBTRACTION_NUMBER;
  return base;
}

function ensureTaskRuntime() {
  state.taskRuntime = normalizeTaskRuntime(state.taskRuntime);
  return state.taskRuntime;
}

function randomBankItem(bank) {
  return bank[Math.floor(Math.random() * bank.length)];
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffledRecallWords(words) {
  const shuffled = shuffle(words);
  if (shuffled.length > 1 && shuffled.every((word, index) => word === words[index])) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

function memoryCandidateWords(taskId = "") {
  const runtime = ensureTaskRuntime();
  return taskId === "memory2" ? runtime.memoryRecallCandidateWords : runtime.memoryCandidateWords;
}

function memoryTargetWords() {
  return ensureTaskRuntime().memoryTargetWords;
}

function memoryWordAudioKey(word) {
  const index = MEMORY_WORD_BANK.indexOf(word);
  return index >= 0 ? `word:memory:${String(index + 1).padStart(2, "0")}` : "";
}

function activeDigitItem(task) {
  const runtime = ensureTaskRuntime();
  if (task.id === "digitForward") {
    return {
      bankId: runtime.digitForwardBankId,
      stimulus: runtime.digitForwardStimulus,
      answer: runtime.digitForwardAnswer,
      audioKey: `stimulus:digitForward:bank:${runtime.digitForwardBankId}`
    };
  }
  return {
    bankId: runtime.digitBackwardBankId,
    stimulus: runtime.digitBackwardStimulus,
    answer: runtime.digitBackwardAnswer,
    audioKey: `stimulus:digitBackward:bank:${runtime.digitBackwardBankId}`
  };
}

function serialSubtractionNumber() {
  ensureTaskRuntime();
  return SERIAL_SUBTRACTION_NUMBER;
}

function beginTask(taskId) {
  const response = getResponse(taskId);
  if (!response.startedAt) {
    response.startedAt = new Date().toISOString();
    response.startedTick = Date.now();
  }
}

function finishTask(taskId) {
  const response = getResponse(taskId);
  if (!response.startedAt) beginTask(taskId);
  response.endedAt = new Date().toISOString();
  const previous = response.durationMs || 0;
  const current = response.startedTick ? Date.now() - response.startedTick : 0;
  response.durationMs = Math.max(previous, current);
  response.submitted = true;
  delete response.startedTick;
}

function render() {
  saveDraft();
  stopTrailGuide();
  stopDrawingIdleTimers();
  activeCanvas = null;
  activeCanvasTaskId = null;
  if (state.view === "setup") {
    root.innerHTML = renderSetup();
    queueVisibleSpeechAudioPreload();
    return;
  }
  if (state.view === "volume") {
    root.innerHTML = renderVolumeSetup();
    queueVisibleSpeechAudioPreload();
    return;
  }

  ensureRenderableTask();
  const current = tasks[state.activeTaskIndex] || tasks[0];
  root.innerHTML = renderShell(current);
  if (state.view === "test") {
    setupCurrentTask(current);
    scheduleTaskInstruction(current);
  }
  queueVisibleSpeechAudioPreload();
  focusAdminPasswordInput();
}

function renderSetup() {
  return html`
    <div class="setup-screen">
      <section class="setup-panel">
        <div class="setup-left">
          <div class="brand-row setup-title-row">
            <div>
              <h1>脑力闯关</h1>
            </div>
          </div>
          <div class="setup-grid">
            ${inputField("participant.name", "姓名", state.participant.name, "", "text", isSetupFieldInvalid("name"), "participant-name-field")}
            ${birthDateField(state.participant.birthYear, isSetupFieldInvalid("birthYear"))}
            ${segmentedField("sex", "性别", state.participant.sex, ["男", "女"], isSetupFieldInvalid("sex"), "sex-field")}
            ${segmentedField("educationLevel", "教育水平", state.participant.educationLevel, educationLevels.filter(Boolean), isSetupFieldInvalid("educationLevel"), "education-field")}
          </div>
          <button class="primary setup-start-button pulse" data-action="startSession">
            <span>开始游戏</span>
          </button>
        </div>
      </section>
    </div>
  `;
}

function renderVolumeSetup() {
  const screening = normalizeHearingScreening(state.hearingScreening);
  const level = clampSelfSelectedAudioLevelDbHl(screening.selfSelectedAudioLevelDbHl);
  return html`
    <div class="volume-setup-screen">
      <section class="volume-setup-panel">
        <div class="volume-setup-copy">
          <span>音量选择</span>
          <h2>请调到您觉得清楚、舒服的音量</h2>
        </div>
        <div class="volume-slider-card">
          <strong class="volume-level-value" data-volume-value>${formatAudioLevel(level)}</strong>
          <input
            class="volume-slider"
            data-audio-volume
            type="range"
            min="${SELF_SELECTED_AUDIO_MIN_DB_HL}"
            max="${SELF_SELECTED_AUDIO_MAX_DB_HL}"
            step="${SELF_SELECTED_AUDIO_STEP_DB_HL}"
            value="${level}"
            aria-label="选择说明音量"
          />
          <div class="volume-slider-scale">
            <span>轻一点</span>
            <span>响一点</span>
          </div>
          <div class="volume-setup-actions">
            <button class="primary big-button pulse" data-action="continueToHearing">选好了</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function isSetupFieldInvalid(key) {
  return state.setupAttempted && !String(state.participant[key] || "").trim();
}

function birthDateField(value, invalid = false) {
  const parts = birthDateParts(value);
  const years = birthYearOptions();
  const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  const days = Array.from({ length: daysInMonth(Number(parts.year), Number(parts.month)) }, (_, index) => String(index + 1).padStart(2, "0"));
  return html`
    <div class="field birth-date-field ${invalid ? "invalid" : ""}">
      <span>出生日期</span>
      <div class="birth-date-selects">
        <label class="birth-date-unit-field birth-date-year-field">
          <select data-birth-part="year" aria-label="出生年份">
            ${years.map((year) => `<option value="${year}" ${year === parts.year ? "selected" : ""}>${year}</option>`).join("")}
          </select>
          <span>年</span>
        </label>
        <label class="birth-date-unit-field">
          <select data-birth-part="month" aria-label="出生月份">
            ${months.map((month) => `<option value="${month}" ${month === parts.month ? "selected" : ""}>${Number(month)}</option>`).join("")}
          </select>
          <span>月</span>
        </label>
        <label class="birth-date-unit-field">
          <select data-birth-part="day" aria-label="出生日期">
            ${days.map((day) => `<option value="${day}" ${day === parts.day ? "selected" : ""}>${Number(day)}</option>`).join("")}
          </select>
          <span>日</span>
        </label>
      </div>
    </div>
  `;
}

function birthDateParts(value) {
  const match = String(value || "").match(/^(\d{4})(?:\D+(\d{1,2}))?(?:\D+(\d{1,2}))?/);
  const year = match?.[1] || "1966";
  const month = String(Math.min(12, Math.max(1, Number(match?.[2] || 1)))).padStart(2, "0");
  const maxDay = daysInMonth(Number(year), Number(month));
  const day = String(Math.min(maxDay, Math.max(1, Number(match?.[3] || 1)))).padStart(2, "0");
  return { year, month, day };
}

function birthYearOptions() {
  const current = new Date().getFullYear();
  const start = Math.max(1900, current - 130);
  return Array.from({ length: current - start + 1 }, (_, index) => String(current - index));
}

function daysInMonth(year, month) {
  const safeYear = Number.isFinite(year) && year >= 1900 ? year : 1966;
  const safeMonth = Number.isFinite(month) && month >= 1 && month <= 12 ? month : 1;
  return new Date(safeYear, safeMonth, 0).getDate();
}

function updateBirthDatePart(part, value) {
  const parts = birthDateParts(state.participant.birthYear);
  parts[part] = part === "year" ? String(value || "1966") : String(value || "1").padStart(2, "0");
  const maxDay = daysInMonth(Number(parts.year), Number(parts.month));
  parts.day = String(Math.min(maxDay, Math.max(1, Number(parts.day || 1)))).padStart(2, "0");
  state.participant.birthYear = `${parts.year}-${parts.month}-${parts.day}`;
}

async function toggleSetupVoiceRegistration() {
  if (state.setupVoiceTranscribing) return;
  if (state.setupVoiceRecording) {
    const recorder = setupVoiceRecorder;
    setupVoiceRecorder = null;
    state.setupVoiceRecording = false;
    state.setupVoiceTranscribing = true;
    cleanupSetupVoiceRecorder(recorder);
    releaseMicStream();
    render();

    const blob = wavBlobFromFloat32Chunks(recorder?.chunks || [], recorder?.sampleRate || 16000);
    let text = "";
    try {
      const result = await requestAsrJson({ id: "setup" }, "registration", blob);
      text = toSimplifiedChinese(String(result?.text || result?.transcription || "").trim());
    } catch (error) {
      console.error("Setup voice ASR failed", error);
    }

    if (text) {
      parseRegistrationVoiceText(text);
      state.setupAttempted = false;
    } else {
      window.alert("没有识别到有效信息，请再试一次，或手动填写。");
    }
    state.setupVoiceTranscribing = false;
    saveDraft();
    render();
    return;
  }

  try {
    const stream = await getReusableMicStream();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass?.prototype?.createScriptProcessor) throw new Error("当前浏览器不支持录音");
    const context = new AudioContextClass();
    await context.resume?.().catch(() => {});
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(4096, 1, 1);
    const chunks = [];
    processor.onaudioprocess = (event) => {
      chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      event.outputBuffer.getChannelData(0).fill(0);
    };
    source.connect(processor);
    processor.connect(context.destination);
    setupVoiceRecorder = { chunks, context, processor, sampleRate: context.sampleRate, source };
    state.setupVoiceRecording = true;
    playSfx("recordStart");
    render();
  } catch (error) {
    console.error("Setup voice recording failed", error);
    state.permissions.microphone = "denied";
    window.alert("无法启动麦克风，请允许浏览器麦克风权限后重试。");
    saveDraft();
    render();
  }
}

function cleanupSetupVoiceRecorder(recorder = setupVoiceRecorder) {
  if (!recorder) return;
  recorder.processor.onaudioprocess = null;
  try {
    recorder.processor.disconnect();
  } catch {}
  try {
    recorder.source.disconnect();
  } catch {}
  recorder.context.close?.().catch(() => {});
}

function stopSetupVoiceCapture({ releaseMic = false } = {}) {
  cleanupSetupVoiceRecorder();
  setupVoiceRecorder = null;
  state.setupVoiceRecording = false;
  state.setupVoiceTranscribing = false;
  if (releaseMic) releaseMicStream();
}

function parseRegistrationVoiceText(text) {
  const normalized = String(text || "").replace(/\s+/g, "");
  const nameMatch = normalized.match(/(?:我叫|我是|姓名是|姓名叫|名字是|名字叫|名字叫作)([\u4e00-\u9fa5]{2,5})/);
  if (nameMatch) {
    state.participant.name = nameMatch[1].replace(/(今年|性别|出生|学历|文化|的|啊|呢|吧|啦).*$/, "");
  } else if (!state.participant.name && normalized.length <= 8) {
    state.participant.name = normalized;
  }

  const dateMatch = normalized.match(/(\d{4})年(?:(\d{1,2})月)?(?:(\d{1,2})[日号])?/);
  if (dateMatch) {
    const [, year, month = "1", day = "1"] = dateMatch;
    state.participant.birthYear = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  if (normalized.includes("男")) state.participant.sex = "男";
  else if (normalized.includes("女")) state.participant.sex = "女";

  const eduMap = {
    小学: "小学",
    初中: "初中",
    中专: "中专",
    高中: "高中",
    大专: "大专",
    专科: "大专",
    本科: "本科及以上",
    大学: "本科及以上",
    研究生: "本科及以上",
    硕士: "本科及以上",
    博士: "本科及以上"
  };
  Object.entries(eduMap).some(([keyword, value]) => {
    if (!normalized.includes(keyword)) return false;
    state.participant.educationLevel = value;
    return true;
  });
}

function inputField(path, label, value, placeholder, type = "text", invalid = false, className = "") {
  return html`
    <label class="field ${className} ${invalid ? "invalid" : ""}">
      <span>${label}</span>
      <input data-bind="${path}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function selectField(path, label, value, options, invalid = false) {
  return html`
    <label class="field ${invalid ? "invalid" : ""}">
      <span>${label}</span>
      <select data-bind="${path}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${option || "请选择"}</option>`).join("")}
      </select>
    </label>
  `;
}

function segmentedField(key, label, value, options, invalid = false, className = "") {
  const extraClass = options.length > 2 ? "edu-segment-options" : "";
  return html`
    <div class="field segmented-field ${className} ${invalid ? "invalid" : ""}">
      <span>${label}</span>
      <div class="segmented-options ${extraClass}">
        ${options.map((option) => `<button type="button" class="segment-option ${value === option ? "picked" : ""}" data-action="chooseParticipant" data-key="${key}" data-value="${escapeHtml(option)}"${speechAttrs(option, setupAudioKeyForText(option))}>${escapeHtml(option)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderShell(current) {
  const totals = computeTotals();
  const hearingView = state.view === "hearing";
  const progress = headerProgressState();
  const drawerAvatar = participantAvatarSrc();
  return html`
    <div class="app-shell">
      <aside class="hidden-drawer ${menuOpen ? "open" : ""}">
        <button class="drawer-mask" data-action="closeMenu" aria-label="关闭菜单"></button>
        <div class="drawer-panel">
          <div class="drawer-brand">
            <img class="drawer-logo" src="${drawerAvatar}" alt="" />
            <div>
              <strong>脑力闯关</strong>
              <span>${escapeHtml(state.participant.name || "未填写姓名")}</span>
            </div>
          </div>
          <button class="drawer-hearing-link ${hearingView ? "active" : ""}" data-action="navView" data-view="hearing">听力测试</button>
          <button class="drawer-section-toggle ${cognitionMenuOpen ? "open" : ""}" data-action="toggleCognitionMenu" aria-expanded="${cognitionMenuOpen ? "true" : "false"}">
            <span>认知测试</span>
            <em>${state.view === "test" ? `${state.activeTaskIndex + 1}/${tasks.length}` : `${totals.totalScore}/30`}</em>
          </button>
          <nav class="drawer-task-list ${cognitionMenuOpen ? "open" : ""}">
            ${tasks.map((task, index) => renderTaskNav(task, index)).join("")}
          </nav>
          <button class="drawer-item" data-action="navView" data-view="results">本次结果</button>
          <button class="drawer-item" data-action="navView" data-view="design">评分标准</button>
          <button class="drawer-item" data-action="navView" data-view="admin">后台</button>
          <div class="drawer-spacer"></div>
          <button class="drawer-item" data-action="goHome">退出</button>
        </div>
      </aside>
      <main class="page-shell">
        <header class="page-header">
          <button class="icon-button" data-action="openMenu" aria-label="打开菜单">≡</button>
          <div class="header-title">
            <h2>${state.view === "test" ? escapeHtml(current.title) : viewTitle()}</h2>
            ${state.view === "test" ? `<p class="header-prompt">${escapeHtml(current.prompt)}</p>` : ""}
          </div>
          <div class="header-progress">
            <span>${escapeHtml(progress.label)}</span>
            <div class="progress-track"><span style="width:${progress.width}%"></span></div>
          </div>
        </header>
        ${renderMainView(current)}
      </main>
      ${renderAdminPasswordDialog()}
    </div>
  `;
}

function headerProgressState() {
  if (state.view === "hearing") {
    const progress = hearingQuestionProgress(state.hearingScreening);
    return {
      label: `听力 ${progress.current}/${progress.total}`,
      width: hearingProgressPercent()
    };
  }
  if (state.view === "test") {
    const current = Math.min(tasks.length, state.activeTaskIndex + 1);
    return {
      label: `认知 ${current}/${tasks.length}`,
      width: (current / tasks.length) * 100
    };
  }
  if (state.view === "results") return { label: "完成", width: 100 };
  return { label: "", width: 0 };
}

function participantAvatarSrc() {
  return state.participant?.sex === "男" ? GRANDPA_AVATAR_SRC : GRANDMA_AVATAR_SRC;
}

function renderTaskNav(task, index) {
  const done = state.responses[task.id]?.submitted;
  const active = state.view === "test" && state.activeTaskIndex === index;
  return html`
    <button class="drawer-task ${active ? "active" : ""} ${done ? "done" : ""}" data-action="selectTask" data-index="${index}">
      <span>${index + 1}</span>
      <strong>${escapeHtml(task.title)}</strong>
    </button>
  `;
}

function viewTitle() {
  if (state.view === "hearing") return "听力测试";
  if (state.view === "results") return "闯关成功";
  if (state.view === "admin") return "后台";
  if (state.view === "design") return "评分标准";
  return "当前任务";
}

function isProtectedView(view) {
  return view === "admin" || view === "design";
}

function ensureProtectedViewAccess() {
  if (protectedViewsUnlocked) return true;
  const password = window.prompt("请输入管理员密码");
  if (password === ADMIN_PASSWORD) {
    protectedViewsUnlocked = true;
    return true;
  }
  if (password !== null) window.alert("密码错误");
  return false;
}

function renderAdminPasswordDialog() {
  if (!adminPasswordDialog) return "";
  return html`
    <div class="admin-password-dialog" role="dialog" aria-modal="true" aria-label="管理员密码">
      <button class="admin-password-backdrop" data-action="closeAdminPasswordDialog" aria-label="关闭密码弹窗"></button>
      <section class="admin-password-panel">
        <h3>请输入管理员密码</h3>
        <input class="admin-password-input" data-admin-password type="password" inputmode="numeric" autocomplete="off" value="${escapeHtml(adminPasswordDialog.value || "")}" autofocus />
        ${adminPasswordDialog.error ? `<p>${escapeHtml(adminPasswordDialog.error)}</p>` : ""}
        <div class="admin-password-actions">
          <button class="secondary" data-action="closeAdminPasswordDialog">取消</button>
          <button class="primary" data-action="submitAdminPasswordDialog">确定</button>
        </div>
      </section>
    </div>
  `;
}

function renderMainView(current) {
  if (state.view === "hearing") return renderHearingCalibration();
  if (state.view === "results") return renderResults();
  if (state.view === "admin") return renderAdmin();
  if (state.view === "design") return renderDesign();
  return renderTask(current);
}

function hearingHeaderPrompt() {
  const screening = state.hearingScreening || createHearingScreeningState();
  if (screening.phase === "summary") return "完成后进入正式测试";
  if (screening.phase === "practice" || screening.phase === "test") return "播放后选择";
  return "请戴上耳机，保持安静";
}

function hearingProgressPercent() {
  const screening = state.hearingScreening || createHearingScreeningState();
  if (screening.phase === "summary") return 100;
  if (screening.phase === "intro") return 8;
  if (screening.phase === "channel") return 16 + (screening.channelCheckIndex / HEARING_SIDES.length) * 14;
  if (screening.phase === "practice") return 30 + (screening.practiceIndex / HEARING_PRACTICE_STEPS.length) * 16;
  if (screening.phase === "test") {
    const trialCount = createHearingTrials().length;
    return 46 + (screening.trialIndex / Math.max(1, trialCount)) * 48;
  }
  return 8;
}

function hearingQuestionProgress(screening = state.hearingScreening) {
  const normalized = normalizeHearingScreening(screening);
  const total = HEARING_SIDES.length + HEARING_PRACTICE_STEPS.length + normalized.trials.length;
  const completed = Math.min(HEARING_SIDES.length, normalized.channelChecks.length)
    + Math.min(HEARING_PRACTICE_STEPS.length, normalized.practiceResponses.length)
    + hearingCompletedTrialCount(normalized);
  if (normalized.phase === "intro") return { current: 0, total };
  if (normalized.phase === "summary") return { current: total, total };
  return { current: Math.min(total, completed + 1), total };
}

function renderHearingCalibration() {
  state.hearingScreening = normalizeHearingScreening(state.hearingScreening);
  const screening = state.hearingScreening;
  return html`
    <section class="single-page hearing-page">
      ${screening.phase === "intro" ? renderHearingIntro(screening) : ""}
      ${screening.phase === "channel" ? renderHearingChannelCheck(screening) : ""}
      ${screening.phase === "practice" ? renderHearingPractice(screening) : ""}
      ${screening.phase === "test" ? renderHearingTest(screening) : ""}
      ${screening.phase === "summary" ? renderHearingSummary(screening) : ""}
    </section>
  `;
}

function renderHearingIntro(screening) {
  const checked = screening.environment.status !== "not_checked" && screening.environment.status !== "checking";
  const canStart = screening.environment.status === "quiet" || screening.environment.status === "unavailable";
  const checkLabel = screening.environment.status === "checking"
    ? "检测中..."
    : checked ? "重新检测" : "环境检测";
  const checkClass = checked ? "secondary hearing-check-button hearing-recheck-button" : "primary big-button hearing-check-button";
  return html`
    <div class="hearing-card hearing-intro-card">
      <div class="hearing-intro-layout">
        <div class="hearing-hero-icon"><span class="headphone-icon"></span></div>
        <div class="hearing-intro-main">
          <div class="hearing-copy">
            <h3><span>请戴上耳机</span><span>保持安静</span></h3>
          </div>
          <div class="hearing-check-row">
            <button class="${checkClass}" data-action="checkHearingEnvironment" ${screening.environment.status === "checking" ? "disabled" : ""}>
              ${checkLabel}
            </button>
            ${screening.environment.status === "not_checked" ? "" : `
              <span class="hearing-env-status ${screening.environment.status}">
                ${hearingEnvironmentText(screening.environment)}
              </span>
            `}
          </div>
          ${canStart ? `<div class="hearing-actions">
            <button class="primary big-button hearing-start-button pulse" data-action="startHearingCalibration">开始</button>
          </div>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderHearingChannelCheck(screening) {
  const side = HEARING_SIDES[screening.channelCheckIndex] || HEARING_SIDES[0];
  return html`
    <div class="hearing-card hearing-step-card hearing-channel-card">
      <div class="hearing-stage-label">声道检查</div>
      <p class="hearing-instruction">声音应来自${escapeHtml(side.label)}</p>
      <div class="hearing-focus-row">
        ${renderHearingEarTarget(side)}
        ${renderHearingPlayButton({ ear: side.key, frequencyHz: 1000, levelDbHl: 55, context: "channel" }, screening)}
      </div>
      <div class="hearing-response-slot ${screening.currentTonePlayed ? "ready" : ""}">
        <div class="hearing-response-grid">
          <button class="option" data-action="confirmHearingChannel" data-value="correct" ${screening.currentTonePlayed ? "" : "disabled"}>是</button>
          <button class="option" data-action="confirmHearingChannel" data-value="wrong" ${screening.currentTonePlayed ? "" : "disabled"}>不是</button>
        </div>
      </div>
      ${renderHearingMessageSlot(screening.message, "task-warning")}
    </div>
  `;
}

function renderHearingPractice(screening) {
  const step = HEARING_PRACTICE_STEPS[screening.practiceIndex] || HEARING_PRACTICE_STEPS[0];
  const side = hearingSide(step.ear);
  return html`
    <div class="hearing-card hearing-step-card hearing-practice-card">
      <div class="hearing-stage-label">练习 ${screening.practiceIndex + 1}/${HEARING_PRACTICE_STEPS.length}</div>
      <div class="hearing-focus-row">
        ${renderHearingEarTarget(side)}
        ${renderHearingPlayButton({ ...step, context: "practice" }, screening)}
      </div>
      <div class="hearing-response-slot ${screening.currentTonePlayed ? "ready" : ""}">
        ${renderHearingResponseButtons("answerHearingPractice", screening)}
      </div>
      ${renderHearingMessageSlot(screening.message, "task-warning")}
    </div>
  `;
}

function renderHearingTest(screening) {
  const trial = screening.trials[screening.trialIndex] || screening.trials[0];
  const side = hearingSide(trial.ear);
  const levelDbHl = HEARING_LEVELS_DB_HL[screening.levelIndex] || HEARING_LEVELS_DB_HL[0];
  const completed = hearingCompletedTrialCount(screening);
  return html`
    <div class="hearing-card hearing-step-card hearing-test-card">
      <div class="hearing-stage-label">测试 ${Math.min(completed + 1, screening.trials.length)}/${screening.trials.length}</div>
      <div class="hearing-meter-row">
        ${renderHearingEarTarget(side, { compact: true })}
        <div class="hearing-stimulus-panel">
          <span>频率</span>
          <strong>${formatFrequency(trial.frequencyHz)}</strong>
        </div>
        <div class="hearing-stimulus-panel">
          <span>声强</span>
          <strong>${levelDbHl} dB HL</strong>
        </div>
      </div>
      ${renderHearingPlayButton({ ear: trial.ear, frequencyHz: trial.frequencyHz, levelDbHl, context: "test" }, screening)}
      <div class="hearing-response-slot ${screening.currentTonePlayed ? "ready" : ""}">
        ${renderHearingResponseButtons("answerHearingTrial", screening)}
      </div>
      ${renderHearingMessageSlot(screening.message, screening.message.includes("再大") ? "task-ok" : "task-warning")}
    </div>
  `;
}

function renderHearingMessageSlot(message, className = "task-warning") {
  return `<p class="hearing-message-slot ${className} ${message ? "visible" : ""}">${message ? escapeHtml(message) : "&nbsp;"}</p>`;
}

function renderHearingResponseButtons(action, screening) {
  return html`
    <div class="hearing-response-grid">
      <button class="option hearing-heard" data-action="${action}" data-heard="true" ${screening.currentTonePlayed ? "" : "disabled"}>听到了</button>
      <button class="option hearing-missed" data-action="${action}" data-heard="false" ${screening.currentTonePlayed ? "" : "disabled"}>没听到</button>
    </div>
  `;
}

function renderHearingPlayButton(stimulus, screening) {
  const busy = Boolean(screening.currentTonePlaying);
  const played = Boolean(screening.currentTonePlayed);
  const label = busy ? "请听" : played ? "已播放" : "播放";
  return html`
    <button class="primary circle-button sound-button hearing-play-button ${busy || played ? "" : "pulse"}" data-action="playHearingTone" data-ear="${stimulus.ear}" data-frequency="${stimulus.frequencyHz}" data-level="${stimulus.levelDbHl}" data-context="${stimulus.context}" ${busy || played ? "disabled" : ""}>
      ${label}
    </button>
  `;
}

function renderHearingSummary(screening) {
  const summary = screening.summary || summarizeHearingScreening(screening);
  const ears = summary.ears || {};
  const audioLevel = summary.mocaAudioLevelDbHl ?? screening.mocaAudioLevelDbHl ?? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL;
  const selectedAudioLevel = summary.selfSelectedAudioLevelDbHl ?? screening.selfSelectedAudioLevelDbHl ?? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL;
  return html`
    <div class="hearing-card hearing-summary-card">
      <div class="hearing-complete-animation" aria-hidden="true">
        <span class="hearing-complete-ring"></span>
        <span class="hearing-complete-check">✓</span>
      </div>
      <p class="hearing-summary-note">听力测试已完成，请继续认知测试</p>
      <div class="hearing-summary-grid">
        ${HEARING_SIDES.map((side) => `
          <div class="hearing-summary-item">
            <span>${escapeHtml(side.label)}平均</span>
            <strong>${formatThreshold(ears[side.key]?.pta4)}</strong>
          </div>
        `).join("")}
        <div class="hearing-summary-item">
          <span>自选音量</span>
          <strong>${formatAudioLevel(selectedAudioLevel)}</strong>
        </div>
        <div class="hearing-summary-item">
          <span>认知测试音量</span>
          <strong>${formatAudioLevel(audioLevel)}</strong>
        </div>
      </div>
      <div class="hearing-summary-actions">
        <button class="primary big-button hearing-continue-button pulse" data-action="enterCognitionTest">继续</button>
      </div>
      <button class="hearing-retest-link" data-action="restartHearingCalibration">重测</button>
    </div>
  `;
}

function hearingEnvironmentText(environment = {}) {
  if (environment.status === "checking") return "正在听环境声";
  if (environment.status === "quiet") return "环境较安静";
  if (environment.status === "noisy") return "环境偏吵";
  if (environment.status === "unavailable") return "无法检测";
  return "";
}

function hearingSide(key) {
  return HEARING_SIDES.find((side) => side.key === key) || HEARING_SIDES[0];
}

function formatEarLabel(key) {
  if (key === "right" || key === "left") return hearingSide(key).label;
  return "";
}

function renderHearingEarTarget(side, { compact = false } = {}) {
  return html`
    <div class="hearing-ear-target ${side.key} ${compact ? "compact" : ""}" aria-label="${escapeHtml(side.label)}">
      <svg class="ear-illustration" viewBox="0 0 180 180" aria-hidden="true" focusable="false">
        <path class="sound-wave wave-1" d="M123 64 C139 78 139 102 123 116"></path>
        <path class="sound-wave wave-2" d="M136 48 C163 70 163 110 136 132"></path>
        <path class="ear-fill" d="M76 28 C50 28 32 51 32 83 C32 121 57 148 80 148 C96 148 101 135 98 121 C96 109 104 101 113 91 C128 74 118 28 76 28Z"></path>
        <path class="ear-line" d="M76 28 C50 28 32 51 32 83 C32 121 57 148 80 148 C96 148 101 135 98 121 C96 109 104 101 113 91 C128 74 118 28 76 28Z"></path>
        <path class="ear-inner" d="M77 58 C91 62 96 79 87 91 C80 101 66 102 65 118"></path>
        <path class="ear-inner" d="M64 79 C70 72 82 73 85 84"></path>
      </svg>
      <strong>${escapeHtml(side.label)}</strong>
    </div>
  `;
}

function formatFrequency(frequencyHz) {
  return frequencyHz >= 1000 ? `${frequencyHz / 1000} kHz` : `${frequencyHz} Hz`;
}

function formatThreshold(value) {
  if (!Number.isFinite(Number(value))) return "-";
  const rounded = Math.round(Number(value));
  const minimumLevel = HEARING_LEVELS_DB_HL[0];
  if (rounded <= minimumLevel) return `≤${minimumLevel} dB HL`;
  return `${rounded} dB HL`;
}

function formatAudioLevel(value) {
  if (!Number.isFinite(Number(value))) return "-";
  return `${Math.round(Number(value))} dB HL`;
}

function hearingCompletedTrialCount(screening) {
  const responses = Array.isArray(screening.responses) ? screening.responses : [];
  const keys = new Set(responses.filter((entry) => entry.finalForFrequency).map((entry) => `${entry.ear}:${entry.frequencyHz}`));
  return keys.size;
}

function hearingEventId(prefix, index) {
  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

function hearingToneTiming(screening) {
  const startedMs = Number(screening.lastToneStartedAt || 0);
  const endedMs = Number(screening.lastToneEndedAt || 0);
  return {
    toneStartedAt: startedMs ? new Date(startedMs).toISOString() : null,
    toneEndedAt: endedMs ? new Date(endedMs).toISOString() : null,
    toneDurationMs: startedMs && endedMs ? Math.max(0, endedMs - startedMs) : null
  };
}

function hearingAttemptIndex(responses, trial) {
  return responses.filter((entry) => entry.ear === trial.ear && Number(entry.frequencyHz) === Number(trial.frequencyHz)).length + 1;
}

function summarizeHearingResponses(screening = state.hearingScreening) {
  const normalized = normalizeHearingScreening(screening);
  const practice = normalized.practiceResponses.filter((entry) => typeof entry.heard === "boolean");
  const test = normalized.responses.filter((entry) => typeof entry.heard === "boolean");
  const all = [...practice, ...test];
  return {
    total: all.length,
    heard: all.filter((entry) => entry.heard).length,
    missed: all.filter((entry) => !entry.heard).length,
    practiceTotal: practice.length,
    testTotal: test.length,
    testFinalFrequencies: normalized.responses.filter((entry) => entry.finalForFrequency).length
  };
}

function hearingEventsForExport(screening = state.hearingScreening) {
  const normalized = normalizeHearingScreening(screening);
  const events = [];
  const pushEvent = (event) => {
    events.push({
      sequence: events.length + 1,
      ...event
    });
  };

  normalized.environmentChecks.forEach((entry, index) => {
    pushEvent({
      id: entry.id || hearingEventId("hearing-env", index),
      eventType: "environment_check",
      phase: "intro",
      environmentStatus: entry.status || "",
      relativeDb: entry.relativeDb ?? entry.averageRelativeDb ?? null,
      quietThresholdRelativeDb: entry.quietThresholdRelativeDb ?? HEARING_ENVIRONMENT_QUIET_RELATIVE_DB,
      checkedAt: entry.checkedAt || entry.endedAt || entry.startedAt || null,
      unit: "relative dBFS",
      ...entry
    });
  });

  normalized.channelChecks.forEach((entry, index) => {
    pushEvent({
      id: entry.id || hearingEventId("hearing-channel", index),
      eventType: "channel_check",
      phase: "channel",
      ear: entry.ear || entry.expectedEar || "",
      earLabel: entry.expectedLabel || formatEarLabel(entry.ear),
      frequencyHz: entry.frequencyHz ?? 1000,
      levelDbHl: entry.levelDbHl ?? 55,
      responseLabel: entry.response === "correct" ? "声道正确" : "声道不正确",
      eventAt: entry.at || entry.responseAt || null,
      ...entry
    });
  });

  normalized.practiceResponses.forEach((entry, index) => {
    pushEvent({
      id: entry.id || hearingEventId("hearing-practice", index),
      eventType: "practice_response",
      phase: "practice",
      ear: entry.ear || "",
      earLabel: entry.earLabel || formatEarLabel(entry.ear),
      frequencyHz: entry.frequencyHz ?? null,
      levelDbHl: entry.levelDbHl ?? null,
      heard: Boolean(entry.heard),
      responseLabel: entry.heard ? "听到了" : "没听到",
      eventAt: entry.at || entry.responseAt || null,
      ...entry
    });
  });

  normalized.responses.forEach((entry, index) => {
    pushEvent({
      id: entry.id || hearingEventId("hearing-test", index),
      eventType: "test_response",
      phase: "test",
      ear: entry.ear || "",
      earLabel: entry.earLabel || formatEarLabel(entry.ear),
      frequencyHz: entry.frequencyHz ?? null,
      levelDbHl: entry.levelDbHl ?? null,
      heard: Boolean(entry.heard),
      responseLabel: entry.heard ? "听到了" : "没听到",
      eventAt: entry.at || entry.responseAt || null,
      ...entry
    });
  });

  return events;
}

function summarizeHearingScreening(screening = state.hearingScreening) {
  const thresholds = screening.thresholds || { right: {}, left: {} };
  const responseCounts = summarizeHearingResponses(screening);
  const ears = Object.fromEntries(HEARING_SIDES.map((side) => {
    const primaryValues = HEARING_PRIMARY_FREQUENCIES
      .map((frequencyHz) => thresholdValueForSummary(thresholds[side.key]?.[frequencyHz]))
      .filter((value) => Number.isFinite(value));
    const pta4 = primaryValues.length === HEARING_PRIMARY_FREQUENCIES.length
      ? primaryValues.reduce((sum, value) => sum + value, 0) / primaryValues.length
      : null;
    return [side.key, {
      pta4,
      thresholds: thresholds[side.key] || {},
      pass: pta4 !== null ? pta4 <= HEARING_PASS_PTA_DB_HL : null
    }];
  }));
  const worseEar = ears.right.pta4 === null && ears.left.pta4 === null
    ? null
    : hearingWorseEarKey(ears.right.pta4, ears.left.pta4);
  const worsePta = [ears.right.pta4, ears.left.pta4]
    .filter((value) => Number.isFinite(Number(value)))
    .reduce((max, value) => Math.max(max, Number(value)), null);
  const mocaAudioBaselineDbHl = Number.isFinite(Number(worsePta)) ? Number(worsePta) : null;
  const mocaAudioLevelDbHl = mocaAudioBaselineDbHl === null
    ? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL
    : clampMocaAudioLevelDbHl(mocaAudioBaselineDbHl + MOCA_AUDIO_OFFSET_DB);
  const status = worsePta === null
    ? "incomplete"
    : worsePta > HEARING_PASS_PTA_DB_HL ? "refer" : "pass";
  return {
    protocolVersion: HEARING_PROTOCOL_VERSION,
    status,
    pass: status === "pass",
    criterion: `较差耳 500/1000/2000/4000 Hz 平均听阈 <= ${HEARING_PASS_PTA_DB_HL} dB HL`,
    primaryFrequenciesHz: [...HEARING_PRIMARY_FREQUENCIES],
    testFrequenciesHz: [...HEARING_TEST_FREQUENCIES],
    levelsDbHl: [...HEARING_LEVELS_DB_HL],
    ears,
    worseEar,
    worsePta4: worsePta,
    mocaAudioBaselineDbHl,
    mocaAudioOffsetDb: MOCA_AUDIO_OFFSET_DB,
    selfSelectedAudioLevelDbHl: clampSelfSelectedAudioLevelDbHl(screening.selfSelectedAudioLevelDbHl),
    hearingInstructionAudioLevelDbHl: clampSelfSelectedAudioLevelDbHl(screening.selfSelectedAudioLevelDbHl),
    mocaAudioLevelDbHl,
    cognitionTestAudioLevelDbHl: mocaAudioLevelDbHl,
    responseCounts,
    completedTrialCount: hearingCompletedTrialCount(screening),
    totalTrialCount: createHearingTrials().length
  };
}

function hearingWorseEarKey(rightPta, leftPta) {
  const rightValue = Number(rightPta);
  const leftValue = Number(leftPta);
  const hasRight = Number.isFinite(rightValue);
  const hasLeft = Number.isFinite(leftValue);
  if (hasRight && hasLeft) {
    if (rightValue === leftValue) return "equal";
    return rightValue > leftValue ? "right" : "left";
  }
  if (hasRight) return "right";
  if (hasLeft) return "left";
  return null;
}

function formatWorseEarLabel(key) {
  if (key === "equal") return "双耳相同";
  if (key === "right" || key === "left") return hearingSide(key).label;
  return "-";
}

function thresholdValueForSummary(entry) {
  if (entry && typeof entry === "object") {
    if (entry.noResponseAtMax) return HEARING_MAX_NO_RESPONSE_DB_HL;
    const value = Number(entry.thresholdDbHl);
    return Number.isFinite(value) ? value : null;
  }
  const value = Number(entry);
  return Number.isFinite(value) ? value : null;
}

function isTaskSubmitting(task = tasks[state.activeTaskIndex]) {
  return Boolean(task?.id && state.taskSubmitting?.taskId === task.id);
}

function taskSubmittingLabel(task) {
  if (state.taskSubmitting?.label) return state.taskSubmitting.label;
  return needsBlockingAiScore(task) ? "正在评分..." : "请稍等...";
}

function renderTask(task) {
  const step = getTaskStep(task);
  const waitAttr = speechTranscribing || isTaskSubmitting(task) ? "disabled" : "";
  return html`
    <section class="single-page task-page">
      <div class="task-workspace">${renderTaskWorkspace(task, step)}</div>
      ${renderTaskActions(task, step)}
      <button class="task-skip-link" data-action="skipTask" ${waitAttr}>跳过</button>
    </section>
  `;
}

function renderTaskGuide(task, step) {
  const ready = isInstructionComplete(task, step);
  const trailReady = task.type !== "trail" || isTrailGuidePracticeComplete();
  const canProceed = ready && trailReady;
  const playLabel = playState === "播放中..." ? "播放中..." : "再听一遍";
  return html`
    <section class="single-page task-guide-page">
      <div class="task-guide-card">
        <div class="task-guide-copy">
          <span>第 ${state.activeTaskIndex + 1} 题</span>
          <h2>${escapeHtml(task.title)}</h2>
          <p>${escapeHtml(taskGuideText(task, step))}</p>
        </div>
        ${task.type === "trail" ? renderTrailGuidePractice(ready) : ""}
        ${renderAudioWave()}
        <div class="task-guide-actions">
          <button class="secondary big-button" data-action="replayTaskGuide" ${ready ? "" : "disabled"}>${playLabel}</button>
          <button class="primary big-button ${canProceed ? "pulse" : ""}" data-action="acknowledgeTaskGuide" ${canProceed ? "" : "disabled"}>我明白了</button>
        </div>
      </div>
    </section>
  `;
}

function renderTrailGuidePractice(instructionReady) {
  const complete = isTrailGuidePracticeComplete();
  return html`
    <div class="trail-guide-practice ${complete ? "complete" : ""}">
      <p>请按手指方向连线</p>
      <div class="trail-guide-board ${instructionReady ? "" : "locked"}">
        <canvas id="trailGuideCanvas" class="trail-guide-canvas" aria-label="连线练习区域"></canvas>
      </div>
      <strong>${complete ? "练习完成" : instructionReady ? "请从 1 拖到甲，再拖到乙" : "请先听完说明"}</strong>
    </div>
  `;
}

function renderTaskActions(task, step) {
  const secondary = taskActionSecondaryButtons(task);
  const showConfirm = shouldShowConfirmButton(task);
  if (!secondary && !showConfirm) return `<div class="task-actions spacer"></div>`;
  const submitting = isTaskSubmitting(task);
  const response = getResponse(task.id);
  const readyToAnswer = isTaskReadyToAnswer(task, step);
  const answerReady = readyToAnswer && hasTaskAnswer(task, response, step);
  const confirmDisabled = speechTranscribing || submitting || !answerReady;
  const confirmClass = `confirm-button ${answerReady ? "answer-ready" : ""} ${shouldNudgeConfirm(task) ? "attention-nudge" : ""}`;
  return html`
    <div class="task-actions">
      <div class="task-actions-left">${secondary || ""}</div>
      ${showConfirm ? `<button class="${confirmClass}" data-action="nextTask" ${confirmDisabled ? "disabled" : ""}>${submitting ? taskSubmittingLabel(task) : confirmLabel(task, step)}</button>` : ""}
      <div class="task-actions-right"></div>
    </div>
  `;
}

function refreshTaskActionButtons() {
  if (state.view !== "test") return;
  const task = tasks[state.activeTaskIndex];
  if (!task) return;
  const step = getTaskStep(task);
  const button = document.querySelector(".confirm-button");
  if (!button) return;
  const submitting = isTaskSubmitting(task);
  const answerReady = isTaskReadyToAnswer(task, step) && hasTaskAnswer(task, getResponse(task.id), step);
  button.disabled = speechTranscribing || submitting || !answerReady;
  button.classList.toggle("answer-ready", answerReady);
}

function taskActionSecondaryButtons(task) {
  const disabled = isTaskSubmitting(task) ? "disabled" : "";
  if (task.type === "trail") return `
    <button class="utility-button" data-action="undoTrail" ${disabled}>↩ 撤销一步</button>
  `;
  if (task.type === "drawing") return `
    <button class="utility-button" data-action="undoDrawing" ${disabled}>↩ 撤销一步</button>
  `;
  if (task.type === "choice" && getResponse(task.id).answer.audioReady) return `<button class="utility-button" data-action="backspaceDigit" ${disabled}>删除</button>`;
  if (task.type === "serial7") return `<button class="utility-button" data-action="backspaceSerial" ${disabled}>删除</button>`;
  if (task.type === "orientation") {
    const prompt = orientationPrompts[getTaskStep(task)];
    if (prompt?.key === "year") return `<button class="utility-button" data-action="backspaceOrientation" data-field="year" ${disabled}>删除</button>`;
    if (prompt?.key === "date") {
      const field = getResponse("orientation").answer.orientationDateActiveField || "month";
      return `<button class="utility-button" data-action="backspaceOrientation" data-field="${field}" ${disabled}>删除</button>`;
    }
  }
  if (task.type === "memory" && task.trial === 1 && getResponse(task.id).answer.audioReady) return `<button class="utility-button replay-button" data-action="playCurrentAudio" ${disabled}>再听一遍</button>`;
  return "";
}

function shouldShowConfirmButton(task) {
  if (task.type === "vigilance") return false;
  return true;
}

function shouldNudgeConfirm(task) {
  return task?.type === "drawing" && Boolean(getResponse(task.id).behavior.confirmNudge);
}

function isTaskReadyToAnswer(task, step = getTaskStep(task)) {
  if (task?.type === "drawing" && ["cube", "clock"].includes(task.id)) return true;
  if (task?.type === "naming") return true;
  return isInstructionComplete(task, step);
}

function hasTaskAnswer(task, response = getResponse(task.id), step = getTaskStep(task)) {
  if (!task) return false;
  if (task.type === "trail") return true;
  if (task.type === "drawing") {
    if (task.id === "cube" || task.id === "clock") return true;
    return Boolean(response.drawingImage || state.drawings[task.id] || Number(response.behavior.strokes || 0));
  }
  if (task.type === "naming") {
    const item = task.items[step];
    return Boolean(item && String(response.answer[item.key] || "").trim());
  }
  if (task.type === "memory") {
    const selected = response.answer.selectedWords || [];
    if (task.trial === 1) return Boolean(response.answer.audioReady);
    return selected.length > 0;
  }
  if (task.type === "choice") {
    const sequence = response.answer.sequence || [];
    return sequence.length >= activeDigitItem(task).answer.length;
  }
  if (task.type === "serial7") {
    const values = response.answer.values || [];
    return String(values[step] || "").trim().length > 0;
  }
  if (task.type === "sentence") return sentenceStepHasSpeechAttempt(task, step);
  if (task.type === "fluency") return Boolean(response.answer.completedAt);
  if (task.type === "abstractionChoice") {
    const item = task.items[step];
    return Boolean(item && String(response.answer[item.key] || "").trim());
  }
  if (task.type === "orientation") return hasOrientationAnswer(response, step);
  return false;
}

function hasOrientationAnswer(response, step) {
  const prompt = orientationPrompts[step];
  if (!prompt) return false;
  if (prompt.key === "year") return String(response.answer.year || "").trim().length >= 4;
  if (prompt.key === "date") return Boolean(String(response.answer.month || "").trim() && String(response.answer.day || "").trim());
  return Boolean(String(response.answer[prompt.key] || response.answer.orientationChoices?.[prompt.key] || "").trim());
}

function getTaskStep(task) {
  const response = getResponse(task.id);
  return Math.min(Number(response.answer?.step || 0), getTaskStepCount(task) - 1);
}

function getTaskStepCount(task) {
  if (task.type === "naming") return task.items.length;
  if (task.type === "serial7") return 5;
  if (task.type === "sentence") return task.sentences.length;
  if (task.type === "abstractionChoice") return task.items.length;
  if (task.type === "orientation") return orientationPrompts.length;
  return 1;
}

function confirmLabel(task, step) {
  if (step < getTaskStepCount(task) - 1) return "答完了，下一题";
  return nextTaskIndexAfterSubmitPreview(task) < 0 ? "答完了，查看结果" : "答完了，下一题";
}

function nextTaskIndexAfterSubmitPreview(task) {
  if (!task) return -1;
  if (task.id !== "memory2" && !isMemory2Submitted() && isMemory2Ready()) return taskIndex("memory2");
  if (task.id === "memory2") {
    const resumeIndex = state.resumeAfterMemory2Index;
    if (Number.isInteger(resumeIndex) && resumeIndex >= 0 && resumeIndex < tasks.length) return resumeIndex;
    if (allNonMemory2TasksSubmittedAfterSubmit(task.id)) return -1;
  }
  const nextIndex = nextSequentialIndexAfterSubmitPreview(state.activeTaskIndex, task.id);
  if (nextIndex >= 0) return nextIndex;
  if (shouldRunMemory2AtEndAfterSubmit(task.id)) return taskIndex("memory2");
  return -1;
}

function nextSequentialIndexAfterSubmitPreview(fromIndex, currentTaskId) {
  for (let index = fromIndex + 1; index < tasks.length; index += 1) {
    if (tasks[index].id === "memory2" && !isMemory2AvailableAfterSubmit(currentTaskId)) continue;
    return index;
  }
  return -1;
}

function isMemory2AvailableAfterSubmit(currentTaskId) {
  return isMemory2Submitted() || isMemory2Ready() || allNonMemory2TasksSubmittedAfterSubmit(currentTaskId);
}

function shouldRunMemory2AtEndAfterSubmit(currentTaskId) {
  return Boolean(state.memoryWaitStartedAt) && !isMemory2Submitted() && allNonMemory2TasksSubmittedAfterSubmit(currentTaskId);
}

function allNonMemory2TasksSubmittedAfterSubmit(currentTaskId) {
  return tasks.every((entry) => (
    entry.id === "memory2" || entry.id === currentTaskId || Boolean(state.responses[entry.id]?.submitted)
  ));
}

function renderTaskWorkspace(task, step) {
  if (task.type === "trail") return renderTrailTask();
  if (task.type === "drawing") return renderDrawingTask(task);
  if (task.type === "naming") return renderNamingTask(task, step);
  if (task.type === "memory") return renderMemoryTask(task);
  if (task.type === "choice") return renderChoiceTask(task);
  if (task.type === "vigilance") return renderVigilanceTask();
  if (task.type === "serial7") return renderSerial7Task(step);
  if (task.type === "sentence") return renderSentenceTask(task, step);
  if (task.type === "fluency") return renderFluencyTask();
  if (task.type === "abstractionChoice") return renderAbstractionTask(task, step);
  if (task.type === "orientation") return renderOrientationTask(step);
  return "";
}

function renderTrailTask() {
  const locked = isTaskReadyToAnswer(tasks[state.activeTaskIndex]) ? "" : "locked";
  return html`
    <div class="trail-page">
      <canvas id="taskCanvas" class="task-canvas ${locked}" aria-label="交替连线画图区域"></canvas>
      ${renderTrailCompletionPrompt()}
    </div>
  `;
}

function renderDrawingTask(task) {
  const hasReference = task.drawingKind === "cube" || task.drawingKind === "clock";
  const locked = isTaskReadyToAnswer(task) ? "" : "locked";
  return html`
    <div class="drawing-page ${task.drawingKind === "clock" ? "clock-page" : ""} ${task.drawingKind === "cube" ? "cube-page" : ""}">
      ${task.drawingKind === "cube" ? `
        <div class="reference-panel">
          <div class="reference-label">参照图</div>
          ${cubeReferenceSvg()}
        </div>
      ` : ""}
      ${task.drawingKind === "clock" ? `
        <div class="reference-panel clock-reference-panel">
          <div class="reference-label">目标时刻</div>
          <div class="clock-time-reference">
            <strong>11:10</strong>
          </div>
        </div>
      ` : ""}
      ${hasReference ? `<div class="cube-arrow-hint">→</div>` : ""}
      <div class="canvas-wrap">
        <div class="canvas-surface">
          <canvas id="taskCanvas" class="task-canvas ${task.drawingKind === "cube" ? "cube-canvas" : ""} ${locked}" aria-label="${escapeHtml(task.title)}画图区域"></canvas>
        </div>
      </div>
    </div>
  `;
}

function renderTrailCompletionPrompt() {
  const response = getResponse("trail");
  if (!response.behavior.trailCompletionPromptVisible) return "";
  return html`
    <div class="trail-completion-modal" role="dialog" aria-modal="true" aria-label="连线完成确认">
      <div class="trail-completion-panel">
        <strong>所有圆圈都连完了</strong>
        <p>是否确定提交这一题？</p>
        <div class="trail-completion-actions">
          <button class="primary" data-action="confirmTrailCompletion">答完了，下一题</button>
          <button class="ghost" data-action="cancelTrailCompletion">取消</button>
        </div>
      </div>
    </div>
  `;
}

function renderNamingTask(task, step) {
  const response = getResponse(task.id);
  const item = task.items[step];
  const disabled = isTaskReadyToAnswer(task, step) ? "" : "disabled";
  return html`
    <div class="naming-page">
      <div class="animal-visual-panel">
        <div class="animal-emoji" role="img" aria-label="${escapeHtml(item.answer)}">${animalEmojis[item.key]}</div>
      </div>
      <div class="animal-side">
        <h4>这是什么动物？</h4>
        <div class="option-grid">
          ${item.options.map((option) => `<button class="option ${response.answer[item.key] === option ? "picked" : ""}" data-action="chooseNaming" data-value="${escapeHtml(option)}" ${disabled}${speechAttrs(option, audioKeyForText(option))}>${escapeHtml(option)}</button>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMemoryTask(task) {
  const response = getResponse(task.id);
  const selected = response.answer.selectedWords || [];
  const options = memoryCandidateWords(task.id);
  const ready = task.trial === 2 || Boolean(response.answer.audioReady);
  const inputDisabled = isTaskReadyToAnswer(task) ? "" : "disabled";
  return html`
    <div class="memory-page ${ready ? "ready" : ""}">
      ${ready ? "" : `<div class="memory-audio">
        ${renderAudioWave()}
        ${task.trial === 1 && !ready ? renderMemoryStartButton() : ""}
      </div>`}
      ${ready ? `
        <div class="memory-choice-panel">
          <strong>请点击刚刚听到的所有词语</strong>
          <span>${selected.length}/${MEMORY_TARGET_COUNT}</span>
        </div>
        <div class="option-grid memory-options">
          ${options.map((word) => `<button class="option ${selected.includes(word) ? "picked" : ""}" data-action="toggleMemoryWord" data-word="${escapeHtml(word)}" ${inputDisabled}${speechAttrs(word, memoryWordAudioKey(word))}>${escapeHtml(word)}</button>`).join("")}
        </div>
        ${response.behavior.selectionWarning ? `<p class="task-warning">${escapeHtml(response.behavior.selectionWarning)}</p>` : ""}
        ${response.behavior.memoryReviewPromptVisible ? renderMemoryReviewPrompt(response) : ""}
      ` : `<p class="memory-wait-copy">请先点击开始，听完 5 个词后再选择。</p>`}
    </div>
  `;
}

function renderMemoryReviewPrompt() {
  return html`
    <div class="memory-review-panel">
      <strong>要再听一遍吗？</strong>
      <p>这次选择和刚刚读到的词不完全一致。</p>
      <div class="memory-review-actions">
        <button class="secondary" data-action="reviewMemoryReplay">再听一遍</button>
        <button class="primary" data-action="confirmMemoryIncorrectSubmit">提交</button>
      </div>
    </div>
  `;
}

function renderMemoryStartButton() {
  const task = tasks[state.activeTaskIndex];
  if (!isTaskReadyToAnswer(task)) return `<button class="primary circle-button sound-button" disabled>请听说明</button>`;
  if (playState === "播放中...") {
    return `<button class="primary circle-button sound-button" disabled>请听题</button>`;
  }
  return `<button class="primary circle-button pulse sound-button" data-action="playCurrentAudio">开始</button>`;
}

function renderChoiceTask(task) {
  const response = getResponse(task.id);
  const sequence = response.answer.sequence || [];
  const ready = Boolean(response.answer.audioReady);
  const backward = task.id === "digitBackward";
  const answerLength = activeDigitItem(task).answer.length;
  const modeLabel = backward ? "倒序" : "顺序";
  const inputDisabled = isTaskReadyToAnswer(task) ? "" : "disabled";
  return html`
    <div class="digit-page ${ready ? "ready keypad-split-page" : ""}">
      ${ready ? `
        <div class="keypad-question-panel digit-question-panel">
          <strong class="digit-mode-label">${modeLabel}</strong>
          ${renderAnswerSquareRow(sequence, answerLength, "digit-answer digit-answer-squares")}
        </div>
        <div class="keypad-panel">
          <div class="keypad digit-keypad">
            ${renderKeypadDigits("appendDigit", inputDisabled)}
          </div>
        </div>
      ` : `
        ${backward ? `<p class="digit-example">例：听到 123，您就选择 321</p>` : ""}
        ${renderAudioWave()}
        ${renderMemoryStartButton()}
      `}
    </div>
  `;
}

function renderAnswerSquareRow(values, count, className = "") {
  const entries = Array.isArray(values) ? values : String(values || "").split("");
  return html`
    <div class="answer-square-row ${className}">
      ${Array.from({ length: count }, (_, index) => `<span class="answer-square ${entries[index] ? "" : "empty"}">${escapeHtml(entries[index] || " ")}</span>`).join("")}
    </div>
  `;
}

function renderVigilanceTask() {
  const response = getResponse("vigilance");
  const started = Boolean(response.answer.startedAt);
  const running = Boolean(response.answer.running);
  const tapCount = (response.answer.taps || []).length;
  const readyToAnswer = isTaskReadyToAnswer(tasks[state.activeTaskIndex]);
  return html`
    <div class="vigilance-page">
      <strong class="tap-instruction">听到 1 敲一下</strong>
      ${started ? renderAudioWave() : ""}
      ${!started ? `<button class="primary circle-button ${readyToAnswer ? "pulse" : ""}" data-action="playCurrentAudio" ${readyToAnswer ? "" : "disabled"}>${readyToAnswer ? "开始" : "请听说明"}</button>` : ""}
      ${started ? `<button class="tap-button ${running ? "pulse" : ""}" data-action="tapVigilance" ${running ? "" : "disabled"}>敲一下</button>` : ""}
      ${started ? `<span class="tap-count">已敲 ${tapCount} 下</span>` : ""}
    </div>
  `;
}

function renderSerial7Task(step) {
  const response = getResponse("serial7");
  const values = response.answer.values || ["", "", "", "", ""];
  const subtractBy = serialSubtractionNumber();
  const question = step === 0 ? `100减${subtractBy}等于多少？` : `再减${subtractBy}，等于多少？`;
  const inputDisabled = isTaskReadyToAnswer(tasks[state.activeTaskIndex], step) ? "" : "disabled";
  return html`
    <div class="serial-page keypad-split-page">
      <div class="keypad-question-panel">
        <div class="math-question">${question}</div>
        <div class="serial-display">${escapeHtml(values[step] || " ")}</div>
      </div>
      <div class="keypad-panel">
        <div class="keypad serial-keypad">
          ${renderKeypadDigits("inputSerialDigit", inputDisabled)}
        </div>
      </div>
    </div>
  `;
}

function renderSentenceTask(task, step) {
  const response = getResponse(task.id);
  const live = getLiveTranscript(task, response, step);
  const audioReady = sentenceStepAudioReady(response, step);
  const activeVoice = recognizing || recordingAudio || speechRecognitionWanted || speechRecognitionStartPending;
  const disabled = isTaskReadyToAnswer(task, step) && audioReady ? "" : "disabled";
  const control = sentenceControlButton(task, step, audioReady, activeVoice);
  return html`
    <div class="speech-page sentence-page">
      ${renderAudioWave()}
      <div class="speech-controls">${control}</div>
      ${live?.warningText ? `<p class="task-warning">${escapeHtml(live.warningText)}</p>` : ""}
      ${audioReady ? renderTranscriptEditor(live, "sentence", disabled) : `<p class="sentence-wait-copy">请先听题，听完后手动开始复述。</p>`}
    </div>
  `;
}

function sentenceControlButton(task, step, audioReady, activeVoice) {
  if (!audioReady) {
    if (playState === "播放中..." && speechPlaybackPurpose === "sentence") {
      return `<button class="primary circle-button sound-button" disabled>播放中...</button>`;
    }
    return `<button class="primary circle-button pulse sound-button" data-action="playCurrentAudio">听题</button>`;
  }
  if (speechTranscribing) return `<button class="secondary circle-button sound-button" disabled>请稍等</button>`;
  if (activeVoice) return `<button class="secondary circle-button sound-button" data-action="toggleVoiceInput">结束</button>`;
  const attempted = sentenceStepHasSpeechAttempt(task, step);
  return `<button class="primary circle-button pulse sound-button" data-action="toggleVoiceInput">${attempted ? "再说一次" : "开始复述"}</button>`;
}

function sentenceStepAudioReady(response, step) {
  return Boolean(response.answer.sentenceAudioReady?.[step]);
}

function renderFluencyTask() {
  const response = getResponse("fluency");
  const remaining = response.answer.remaining ?? 60;
  const running = Boolean(response.answer.running);
  const completed = Boolean(response.answer.completedAt);
  const waiting = speechTranscribing && tasks[state.activeTaskIndex]?.id === "fluency";
  const live = getLiveTranscript(tasks.find((task) => task.id === "fluency"), response, 0);
  const animals = fluencyAnimalNamesFromResponse(response, live);
  const readyToAnswer = isTaskReadyToAnswer(tasks[state.activeTaskIndex]);
  const statusText = fluencyUploadStatusText(response, waiting);
  return html`
    <div class="fluency-page">
      ${renderAudioWave()}
      ${completed ? "" : `<div class="speech-controls">
        <button class="timer-button ${running ? "running" : waiting || !readyToAnswer ? "" : "pulse"}" ${waiting || !readyToAnswer ? "disabled" : `data-action="${running ? "stopFluency" : "startFluency"}"`}>${waiting ? "请稍等" : readyToAnswer ? running ? "停止" : "开始" : "请听说明"}</button>
      </div>`}
      <strong class="fluency-count-status">${fluencyStatusText(response, animals)}</strong>
      ${statusText ? `<p class="fluency-upload-status">${escapeHtml(statusText)}</p>` : ""}
      <div class="animal-count-list">${renderAnimalCountChips(animals)}</div>
      ${completed ? renderTranscriptEditor(live, "fluency", waiting ? "disabled" : "") : ""}
      ${response.behavior.selectionWarning ? `<p class="task-warning">${escapeHtml(response.behavior.selectionWarning)}</p>` : ""}
    </div>
  `;
}

function fluencyStatusText(response, animals) {
  const countText = `已识别 ${animals.length} 个`;
  if (response.answer?.completedAt) return `${countText} · ${speechTranscribing ? "正在计数" : "正在进入下一题"}`;
  return response.answer?.running ? `剩余 ${response.answer.remaining ?? 60} 秒 · ${countText}` : countText;
}

function fluencyUploadStatusText(response, waiting = false) {
  const status = response.answer?.transcriptionStatus || "";
  if (waiting || status === "uploading") return response.answer?.transcriptionMessage || "正在上传录音并计数...";
  if (status === "error" || status === "empty") return response.answer?.transcriptionMessage || "计数未完成，可手动修改后继续";
  return "";
}

function renderAnimalCountChips(animals) {
  return animals.map((name) => `<span>${escapeHtml(name)}</span>`).join("");
}

function renderAbstractionTask(task, step) {
  const response = getResponse(task.id);
  const item = task.items[step];
  const value = response.answer[item.key] || "";
  const options = abstractionOptions(response, item);
  const disabled = isTaskReadyToAnswer(task, step) ? "" : "disabled";
  return html`
    <div class="abstraction-page abstraction-split-page">
      <div class="abstraction-visual-panel">
        <div class="word-pair">
          ${item.words.map((word, index) => `<div class="word-card"><span>${item.emojis[index]}</span><strong>${escapeHtml(word)}</strong></div>`).join("")}
        </div>
      </div>
      <div class="abstraction-choice-panel">
        <div class="option-grid abstraction-options">
          ${options.map((option) => `<button class="option ${value === option ? "picked" : ""} ${item.practice && option === item.answer ? "guided-option" : ""}" data-action="chooseAbstraction" data-key="${item.key}" data-value="${escapeHtml(option)}" ${disabled}${speechAttrs(option, audioKeyForText(option))}>${escapeHtml(option)}${item.practice && option === item.answer ? `<span class="hand-cue">👉</span>` : ""}</button>`).join("")}
        </div>
      </div>
      ${response.behavior.selectionWarning ? `<p class="task-warning">${escapeHtml(response.behavior.selectionWarning)}</p>` : ""}
    </div>
  `;
}

function renderOrientationTask(step) {
  const response = getResponse("orientation");
  const prompt = orientationPrompts[step];
  if (prompt.key === "year" || prompt.key === "date") return renderOrientationNumberTask(response, prompt);
  if (["weekday", "city", "place"].includes(prompt.key)) return renderOrientationChoiceTask(response, prompt);
  const options = orientationOptions(prompt);
  const picked = response.answer.orientationChoices?.[prompt.key] || "";
  const disabled = isTaskReadyToAnswer(tasks[state.activeTaskIndex], step) ? "" : "disabled";
  return html`
    <div class="orientation-page">
      <h4 class="orientation-question">${escapeHtml(prompt.label)}</h4>
      ${options.length ? `
        <div class="option-grid orientation-options">
          ${options.map((option) => `<button class="option ${picked === option.value ? "picked" : ""}" data-action="chooseOrientation" data-key="${prompt.key}" data-value="${escapeHtml(option.value)}" ${disabled}${speechAttrs(option.label, audioKeyForText(option.label))}>${escapeHtml(option.label)}</button>`).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderOrientationChoiceTask(response, prompt) {
  const options = orientationOptions(prompt);
  const picked = response.answer.orientationChoices?.[prompt.key] || response.answer[prompt.key] || "";
  const weekday = prompt.key === "weekday";
  const answerText = weekday ? weekdayShortLabel(picked) : picked;
  const optionClass = weekday ? "orientation-weekday-options" : "orientation-text-options";
  const disabled = isTaskReadyToAnswer(tasks[state.activeTaskIndex]) ? "" : "disabled";
  return html`
    <div class="orientation-page orientation-choice-page orientation-${prompt.key}-page">
      <div class="orientation-choice-question-panel">
        <h4 class="orientation-question">${escapeHtml(prompt.label)}</h4>
        ${weekday ? `
          <div class="weekday-answer-line">
            <span>星期</span>
            <span class="answer-square orientation-answer-square ${answerText ? "" : "empty"}">${escapeHtml(answerText || " ")}</span>
          </div>
        ` : `
          <div class="orientation-answer-box ${answerText ? "" : "empty"}">${escapeHtml(answerText || " ")}</div>
        `}
      </div>
      <div class="orientation-choice-option-panel">
        <div class="option-grid orientation-options ${optionClass}">
          ${options.map((option) => {
            const label = weekday ? weekdayShortLabel(option.label) : option.label;
            return `<button class="option ${picked === option.value ? "picked" : ""}" data-action="chooseOrientation" data-key="${prompt.key}" data-value="${escapeHtml(option.value)}" ${disabled}${speechAttrs(option.label, audioKeyForText(option.label))}>${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function weekdayShortLabel(value) {
  return String(value || "").replace(/^星期/, "");
}

function renderOrientationNumberTask(response, prompt) {
  const disabled = isTaskReadyToAnswer(tasks[state.activeTaskIndex]) ? "" : "disabled";
  if (prompt.key === "year") {
    const value = response.answer.year || "";
    return html`
      <div class="orientation-page orientation-number-page keypad-split-page">
        <div class="keypad-question-panel">
          <h4 class="orientation-question">${escapeHtml(prompt.label)}</h4>
          ${renderYearDigitBoxes(value)}
        </div>
        <div class="keypad-panel">
          <div class="keypad orientation-keypad">
            ${renderOrientationKeypad("year", disabled)}
          </div>
        </div>
      </div>
    `;
  }
  const activeField = response.answer.orientationDateActiveField || "month";
  return html`
    <div class="orientation-page orientation-number-page keypad-split-page">
      <div class="keypad-question-panel">
        <h4 class="orientation-question">${escapeHtml(prompt.label)}</h4>
        <div class="date-input-pair date-input-with-units">
          <button class="date-input-box ${activeField === "month" ? "active" : ""}" data-action="setOrientationDateField" data-field="month" ${disabled}>
            <strong>${escapeHtml(response.answer.month || " ")}</strong>
          </button>
          <span class="date-unit">月</span>
          <button class="date-input-box ${activeField === "day" ? "active" : ""}" data-action="setOrientationDateField" data-field="day" ${disabled}>
            <strong>${escapeHtml(response.answer.day || " ")}</strong>
          </button>
          <span class="date-unit">号</span>
        </div>
      </div>
      <div class="keypad-panel">
        <div class="keypad orientation-keypad">
          ${renderOrientationKeypad(activeField, disabled)}
        </div>
      </div>
    </div>
  `;
}

function renderYearDigitBoxes(value) {
  const digits = String(value || "").slice(0, 4).split("");
  const activeIndex = digits.length < 4 ? digits.length : -1;
  return html`
    <div class="year-digit-row" aria-label="年份输入">
      ${Array.from({ length: 4 }, (_, index) => `
        <span class="year-digit-box ${index === activeIndex ? "active" : ""}">${escapeHtml(digits[index] || " ")}</span>
      `).join("")}
    </div>
  `;
}

function renderSpeechCard(live) {
  const current = tasks[state.activeTaskIndex];
  const disabled = isTaskReadyToAnswer(current, getTaskStep(current)) ? "" : "disabled";
  return html`
    <div class="speech-page">
      ${renderAudioWave()}
      ${renderAudioButton("playCurrentAudio")}
      ${live?.warningText ? `<p class="task-warning">${escapeHtml(live.warningText)}</p>` : ""}
      ${renderTranscriptEditor(live, "sentence", disabled)}
    </div>
  `;
}

function renderSpeechControls(transcript) {
  const value = transcript === "等待语音识别..." ? "" : transcript;
  return html`
    ${renderAudioWave()}
    ${renderAudioButton("playCurrentAudio")}
    <textarea class="transcript-input" data-voice-manual placeholder="语音识别结果会显示在这里，也可以手动修改。">${escapeHtml(value)}</textarea>
  `;
}

function getLiveTranscript(task, response, step = 0) {
  if (task?.type === "sentence") {
    return {
      finalText: cleanAsrTranscript(response.answer.transcript?.[step] || ""),
      interimText: cleanAsrTranscript(response.answer.interimTranscript?.[step] || ""),
      warningText: response.behavior.speechWarning?.[step] || ""
    };
  }
  if (task?.type === "fluency") {
    return {
      finalText: cleanAsrTranscript(response.answer.rawTranscript || ""),
      interimText: cleanAsrTranscript(response.answer.interimTranscript || "")
    };
  }
  return { finalText: "", interimText: "" };
}

function renderLiveTranscriptBox(live, placeholder) {
  const finalText = live?.finalText || "";
  const interimText = live?.interimText || "";
  const empty = !finalText && !interimText;
  return html`
    <div class="live-transcript-box ${empty ? "empty-live" : ""}" aria-live="polite">
      ${finalText ? `<span class="live-transcript-final">${escapeHtml(finalText)}</span>` : ""}
      ${interimText ? `<span class="live-transcript-interim">${escapeHtml(interimText)}</span>` : ""}
      ${empty ? `<span class="live-transcript-placeholder">${escapeHtml(placeholder)}</span>` : ""}
    </div>
  `;
}

function renderTranscriptEditor(live, kind, disabled = "") {
  const value = joinTranscriptText(live?.finalText, live?.interimText);
  const attr = kind === "fluency" ? "data-fluency-manual" : "data-voice-manual";
  return `<textarea class="transcript-input" ${attr} ${disabled} placeholder="语音识别结果会显示在这里，也可以手动修改。">${escapeHtml(value)}</textarea>`;
}

function renderAudioWave() {
  const voiceInputActive = recognizing || recordingAudio || speechRecognitionWanted || speechRecognitionStartPending;
  const active = playState === "播放中..." || voiceInputActive || speechTranscribing;
  const label = speechTranscribing
    ? "请稍等"
    : playState === "播放中..."
      ? "播放中..."
      : voiceInputActive
        ? voiceState && voiceState !== "待说" ? voiceState : voicePromptText()
        : "";
  const showLabel = voiceInputActive && label && !speechTranscribing;
  return html`
    <div class="audio-wave-container">
      <div class="audio-wave ${active ? "active" : ""}" aria-label="${escapeHtml(label)}">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
    ${showLabel ? `<strong class="voice-status">${escapeHtml(label)}</strong>` : ""}
  `;
}

function renderAudioButton(action) {
  const current = tasks[state.activeTaskIndex];
  if (!isTaskReadyToAnswer(current, getTaskStep(current))) {
    return `<button class="primary circle-button sound-button" disabled>请听说明</button>`;
  }
  if (playState === "播放中..." && !(action === "playCurrentAudio" && current?.type === "sentence" && speechPlaybackPurpose === "instruction")) {
    return `<button class="primary circle-button sound-button" disabled>请听题</button>`;
  }
  if (speechTranscribing) return `<button class="secondary circle-button sound-button" disabled>请稍等</button>`;
  if (recognizing || recordingAudio || speechRecognitionWanted || speechRecognitionStartPending) return `<button class="secondary circle-button sound-button" data-action="toggleVoiceInput">停止</button>`;
  if (current?.type === "sentence" && sentenceStepSpeechWarning(current, getTaskStep(current))) {
    return `<button class="primary circle-button pulse sound-button" data-action="toggleVoiceInput">再说一次</button>`;
  }
  if (current?.type === "sentence" && sentenceStepHasSpeechAttempt(current, getTaskStep(current))) {
    return `<button class="primary circle-button sound-button" disabled>已播放</button>`;
  }
  return `<button class="primary circle-button pulse sound-button" data-action="${action}">开始</button>`;
}

function sentenceStepSpeechWarning(task, step) {
  return Boolean(getResponse(task.id).behavior?.speechWarning?.[step]);
}

function sentenceStepHasSpeechAttempt(task, step) {
  const response = getResponse(task.id);
  if (String(response.answer?.transcript?.[step] || "").trim()) return true;
  return (response.behavior?.speechRecognition || []).some((event) => (
    Number(event.step) === Number(step) && event.eventType === "cloudflare-asr-result" && String(event.text || "").trim()
  ));
}

function renderKeypadDigits(action, disabled = "") {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""]
    .map((digit) => digit
      ? `<button data-action="${action}" data-digit="${digit}" ${disabled}${speechAttrs(digit, `digit:${digit}`)}>${digit}</button>`
      : `<span class="keypad-spacer"></span>`)
    .join("");
}

function renderOrientationKeypad(field, disabled = "") {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""]
    .map((value) => {
      if (!value) return `<span class="keypad-spacer"></span>`;
      return `<button data-action="inputOrientationDigit" data-field="${field}" data-digit="${value}" ${disabled}${speechAttrs(value, `digit:${value}`)}>${value}</button>`;
    })
    .join("");
}

function speechAttrs(text, audioKey = "") {
  return ` data-speech="${escapeHtml(text)}"${audioKey ? ` data-audio-key="${escapeHtml(audioKey)}"` : ""}`;
}

function audioKeyForText(text) {
  return `text:${textKey(text)}`;
}

function setupAudioKeyForText(text) {
  return `setup:option:${textKey(text)}`;
}

function textKey(text) {
  let hash = 2166136261;
  Array.from(String(text || "")).forEach((char) => {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return (hash >>> 0).toString(36);
}

function renderResults() {
  const totals = computeTotals();
  const saving = state.sessionSaveStatus === "saving";
  const saved = state.sessionSaveStatus === "saved";
  const saveFailed = state.sessionSaveStatus === "error";
  return html`
    <section class="single-page results-page">
      <div class="result-hero celebrate final-celebration">
        ${renderConfetti()}
        <div class="result-fireworks" aria-hidden="true">
          <i></i><i></i><i></i>
        </div>
        <strong>${totals.totalScore}<em>/30</em></strong>
        <p>谢谢您的参与！</p>
      </div>
      <div class="control-row results-actions final-results-actions">
        <button class="secondary big-button" data-action="goHome" ${saved ? "" : "disabled"}>退出</button>
      </div>
      ${saving ? `<p class="save-status">正在自动保存...</p>` : ""}
      ${saved ? `<p class="save-status">数据已保存到后台${state.sessionSavedAt ? `：${escapeHtml(new Date(state.sessionSavedAt).toLocaleString())}` : ""}</p>` : ""}
      ${saveFailed ? `<p class="save-status error">自动保存失败，请进入后台重试。</p>` : ""}
    </section>
  `;
}

function renderConfetti() {
  return `<div class="confetti" aria-hidden="true">${Array.from({ length: 8 }, () => "<i></i>").join("")}</div>`;
}

function renderRadarChart(domainScores) {
  const domains = Object.entries(domainScores || {}).filter(([, value]) => value.max > 0);
  if (!domains.length) return "";
  const center = 130;
  const radius = 78;
  const labelRadius = 108;
  const axis = domains.map(([name], index) => radarPoint(index, domains.length, labelRadius, center));
  const valuePoints = domains.map(([, value], index) => {
    const ratio = value.max ? Math.max(0, Math.min(1, value.score / value.max)) : 0;
    return radarPoint(index, domains.length, radius * ratio, center);
  });
  const rings = [0.25, 0.5, 0.75, 1].map((ratio) => domains.map((entry, index) => radarPoint(index, domains.length, radius * ratio, center)));
  return html`
    <div class="radar-card">
      <div class="radar-pulse"></div>
      <svg class="radar-chart" viewBox="0 0 260 260" role="img" aria-label="各分项得分雷达图">
        ${rings.map((ring) => `<polygon class="radar-ring" points="${pointsAttr(ring)}" />`).join("")}
        ${axis.map((point) => `<line class="radar-axis" x1="${center}" y1="${center}" x2="${point.x}" y2="${point.y}" />`).join("")}
        <polygon class="radar-area" points="${pointsAttr(valuePoints)}" />
        ${valuePoints.map((point) => `<circle class="radar-dot" cx="${point.x}" cy="${point.y}" r="4" />`).join("")}
        ${domains.map(([name, value], index) => {
          const point = axis[index];
          return `<text class="radar-label" x="${point.x}" y="${point.y}" text-anchor="middle">${escapeHtml(shortDomainName(name))} ${value.score}/${value.max}</text>`;
        }).join("")}
      </svg>
    </div>
  `;
}

function radarPoint(index, total, radius, center) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  return {
    x: Number((center + Math.cos(angle) * radius).toFixed(1)),
    y: Number((center + Math.sin(angle) * radius).toFixed(1))
  };
}

function pointsAttr(points) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function shortDomainName(name) {
  return String(name || "").replace("视空间与执行功能", "视空间").replace("延迟回忆", "回忆").replace("语言", "语言").replace("注意", "注意");
}

function renderAdmin() {
  const selectedId = state.selectedSession?.id || "";
  return html`
    <section class="single-page admin-page">
      <div class="admin-toolbar">
        <button class="primary" data-action="loadSessions">刷新</button>
        <button class="secondary" data-action="saveSession">保存当前测评</button>
        <button class="secondary" data-action="exportCsv">导出 CSV</button>
      </div>
      <div class="admin-layout">
        <div class="admin-table">
          <div class="admin-head"><span>参加者</span><span>年龄</span><span>总分</span><span>原始分</span><span>教育加分</span><span>保存时间</span></div>
          ${(state.adminSessions || []).map((session) => `
            <button type="button" class="admin-row ${session.id === selectedId ? "active" : ""}" data-action="selectSavedSession" data-id="${escapeHtml(session.id)}">
              <span>${escapeHtml(session.participant?.name || session.id.slice(0, 8))}</span>
              <span>${formatParticipantAge(session.participant)}</span>
              <strong>${session.totalScore ?? "-"}/30</strong>
              <span>${session.rawScore ?? "-"}</span>
              <span>${session.educationBonus ?? 0}</span>
              <span>${formatSavedTime(session)}</span>
            </button>
          `).join("") || `<p class="empty">暂无保存记录</p>`}
        </div>
        ${state.selectedSession ? renderSessionDetail(state.selectedSession) : `
          <aside class="admin-detail empty-detail">
            <div class="detail-header">
              <span>测评详情</span>
              <strong>暂无记录</strong>
            </div>
            <p class="empty">保存或刷新后，可在这里查看每道题得分。</p>
          </aside>
        `}
      </div>
    </section>
  `;
}

function formatParticipantAge(participant = {}) {
  const recordedAge = Number(participant.age);
  if (Number.isFinite(recordedAge) && recordedAge >= 0 && recordedAge <= 130) return String(Math.round(recordedAge));
  const match = String(participant.birthYear || "").trim().match(/^(\d{4})(?:\D+(\d{1,2}))?(?:\D+(\d{1,2}))?/);
  if (!match) return "-";
  const birthYear = Number(match[1]);
  const birthMonth = match[2] ? Number(match[2]) : null;
  const birthDay = match[3] ? Number(match[3]) : null;
  const today = new Date();
  if (!Number.isFinite(birthYear) || birthYear < 1900 || birthYear > today.getFullYear()) return "-";
  let age = today.getFullYear() - birthYear;
  if (birthMonth !== null && birthDay !== null) {
    const birthdayPassed = today.getMonth() + 1 > birthMonth || (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);
    if (!birthdayPassed) age -= 1;
  }
  return age >= 0 && age <= 130 ? String(age) : "-";
}

function participantAgeAtTest(participant = {}) {
  const age = Number(formatParticipantAge(participant));
  return Number.isFinite(age) ? age : null;
}

function formatSavedTime(session) {
  const value = session.savedAt || session.finishedAt || session.startedAt;
  return value ? new Date(value).toLocaleString() : "-";
}

function renderSessionDetail(session) {
  const participant = session.participant || {};
  const itemResponses = Array.isArray(session.itemResponses) ? session.itemResponses : [];
  const hearing = session.hearingScreening || {};
  const hearingSummary = hearing.summary || null;
  const loading = state.selectedSessionLoading && state.selectedSession?.id === session.id && !itemResponses.length;
  return html`
    <aside class="admin-detail">
      <div class="detail-header">
        <span>测评详情</span>
        <strong>${escapeHtml(participant.name || session.id || "未命名")}</strong>
      </div>
      <div class="detail-summary">
        ${detailMetric("总分", `${session.totalScore ?? "-"}/30`)}
        ${detailMetric("原始分", session.rawScore ?? "-")}
        ${detailMetric("教育加分", session.educationBonus ?? "-")}
        ${detailMetric("题目数", itemResponses.length || session.itemCount || "-")}
        ${detailMetric("出生日期", participant.birthYear || "-")}
        ${detailMetric("年龄", formatParticipantAge(participant))}
        ${detailMetric("性别", participant.sex || participant.gender || "-")}
        ${detailMetric("教育水平", participant.educationLevel || "-")}
        ${detailMetric("听力初筛", formatHearingStatus(hearingSummary?.status || hearing.status))}
        ${detailMetric("右耳 4fPTA", formatThreshold(hearingSummary?.ears?.right?.pta4))}
        ${detailMetric("左耳 4fPTA", formatThreshold(hearingSummary?.ears?.left?.pta4))}
        ${detailMetric("自选音量", formatAudioLevel(hearingSummary?.selfSelectedAudioLevelDbHl ?? hearing.selfSelectedAudioLevelDbHl))}
        ${detailMetric("测试音量", formatAudioLevel(hearingSummary?.mocaAudioLevelDbHl ?? hearing.mocaAudioLevelDbHl))}
        ${detailMetric("保存时间", session.savedAt ? new Date(session.savedAt).toLocaleString() : "-")}
      </div>
      <div class="item-detail-list">
        ${loading
          ? `<p class="empty">正在加载题目明细...</p>`
          : itemResponses.map((item, index) => renderItemDetail(item, index)).join("") || `<p class="empty">这条记录没有题目明细</p>`}
      </div>
    </aside>
  `;
}

function detailMetric(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function formatHearingStatus(status) {
  if (status === "pass") return "通过";
  if (status === "refer") return "需复查";
  if (status === "skipped") return "已跳过";
  if (status === "incomplete") return "未完成";
  if (status === "completed") return "已完成";
  if (status === "in_progress") return "进行中";
  return "-";
}

function renderItemDetail(item, index) {
  const answerParts = readableItemAnswerParts(item);
  const visual = isVisualItem(item);
  return html`
    <article class="item-detail compact-item-detail">
      <div class="item-detail-row">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.title || item.taskId || "未命名题目")}</strong>
        <em>${escapeHtml(item.score ?? "-")}/${escapeHtml(item.maxScore ?? "-")}</em>
      </div>
      ${visual ? renderAdminDrawingPreview(item) : ""}
      <div class="item-answer-summary">
        <span>回答</span>
        <div class="answer-part-list">
          ${answerParts.map(renderAnswerPart).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderAnswerPart(part = {}) {
  const stateClass = part.correct === false ? "wrong-answer" : part.correct === true ? "correct-answer" : "";
  const standard = part.correct === false && part.standard ? `<small>标准：${escapeHtml(part.standard)}</small>` : "";
  return html`
    <div class="answer-part ${stateClass}">
      ${part.label ? `<span>${escapeHtml(part.label)}</span>` : ""}
      <strong>${escapeHtml(part.user || "未答")}</strong>
      ${standard}
    </div>
  `;
}

function isVisualItem(item = {}) {
  return ["trail", "cube", "clock"].includes(item.taskId);
}

function renderAdminDrawingPreview(item = {}) {
  if (!item.drawingImage || typeof item.drawingImage !== "string") {
    return `<div class="admin-drawing-preview empty-drawing-preview">未保存图案</div>`;
  }
  return html`
    <div class="admin-drawing-preview">
      <img src="${escapeHtml(item.drawingImage)}" alt="${escapeHtml(item.title || "作答图案")}" />
    </div>
  `;
}

function readableItemAnswerParts(item = {}) {
  const answer = item.answer || {};
  const savedParts = answer.answerSummary?.parts || item.correctness?.parts;
  if (Array.isArray(savedParts) && savedParts.length) return savedParts.map(normalizeAnswerPart);
  if (answer.skipped) return [{ label: "", user: "已跳过", standard: "", correct: false }];
  const task = tasks.find((entry) => entry.id === item.taskId);
  if (item.taskId === "trail") return visualAnswerParts(item, item.drawingImage ? "已完成连线" : "未记录连线");
  if (item.taskId === "cube" || item.taskId === "clock") return visualAnswerParts(item, item.drawingImage ? "已提交画图" : "未提交画图");
  if (task?.type === "naming") return task.items.map((entry) => ({
    label: entry.answer,
    user: answer[entry.key] || "未答",
    standard: entry.answer,
    correct: answer[entry.key] === entry.answer
  }));
  if (task?.type === "memory") {
    const selected = Array.isArray(answer.selectedWords) ? answer.selectedWords : [];
    return [{ label: "选择", user: selected.length ? selected.join("、") : "未选择", standard: "", correct: item.score >= item.maxScore }];
  }
  if (task?.type === "choice") {
    const sequence = Array.isArray(answer.sequence) ? answer.sequence : [];
    return [{ label: "顺序", user: sequence.length ? sequence.join(" ") : "未选择", standard: "", correct: item.score >= item.maxScore }];
  }
  if (task?.type === "vigilance") {
    const taps = Array.isArray(answer.taps) ? answer.taps.length : 0;
    return [{ label: "敲击", user: `${taps} 次`, standard: "听到 1 时敲击", correct: item.score >= item.maxScore }];
  }
  if (task?.type === "serial7") {
    const values = Array.isArray(answer.values) ? answer.values : [];
    return values.length ? values.map((value, index) => ({
      label: `第 ${index + 1} 步`,
      user: value || "未答",
      standard: "",
      correct: null
    })) : [{ label: "", user: "未答", standard: "", correct: false }];
  }
  if (task?.type === "sentence") return readableSentenceAnswer(task, answer);
  if (task?.type === "fluency") return readableFluencyAnswer(answer);
  if (task?.type === "abstractionChoice") return readableAbstractionAnswer(task, answer);
  if (task?.type === "orientation") return readableOrientationAnswer(answer);
  return readableGenericAnswer(answer);
}

function normalizeAnswerPart(part = {}) {
  return {
    label: String(part.label || ""),
    user: stringifyAnswerValue(part.user ?? part.userAnswer ?? ""),
    standard: stringifyAnswerValue(part.standard ?? part.standardAnswer ?? ""),
    correct: typeof part.correct === "boolean" ? part.correct : null
  };
}

function visualAnswerParts(item, user) {
  const parts = [{
    label: "图案",
    user,
    standard: item.taskId === "trail" ? TRAIL_EXPECTED.join("-") : drawingStandardText(item.taskId),
    correct: Number(item.score) >= Number(item.maxScore)
  }];
  const comment = item.ai?.comment || item.answer?.answerSummary?.scoreReason || "";
  if (comment) {
    parts.push({
      label: "评分说明",
      user: comment,
      standard: "",
      correct: Number(item.score) >= Number(item.maxScore)
    });
  }
  return parts;
}

function drawingStandardText(taskId) {
  if (taskId === "cube") return "可辨认三维结构、主要线条基本完整、无明显多余线、相对边大致平行且长度接近";
  if (taskId === "clock") return "圆/椭圆/近似圆表盘、1-12 基本写全且顺时针、必须有两根指针大致表示 11 点 10 分";
  return "";
}

function readableSentenceAnswer(task, answer) {
  const transcript = answer.transcript || {};
  return task.sentences.map((sentence, index) => ({
    label: `句子 ${index + 1}`,
    user: cleanAsrTranscript(transcript[index] || "") || "未答",
    standard: sentence,
    correct: sentenceMoCaNormalize(transcript[index]) === sentenceMoCaNormalize(sentence)
  }));
}

function readableFluencyAnswer(answer) {
  const animals = Array.isArray(answer.animals) && answer.animals.length
    ? answer.animals
    : extractAnimalNames(answer.rawTranscript || "");
  return [{
    label: "动物",
    user: animals.length ? `已识别 ${animals.length} 个：${animals.join("、")}` : "未识别到动物",
    standard: "至少 11 个动物",
    correct: animals.length >= 11
  }];
}

function readableAbstractionAnswer(task, answer) {
  return task.items
    .filter((entry) => !entry.practice)
    .map((entry) => {
      const standard = Array.isArray(entry.correctAnswers) ? entry.correctAnswers[0] : entry.answer;
      return {
        label: entry.words.join("和"),
        user: answer[entry.key] || "未答",
        standard,
        correct: answer[entry.key] === standard
      };
    });
}

function readableOrientationAnswer(answer) {
  return [
    { label: "年份", user: answer.year || "未答", standard: "", correct: null },
    { label: "月份", user: answer.month || "未答", standard: "", correct: null },
    { label: "日期", user: answer.day || "未答", standard: "", correct: null },
    { label: "星期", user: answer.weekday || "未答", standard: "", correct: null },
    { label: "城市", user: answer.city || "未答", standard: answer.expectedCity || "", correct: null },
    { label: "地点", user: answer.place || "未答", standard: answer.expectedPlace || "", correct: null }
  ];
}

function readableGenericAnswer(answer) {
  const hiddenKeys = new Set([
    "audioRecordings", "interimTranscript", "rawTranscript", "timerStartedAt",
    "running", "remaining", "audioReady", "wordsPlaybackStarted", "orientationDateActiveField"
  ]);
  const parts = Object.entries(answer || {})
    .filter(([key, value]) => !hiddenKeys.has(key) && value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => ({ label: key, user: stringifyAnswerValue(value), standard: "", correct: null }));
  return parts.length ? parts : [{ label: "", user: "未答", standard: "", correct: null }];
}

function stringifyAnswerValue(value) {
  if (Array.isArray(value)) return value.join("、");
  if (value && typeof value === "object") return Object.values(value).map(stringifyAnswerValue).filter(Boolean).join("、");
  return String(value ?? "");
}

function renderDetailJson(label, value) {
  return html`
    <section class="detail-block">
      <h4>${escapeHtml(label)}</h4>
      <pre>${escapeHtml(prettyJson(value))}</pre>
    </section>
  `;
}

function renderDrawingPreview(image) {
  if (!image || typeof image !== "string") {
    return html`
      <section class="detail-block">
        <h4>画图 drawing_image</h4>
        <p class="detail-empty">这道题没有画图图片</p>
      </section>
    `;
  }
  return html`
    <section class="detail-block">
      <h4>画图 drawing_image</h4>
      <div class="drawing-preview">
        <img src="${escapeHtml(image)}" alt="画图作答图片" />
      </div>
    </section>
  `;
}

function prettyJson(value) {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value ?? null, null, 2);
}

function renderDesign() {
  return html`
    <section class="single-page design-page">
      <iframe class="moca-pdf-frame" src="${MOCA_SCALE_PDF}#toolbar=0&navpanes=0&scrollbar=1" title="蒙特利尔认知评估量表MoCA" loading="lazy"></iframe>
    </section>
  `;
}

function renderRubricGroup(group, groupIndex) {
  return html`
    <section class="rubric-group">
      <h4>${escapeHtml(group.title)}</h4>
      <div class="rubric-cards">
        ${group.items.map((item, itemIndex) => `
          <button class="rubric-card" data-action="openRubric" data-group="${groupIndex}" data-item="${itemIndex}">
            <span>${escapeHtml(item.title)}</span>
            <em>点击查看</em>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function getRubricItem(groupIndex, itemIndex) {
  const group = rubricGroups[groupIndex];
  const item = group?.items?.[itemIndex];
  return item ? { ...item, groupTitle: group.title } : null;
}

function renderRubricModal(item) {
  return html`
    <div class="rubric-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(item.title)}评分标准">
      <button class="rubric-modal-backdrop" data-action="closeRubric" aria-label="关闭评分标准"></button>
      <article class="rubric-modal-panel">
        <header class="rubric-modal-head">
          <div>
            <span>${escapeHtml(item.groupTitle)}</span>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <button class="icon-button" data-action="closeRubric" aria-label="关闭">×</button>
        </header>
        <div class="rubric-modal-body">
          <section>
            <strong>任务要求</strong>
            <p>${escapeHtml(item.prompt)}</p>
          </section>
          <section>
            <strong>评分标准</strong>
            <p>${escapeHtml(item.scoring)}</p>
          </section>
          ${item.image ? `<img class="rubric-sheet-image large" src="${MOCA_SHEET_IMAGE}" alt="MoCA 原表图片" />` : ""}
        </div>
      </article>
    </div>
  `;
}

function databaseSchemaText() {
  return `Cloudflare D1 后台字段
sessions:
  id, participant_name, birth_year, participant_age, gender, education_level
  started_at, finished_at, saved_at, total_duration_ms
  raw_score, education_bonus, total_score, risk_band, domain_scores_json, payload_json

item_responses:
  session_id, task_id, domain, title, modality, max_score, score
  started_at, ended_at, duration_ms
  answer_json, behavior_json, drawing_image, ai_json

hearing_events:
  session_id, event_type, phase, ear, frequency_hz, level_db_hl, heard
  response_label, environment_status, relative_db, event_at, reaction_ms, payload_json

behavior_json:
  sequence, errors, undoCount, taps, strokes, voiceEvents, audioRecordings, location`;
}

function setupTaskGuide(task, step = getTaskStep(task)) {
  if (task?.type === "trail") setupTrailGuidePracticeCanvas(step);
}

function setupTrailGuidePracticeCanvas() {
  const canvas = document.querySelector("#trailGuideCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  const context = canvas.getContext("2d");
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawTrailGuidePracticeCanvas(canvas);

  canvas.onpointerdown = (event) => {
    const task = tasks[state.activeTaskIndex];
    if (task?.type !== "trail" || !isInstructionComplete(task) || isTrailGuidePracticeComplete()) return;
    const point = canvasPoint(event, canvas);
    const node = nearestTrailGuidePracticeNode(point, canvas);
    if (!node) return;
    playSfx("pick");
    trailGuidePracticeDragStart = node;
    trailGuidePracticeDragPoint = point;
    canvas.setPointerCapture(event.pointerId);
    drawTrailGuidePracticeCanvas(canvas);
  };
  canvas.onpointermove = (event) => {
    if (!trailGuidePracticeDragStart) return;
    trailGuidePracticeDragPoint = canvasPoint(event, canvas);
    drawTrailGuidePracticeCanvas(canvas);
  };
  canvas.onpointerup = (event) => {
    if (!trailGuidePracticeDragStart) return;
    const point = canvasPoint(event, canvas);
    const endNode = nearestTrailGuidePracticeNode(point, canvas);
    commitTrailGuidePracticeDrag(trailGuidePracticeDragStart, endNode, canvas);
    trailGuidePracticeDragStart = null;
    trailGuidePracticeDragPoint = null;
    canvas.releasePointerCapture(event.pointerId);
    drawTrailGuidePracticeCanvas(canvas);
    saveDraft();
    render();
  };
  canvas.onpointercancel = () => {
    trailGuidePracticeDragStart = null;
    trailGuidePracticeDragPoint = null;
    drawTrailGuidePracticeCanvas(canvas);
  };
}

function trailGuidePracticeExpected() {
  return ["1", "甲", "乙"];
}

function trailGuidePracticeEdges() {
  const edges = getResponse("trail").behavior.trailGuidePracticeEdges;
  return Array.isArray(edges) ? edges : [];
}

function commitTrailGuidePracticeDrag(startNode, endNode) {
  const response = getResponse("trail");
  response.behavior.trailGuidePracticeAttempts = Number(response.behavior.trailGuidePracticeAttempts || 0) + 1;
  if (!endNode || startNode.label === endNode.label) {
    response.behavior.trailGuidePracticeMissedDrops = Number(response.behavior.trailGuidePracticeMissedDrops || 0) + 1;
    return;
  }
  const expected = trailGuidePracticeExpected();
  const current = trailGuidePracticeSequence();
  const expectedStart = current.length ? current[current.length - 1] : expected[0];
  const expectedEnd = expected[current.length ? current.length : 1];
  const correct = startNode.label === expectedStart && endNode.label === expectedEnd;
  if (!correct) {
    response.behavior.trailGuidePracticeErrors = Number(response.behavior.trailGuidePracticeErrors || 0) + 1;
    return;
  }
  const next = current.length ? [...current, endNode.label] : [startNode.label, endNode.label];
  response.behavior.trailGuidePracticeSequence = next;
  response.behavior.trailGuidePracticeEdges = [
    ...trailGuidePracticeEdges(),
    { from: startNode.label, to: endNode.label, at: new Date().toISOString() }
  ];
  if (next.length >= expected.length) {
    response.behavior.trailGuidePracticeCompletedAt = new Date().toISOString();
  }
}

function drawTrailGuidePracticeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, rect.width, rect.height);
  context.fillStyle = "#fffdf7";
  context.fillRect(0, 0, rect.width, rect.height);
  const nodes = trailGuidePracticeNodes(canvas);
  const nodeMap = new Map(nodes.map((node) => [node.label, node]));
  const sequence = trailGuidePracticeSequence();
  const complete = isTrailGuidePracticeComplete();

  context.strokeStyle = "rgba(36,52,71,0.16)";
  context.lineWidth = 8;
  context.setLineDash([12, 12]);
  context.lineCap = "round";
  context.beginPath();
  trailGuidePracticeExpected().forEach((label, index) => {
    const node = nodeMap.get(label);
    if (!node) return;
    if (index === 0) context.moveTo(node.x, node.y);
    else context.lineTo(node.x, node.y);
  });
  context.stroke();
  context.setLineDash([]);

  trailGuidePracticeEdges().forEach((edge) => {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from || !to) return;
    context.strokeStyle = "#20a66b";
    context.lineWidth = 7;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  });

  if (trailGuidePracticeDragStart && trailGuidePracticeDragPoint) {
    context.strokeStyle = "rgba(32,166,107,0.82)";
    context.lineWidth = 8;
    context.setLineDash([14, 9]);
    context.beginPath();
    context.moveTo(trailGuidePracticeDragStart.x, trailGuidePracticeDragStart.y);
    context.lineTo(trailGuidePracticeDragPoint.x, trailGuidePracticeDragPoint.y);
    context.stroke();
    context.setLineDash([]);
  }

  nodes.forEach((node) => {
    const used = sequence.includes(node.label);
    context.beginPath();
    context.fillStyle = used ? "#d0f5e4" : "#ffffff";
    context.strokeStyle = used ? "#16a865" : "#243447";
    context.lineWidth = used ? 4 : 2.5;
    context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = used ? "#0d7a48" : "#243447";
    context.font = "800 28px Inter, 'PingFang SC', system-ui";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(node.label, node.x, node.y);
  });

  if (!complete && isInstructionComplete(tasks[state.activeTaskIndex])) {
    const expected = trailGuidePracticeExpected();
    const from = nodeMap.get(sequence.length ? sequence[sequence.length - 1] : expected[0]);
    const to = nodeMap.get(expected[sequence.length ? sequence.length : 1]);
    if (from && to) {
      const x = from.x + (to.x - from.x) * 0.45;
      const y = from.y + (to.y - from.y) * 0.45;
      drawFingerCue(context, x, y, 16, Math.atan2(to.y - from.y, to.x - from.x));
    }
  }
}

function trailGuidePracticeNodes(canvas) {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  return [
    { label: "1", x: w * 0.22, y: h * 0.62, r: 34 },
    { label: "甲", x: w * 0.50, y: h * 0.30, r: 34 },
    { label: "乙", x: w * 0.78, y: h * 0.62, r: 34 }
  ];
}

function nearestTrailGuidePracticeNode(point, canvas) {
  return trailGuidePracticeNodes(canvas).find((node) => Math.sqrt((point.x - node.x) ** 2 + (point.y - node.y) ** 2) <= node.r + 14);
}

function setupCurrentTask(task) {
  if (task.type === "drawing") setupFreeCanvas(task);
  if (task.type === "trail") setupTrailCanvas();
  if (task.type === "naming") scheduleNamingQuestionPrompt(task, getTaskStep(task));
  if (task.type === "orientation") prepareLocationAnswer();
}

function scheduleNamingQuestionPrompt(task, step) {
  const response = getResponse(task.id);
  response.behavior.namingQuestionAudioPlayed = response.behavior.namingQuestionAudioPlayed || {};
  if (response.behavior.namingQuestionAudioPlayed[step]) return;
  response.behavior.namingQuestionAudioPlayed[step] = new Date().toISOString();
  saveDraft();
  window.setTimeout(() => {
    if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== task.id || getTaskStep(task) !== step) return;
    speakText(NAMING_QUESTION_TEXT, {
      audioKey: NAMING_QUESTION_AUDIO_KEY,
      rate: 0.82,
      pitch: 1.18,
      purpose: "instruction",
      staticOnly: true,
      preferBuffer: true
    });
  }, 180);
}

function setupFreeCanvas(task) {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  activeCanvas = canvas;
  activeCanvasTaskId = task.id;
  drawing = false;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  activeCtx = canvas.getContext("2d");
  activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  activeCtx.lineCap = "round";
  activeCtx.lineJoin = "round";
  activeCtx.lineWidth = 8;
  activeCtx.strokeStyle = "#243447";
  activeCtx.fillStyle = "#ffffff";
  activeCtx.fillRect(0, 0, rect.width, rect.height);

  if (state.drawings[task.id]) {
    const image = new Image();
    image.onload = () => activeCtx.drawImage(image, 0, 0, rect.width, rect.height);
    image.src = state.drawings[task.id];
  } else {
    activeCtx.save();
    activeCtx.font = "bold 28px Inter, PingFang SC, system-ui";
    activeCtx.fillStyle = "rgba(36, 52, 71, 0.12)";
    activeCtx.textAlign = "center";
    activeCtx.textBaseline = "middle";
    activeCtx.fillText("在这里画", rect.width / 2, rect.height / 2);
    activeCtx.restore();
  }

  canvas.onpointerdown = (event) => {
    if (!isTaskReadyToAnswer(task)) return;
    beginTask(task.id);
    drawing = true;
    markDrawingInteraction(task);
    rememberDrawingUndoState(task.id);
    canvas.setPointerCapture(event.pointerId);
    const point = canvasPoint(event, canvas);
    const response = getResponse(task.id);
    if (!response.behavior.strokes && !state.drawings[task.id]) {
      activeCtx.fillStyle = "#ffffff";
      activeCtx.fillRect(0, 0, rect.width, rect.height);
      activeCtx.strokeStyle = "#243447";
    }
    activeCtx.beginPath();
    activeCtx.moveTo(point.x, point.y);
    response.behavior.strokes = (response.behavior.strokes || 0) + 1;
  };
  canvas.onpointermove = (event) => {
    if (!drawing) return;
    const point = canvasPoint(event, canvas);
    activeCtx.lineTo(point.x, point.y);
    activeCtx.stroke();
  };
  canvas.onpointerup = (event) => {
    drawing = false;
    canvas.releasePointerCapture(event.pointerId);
    state.drawings[task.id] = canvasToCompactDataUrl(canvas);
    saveDraft();
  };
  startDrawingIdleHints(task);
}

function rememberDrawingUndoState(taskId) {
  drawingUndoStacks[taskId] = drawingUndoStacks[taskId] || [];
  drawingUndoStacks[taskId].push(state.drawings[taskId] || null);
}

function undoDrawing(task) {
  if (!task || task.type !== "drawing") return;
  const stack = drawingUndoStacks[task.id] || [];
  if (!stack.length) return;
  const response = getResponse(task.id);
  const previous = stack.pop();
  response.behavior.undoCount = Number(response.behavior.undoCount || 0) + 1;
  response.behavior.strokes = Math.max(0, Number(response.behavior.strokes || 0) - 1);
  delete response.ai;
  delete response.behavior.submitError;
  delete response.behavior.selectionWarning;
  if (previous) {
    state.drawings[task.id] = previous;
    response.drawingImage = previous;
  } else {
    delete state.drawings[task.id];
    delete response.drawingImage;
    response.behavior.strokes = 0;
    delete response.behavior.firstInteractionAt;
  }
  saveDraft();
  render();
}

function startDrawingIdleHints(task) {
  if (!shouldStartDrawingIdleHints(task)) return;
  drawingIdleTimers.push(window.setTimeout(() => nudgeDrawingConfirm(task), DRAWING_CONFIRM_NUDGE_MS));
}

function shouldStartDrawingIdleHints(task) {
  if (!["cube", "clock"].includes(task.id)) return false;
  const response = getResponse(task.id);
  return !Number(response.behavior.strokes || 0) && !state.drawings[task.id] && !response.drawingImage;
}

function nudgeDrawingConfirm(task) {
  if (!isActiveTask(task) || !shouldStartDrawingIdleHints(task)) return;
  const response = getResponse(task.id);
  response.behavior.confirmNudge = true;
  saveDraft();
  document.querySelector(".confirm-button")?.classList.add("attention-nudge");
}

function markDrawingInteraction(task) {
  const response = getResponse(task.id);
  if (!response.behavior.firstInteractionAt) response.behavior.firstInteractionAt = new Date().toISOString();
  delete response.drawingImage;
  delete response.ai;
  delete response.behavior.confirmNudge;
  stopDrawingIdleTimers();
  document.querySelector(".confirm-button")?.classList.remove("attention-nudge");
}

function stopDrawingIdleTimers() {
  drawingIdleTimers.forEach((timer) => window.clearTimeout(timer));
  drawingIdleTimers = [];
}

function isActiveTask(task) {
  return state.view === "test" && tasks[state.activeTaskIndex]?.id === task?.id;
}

function setupTrailCanvas() {
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  activeCanvas = canvas;
  activeCanvasTaskId = "trail";
  drawing = false;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  activeCtx = canvas.getContext("2d");
  activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvas.onpointerdown = (event) => {
    const task = tasks[state.activeTaskIndex];
    if (!isTaskReadyToAnswer(task)) return;
    beginTask("trail");
    const point = canvasPoint(event, canvas);
    const node = nearestTrailNode(point, canvas);
    if (!node) return;
    playSfx("pick");
    trailDragStart = node;
    trailDragPoint = point;
    canvas.setPointerCapture(event.pointerId);
    drawTrailCanvas(canvas);
  };
  canvas.onpointermove = (event) => {
    if (!trailDragStart) return;
    trailDragPoint = canvasPoint(event, canvas);
    drawTrailCanvas(canvas);
  };
  canvas.onpointerup = (event) => {
    if (!trailDragStart) return;
    const point = canvasPoint(event, canvas);
    const endNode = nearestTrailNode(point, canvas);
    commitTrailDrag(trailDragStart, endNode, canvas);
    trailDragStart = null;
    trailDragPoint = null;
    canvas.releasePointerCapture(event.pointerId);
    drawTrailCanvas(canvas);
    state.drawings.trail = canvasToCompactDataUrl(canvas);
    saveDraft();
    render();
  };
  canvas.onpointercancel = () => {
    trailDragStart = null;
    trailDragPoint = null;
    drawTrailCanvas(canvas);
  };
  if (shouldShowTrailGuide()) startTrailGuide();
  else drawTrailCanvas(canvas);
}

function commitTrailDrag(startNode, endNode, canvas) {
  const response = getResponse("trail");
  if (!endNode || startNode.label === endNode.label) {
    response.behavior.missedDrops = (response.behavior.missedDrops || 0) + 1;
    return;
  }
  state.trail.edges = state.trail.edges || [];
  state.trail.edges.push({
    from: startNode.label,
    to: endNode.label,
    at: new Date().toISOString()
  });
  rebuildTrailFromEdges();
  response.behavior.sequence = [...state.trail.sequence];
  response.behavior.edges = [...state.trail.edges];
  response.behavior.errors = state.trail.errors;
  response.behavior.correctStep = state.trail.correctStep;
  response.behavior.mode = "drag-line";
  response.behavior.lastDrag = {
    from: startNode.label,
    to: endNode?.label || "",
    at: new Date().toISOString()
  };
  if (canvas) response.drawingImage = canvasToCompactDataUrl(canvas);
  maybeOpenTrailCompletionPrompt(response);
}

function trailCompletionEdgeCount() {
  return Array.isArray(state.trail.edges) ? state.trail.edges.length : 0;
}

function isTrailFullyConnected() {
  return trailContainsExpectedSequence(state.trail.sequence || []);
}

function maybeOpenTrailCompletionPrompt(response = getResponse("trail")) {
  const edgeCount = trailCompletionEdgeCount();
  if (!isTrailFullyConnected()) {
    delete response.behavior.trailCompletionPromptVisible;
    return false;
  }
  if (response.behavior.trailCompletionPromptDismissedEdgeCount === edgeCount) return false;
  response.behavior.trailCompletionPromptVisible = true;
  response.behavior.trailCompletionPromptOpenedAt = new Date().toISOString();
  response.behavior.trailCompletionPromptEdgeCount = edgeCount;
  return true;
}

async function confirmTrailCompletion() {
  const response = getResponse("trail");
  response.behavior.trailCompletionPromptVisible = false;
  response.behavior.trailCompletionConfirmedAt = new Date().toISOString();
  response.behavior.trailCompletionConfirmedEdgeCount = trailCompletionEdgeCount();
  await nextTask();
}

function cancelTrailCompletion() {
  const response = getResponse("trail");
  const edgeCount = trailCompletionEdgeCount();
  response.behavior.trailCompletionPromptVisible = false;
  response.behavior.trailCompletionPromptDismissedAt = new Date().toISOString();
  response.behavior.trailCompletionPromptDismissedEdgeCount = edgeCount;
  saveDraft();
  render();
}

function startTrailGuide() {
  stopTrailGuide();
  const canvas = document.querySelector("#taskCanvas");
  if (!canvas) return;
  const tick = () => {
    if (state.view !== "test" || tasks[state.activeTaskIndex]?.type !== "trail" || !shouldShowTrailGuide()) return;
    trailGuideTick += 1;
    drawTrailCanvas(canvas, trailGuideTick);
    trailGuideFrame = requestAnimationFrame(tick);
  };
  trailGuideFrame = requestAnimationFrame(tick);
}

function stopTrailGuide() {
  if (trailGuideFrame) cancelAnimationFrame(trailGuideFrame);
  trailGuideFrame = null;
}

function drawTrailCanvas(canvas, tick = 0) {
  const rect = canvas.getBoundingClientRect();
  activeCtx.clearRect(0, 0, rect.width, rect.height);
  activeCtx.fillStyle = "#fffdf7";
  activeCtx.fillRect(0, 0, rect.width, rect.height);
  const nodes = trailNodes(canvas);
  let fingerCue = null;

  const guideLabels = trailGuideLabels();
  if (guideLabels) {
    const guide = guideLabels.map((label) => nodes.find((node) => node.label === label));
    activeCtx.strokeStyle = "rgba(34,169,107,0.20)";
    activeCtx.lineWidth = 10;
    activeCtx.beginPath();
    guide.forEach((node, index) => {
      if (index === 0) activeCtx.moveTo(node.x, node.y);
      else activeCtx.lineTo(node.x, node.y);
    });
    activeCtx.stroke();
    const progress = (tick % 120) / 120;
    const moving = {
      x: guide[0].x + (guide[1].x - guide[0].x) * progress,
      y: guide[0].y + (guide[1].y - guide[0].y) * progress
    };
    const angle = Math.atan2(guide[1].y - guide[0].y, guide[1].x - guide[0].x);
    fingerCue = { ...moving, angle };
  }

  const nodeMap = new Map(nodes.map((node) => [node.label, node]));
  const edges = trailEdgesForDrawing();
  edges.forEach((edge) => {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from || !to) return;
    activeCtx.strokeStyle = "#20a66b";
    activeCtx.lineWidth = 5;
    activeCtx.setLineDash([]);
    activeCtx.beginPath();
    activeCtx.moveTo(from.x, from.y);
    activeCtx.lineTo(to.x, to.y);
    activeCtx.stroke();
  });
  activeCtx.setLineDash([]);

  if (trailDragStart && trailDragPoint) {
    activeCtx.strokeStyle = "rgba(32, 166, 107, 0.80)";
    activeCtx.lineWidth = 8;
    activeCtx.setLineDash([14, 10]);
    activeCtx.lineCap = "round";
    activeCtx.beginPath();
    activeCtx.moveTo(trailDragStart.x, trailDragStart.y);
    activeCtx.lineTo(trailDragPoint.x, trailDragPoint.y);
    activeCtx.stroke();
    activeCtx.setLineDash([]);
  }

  nodes.forEach((node) => {
    const used = state.trail.sequence.includes(node.label);
    const isNewest = state.trail.sequence[state.trail.sequence.length - 1] === node.label && used;
    if (isNewest) {
      const pulse = (tick % 40) / 40;
      const ringR = node.r + 8 + pulse * 14;
      activeCtx.beginPath();
      activeCtx.arc(node.x, node.y, ringR, 0, Math.PI * 2);
      activeCtx.strokeStyle = `rgba(32, 166, 107, ${(1 - pulse) * 0.6})`;
      activeCtx.lineWidth = 3;
      activeCtx.stroke();
    }
    activeCtx.beginPath();
    activeCtx.fillStyle = used ? "#d0f5e4" : "#ffffff";
    activeCtx.strokeStyle = used ? "#16a865" : "#243447";
    activeCtx.lineWidth = used ? 4 : 2.5;
    activeCtx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    activeCtx.fill();
    activeCtx.stroke();
    activeCtx.fillStyle = used ? "#0d7a48" : "#243447";
    activeCtx.font = "800 28px Inter, 'PingFang SC', system-ui";
    activeCtx.textAlign = "center";
    activeCtx.textBaseline = "middle";
    activeCtx.fillText(node.label, node.x, node.y);
  });

  if (fingerCue) drawFingerCue(activeCtx, fingerCue.x, fingerCue.y, tick, fingerCue.angle);
}

function drawFingerCue(ctx, x, y, tick, angle = 0) {
  const bob = Math.sin(tick / 14) * 3;
  const pulse = 1 + Math.sin(tick / 18) * 0.05;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(angle);
  ctx.scale(pulse, pulse);
  ctx.shadowColor = "rgba(36, 52, 71, 0.22)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.font = "64px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("👉", 0, 2);
  ctx.restore();
}

function shouldShowTrailGuide() {
  return Number(state.trail.correctStep || 0) < 2;
}

function trailGuideLabels() {
  const correctStep = Number(state.trail.correctStep || 0);
  if (correctStep === 0) return ["1", "甲"];
  if (correctStep === 1) return ["甲", "2"];
  return null;
}

function trailNodes(canvas) {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const points = [
    ["戊", 0.28, 0.15],
    ["甲", 0.55, 0.15],
    ["5", 0.12, 0.26],
    ["2", 0.82, 0.32],
    ["乙", 0.55, 0.43],
    ["1", 0.28, 0.51],
    ["丁", 0.12, 0.70],
    ["4", 0.50, 0.66],
    ["3", 0.78, 0.80],
    ["丙", 0.28, 0.86]
  ];
  return points.map(([label, x, y]) => ({ label, x: x * w, y: y * h, r: 34 }));
}

function nearestTrailNode(point, canvas) {
  return trailNodes(canvas).find((node) => Math.sqrt((point.x - node.x) ** 2 + (point.y - node.y) ** 2) <= node.r + 14);
}

function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function captureCanvas(taskId) {
  const canvas = activeCanvasTaskId === taskId ? activeCanvas : null;
  if (!canvas) return state.drawings[taskId] || getResponse(taskId).drawingImage || null;
  const image = canvasToCompactDataUrl(canvas);
  state.drawings[taskId] = image;
  return image;
}

function refreshDrawingImage(taskId) {
  const image = captureCanvas(taskId);
  if (image) getResponse(taskId).drawingImage = image;
  return image;
}

function currentDrawingImage(taskId) {
  const response = getResponse(taskId);
  const image = response.drawingImage || state.drawings[taskId] || captureCanvas(taskId);
  if (image) {
    response.drawingImage = image;
    state.drawings[taskId] = image;
  }
  return image;
}

function canvasToCompactDataUrl(canvas, { maxLongSide = 960, quality = 0.72 } = {}) {
  if (!canvas) return null;
  const sourceWidth = canvas.width || 0;
  const sourceHeight = canvas.height || 0;
  if (!sourceWidth || !sourceHeight) return null;
  const scale = Math.min(1, maxLongSide / Math.max(sourceWidth, sourceHeight));
  const output = document.createElement("canvas");
  output.width = Math.max(1, Math.round(sourceWidth * scale));
  output.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = output.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, output.width, output.height);
  context.drawImage(canvas, 0, 0, output.width, output.height);
  return output.toDataURL("image/jpeg", quality);
}

function cubeReferenceSvg() {
  return `
    <svg class="reference-svg" viewBox="0 0 140 112" role="img" aria-label="立方体参考图">
      <path d="M34 38 H88 V90 H34 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
      <path d="M34 38 L50 22 H104 L88 38 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
      <path d="M88 38 L104 22 V74 L88 90 Z" fill="#ffffff" stroke="#243447" stroke-width="4" stroke-linejoin="round" />
    </svg>
  `;
}

function startHearingCalibration() {
  const previous = normalizeHearingScreening(state.hearingScreening);
  state.hearingScreening = createHearingScreeningState({
    environment: previous.environment,
    environmentChecks: previous.environmentChecks,
    selfSelectedAudioLevelDbHl: previous.selfSelectedAudioLevelDbHl,
    selfSelectedAudioConfirmedAt: previous.selfSelectedAudioConfirmedAt,
    phase: "channel",
    status: "in_progress",
    startedAt: new Date().toISOString()
  });
  saveDraft();
  render();
  queueHearingPrompt();
}

function skipHearingCalibration() {
  state.hearingScreening = {
    ...normalizeHearingScreening(state.hearingScreening),
    phase: "summary",
    status: "skipped",
    finishedAt: new Date().toISOString(),
    summary: {
      protocolVersion: HEARING_PROTOCOL_VERSION,
      status: "skipped",
      pass: null,
      selfSelectedAudioLevelDbHl: normalizeHearingScreening(state.hearingScreening).selfSelectedAudioLevelDbHl,
      mocaAudioLevelDbHl: MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
      cognitionTestAudioLevelDbHl: MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
      note: "用户跳过听力测试"
    }
  };
  enterCognitionTest();
}

function restartHearingCalibration() {
  const previous = normalizeHearingScreening(state.hearingScreening);
  state.hearingScreening = createHearingScreeningState({
    environment: previous.environment,
    environmentChecks: previous.environmentChecks,
    selfSelectedAudioLevelDbHl: previous.selfSelectedAudioLevelDbHl,
    selfSelectedAudioConfirmedAt: previous.selfSelectedAudioConfirmedAt
  });
  saveDraft();
  render();
  queueHearingPrompt();
}

function enterCognitionTest() {
  stopHearingTone();
  state.view = "test";
  state.activeTaskIndex = 0;
  requestImmediateInstructionPlayback(tasks[0]);
  saveDraft();
  render();
}

async function checkHearingEnvironment() {
  const screening = normalizeHearingScreening(state.hearingScreening);
  const startedAt = new Date().toISOString();
  const attempt = {
    id: hearingEventId("hearing-env", screening.environmentChecks.length),
    method: "microphone_rms_relative_db",
    startedAt,
    checkedAt: startedAt,
    status: "checking",
    durationMs: HEARING_ENVIRONMENT_SAMPLE_MS,
    quietThresholdRelativeDb: HEARING_ENVIRONMENT_QUIET_RELATIVE_DB,
    unit: "relative dBFS"
  };
  state.hearingScreening = {
    ...screening,
    environment: { ...screening.environment, status: "checking", checkedAt: startedAt },
    environmentChecks: [...screening.environmentChecks, attempt],
    message: ""
  };
  render();
  if (!navigator.mediaDevices?.getUserMedia) {
    const endedAt = new Date().toISOString();
    const result = { ...attempt, status: "unavailable", relativeDb: null, endedAt, checkedAt: endedAt, reason: "microphone_unsupported" };
    state.hearingScreening.environment = {
      status: result.status,
      relativeDb: result.relativeDb,
      checkedAt: result.checkedAt,
      reason: result.reason,
      method: result.method,
      quietThresholdRelativeDb: result.quietThresholdRelativeDb,
      unit: result.unit
    };
    state.hearingScreening.environmentChecks = replaceLastHearingEnvironmentCheck(state.hearingScreening.environmentChecks, result);
    saveDraft();
    render();
    return;
  }
  let context = null;
  try {
    const stream = await getReusableMicStream();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    context = new AudioContextClass();
    await context.resume?.().catch(() => {});
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const noiseStats = await sampleRelativeEnvironmentDb(analyser, HEARING_ENVIRONMENT_SAMPLE_MS);
    source.disconnect();
    analyser.disconnect();
    context.close?.().catch(() => {});
    releaseMicStream();
    const relativeDb = noiseStats.averageRelativeDb;
    const quiet = relativeDb <= HEARING_ENVIRONMENT_QUIET_RELATIVE_DB;
    const endedAt = new Date().toISOString();
    const result = {
      ...attempt,
      status: quiet ? "quiet" : "noisy",
      relativeDb,
      averageRelativeDb: relativeDb,
      peakRelativeDb: noiseStats.peakRelativeDb,
      sampleCount: noiseStats.sampleCount,
      durationMs: noiseStats.durationMs,
      endedAt,
      checkedAt: endedAt,
      note: "浏览器麦克风相对噪声估计，非校准 dB(A)"
    };
    state.hearingScreening.environment = {
      status: result.status,
      relativeDb: result.relativeDb,
      averageRelativeDb: result.averageRelativeDb,
      peakRelativeDb: result.peakRelativeDb,
      sampleCount: result.sampleCount,
      durationMs: result.durationMs,
      checkedAt: result.checkedAt,
      note: result.note,
      method: result.method,
      quietThresholdRelativeDb: result.quietThresholdRelativeDb,
      unit: result.unit
    };
    state.hearingScreening.environmentChecks = replaceLastHearingEnvironmentCheck(state.hearingScreening.environmentChecks, result);
  } catch (error) {
    context?.close?.().catch(() => {});
    releaseMicStream();
    const endedAt = new Date().toISOString();
    const result = {
      ...attempt,
      status: "unavailable",
      relativeDb: null,
      endedAt,
      checkedAt: endedAt,
      reason: error?.message || "environment_check_failed"
    };
    state.hearingScreening.environment = {
      status: result.status,
      relativeDb: result.relativeDb,
      checkedAt: result.checkedAt,
      reason: result.reason,
      method: result.method,
      quietThresholdRelativeDb: result.quietThresholdRelativeDb,
      unit: result.unit
    };
    state.hearingScreening.environmentChecks = replaceLastHearingEnvironmentCheck(state.hearingScreening.environmentChecks, result);
  }
  saveDraft();
  render();
}

function replaceLastHearingEnvironmentCheck(checks, result) {
  const next = Array.isArray(checks) ? [...checks] : [];
  if (!next.length) return [result];
  next[next.length - 1] = result;
  return next;
}

function sampleRelativeEnvironmentDb(analyser, durationMs) {
  return new Promise((resolve) => {
    const samples = [];
    const data = new Float32Array(analyser.fftSize);
    const startedAt = Date.now();
    const tick = () => {
      analyser.getFloatTimeDomainData(data);
      let sumSquares = 0;
      for (let index = 0; index < data.length; index += 1) sumSquares += data[index] * data[index];
      const rms = Math.sqrt(sumSquares / data.length);
      samples.push(20 * Math.log10(Math.max(rms, 0.000001)));
      if (Date.now() - startedAt >= durationMs) {
        const average = samples.reduce((sum, value) => sum + value, 0) / Math.max(1, samples.length);
        const peak = samples.reduce((max, value) => Math.max(max, value), -Infinity);
        resolve({
          averageRelativeDb: Math.round(average * 10) / 10,
          peakRelativeDb: Number.isFinite(peak) ? Math.round(peak * 10) / 10 : null,
          sampleCount: samples.length,
          durationMs: Date.now() - startedAt
        });
      } else {
        window.setTimeout(tick, 120);
      }
    };
    tick();
  });
}

function confirmHearingChannel(value) {
  const screening = normalizeHearingScreening(state.hearingScreening);
  const previousPhase = screening.phase;
  const previousChannelIndex = screening.channelCheckIndex;
  const side = HEARING_SIDES[screening.channelCheckIndex] || HEARING_SIDES[0];
  const responseAt = new Date().toISOString();
  screening.channelChecks.push({
    id: hearingEventId("hearing-channel", screening.channelChecks.length),
    phase: "channel",
    channelCheckIndex: screening.channelCheckIndex,
    ear: side.key,
    expectedLabel: side.label,
    frequencyHz: 1000,
    levelDbHl: 55,
    response: value === "correct" ? "correct" : "wrong",
    responseLabel: value === "correct" ? "声道正确" : "声道不正确",
    at: responseAt,
    responseAt,
    reactionMs: hearingReactionMs(screening),
    ...hearingToneTiming(screening)
  });
  screening.currentTonePlaying = false;
  screening.message = value === "correct" ? "" : "请检查耳机左右是否戴反。";
  if (value !== "correct") {
    screening.currentTonePlayed = true;
  } else if (screening.channelCheckIndex < HEARING_SIDES.length - 1) {
    screening.currentTonePlayed = false;
    screening.channelCheckIndex += 1;
  } else {
    screening.currentTonePlayed = false;
    screening.phase = "practice";
    screening.practiceIndex = 0;
    screening.message = "";
  }
  state.hearingScreening = screening;
  saveDraft();
  render();
  if (screening.phase !== previousPhase || screening.channelCheckIndex !== previousChannelIndex) queueHearingPrompt();
}

function answerHearingPractice(heard, { source = "button" } = {}) {
  const screening = normalizeHearingScreening(state.hearingScreening);
  const previousPhase = screening.phase;
  const step = HEARING_PRACTICE_STEPS[screening.practiceIndex] || HEARING_PRACTICE_STEPS[0];
  const responseAt = new Date().toISOString();
  screening.practiceResponses.push({
    id: hearingEventId("hearing-practice", screening.practiceResponses.length),
    phase: "practice",
    practiceIndex: screening.practiceIndex,
    ...step,
    earLabel: formatEarLabel(step.ear),
    heard,
    responseLabel: heard ? "听到了" : "没听到",
    source,
    at: responseAt,
    responseAt,
    reactionMs: hearingReactionMs(screening),
    ...hearingToneTiming(screening)
  });
  screening.currentTonePlayed = false;
  screening.currentTonePlaying = false;
  screening.message = "";
  if (screening.practiceIndex < HEARING_PRACTICE_STEPS.length - 1) {
    screening.practiceIndex += 1;
  } else {
    screening.phase = "test";
    screening.trialIndex = 0;
    screening.levelIndex = 0;
  }
  state.hearingScreening = screening;
  saveDraft();
  render();
  if (screening.phase !== previousPhase) queueHearingPrompt();
}

function answerHearingTrial(heard, { source = "button" } = {}) {
  const screening = normalizeHearingScreening(state.hearingScreening);
  const previousPhase = screening.phase;
  const trial = screening.trials[screening.trialIndex] || screening.trials[0];
  const levelDbHl = HEARING_LEVELS_DB_HL[screening.levelIndex] || HEARING_LEVELS_DB_HL[0];
  const responseAt = new Date().toISOString();
  const response = {
    id: hearingEventId("hearing-test", screening.responses.length),
    phase: "test",
    trialIndex: screening.trialIndex,
    attemptIndex: hearingAttemptIndex(screening.responses, trial),
    ear: trial.ear,
    earLabel: formatEarLabel(trial.ear),
    frequencyHz: trial.frequencyHz,
    primary: trial.primary,
    levelDbHl,
    heard,
    responseLabel: heard ? "听到了" : "没听到",
    source,
    at: responseAt,
    responseAt,
    reactionMs: hearingReactionMs(screening),
    ...hearingToneTiming(screening)
  };
  screening.responses.push(response);
  screening.currentTonePlayed = false;
  screening.currentTonePlaying = false;
  if (heard) {
    recordHearingThreshold(screening, trial, { thresholdDbHl: levelDbHl, noResponseAtMax: false });
    response.finalForFrequency = true;
    advanceHearingTrial(screening);
  } else if (screening.levelIndex < HEARING_LEVELS_DB_HL.length - 1) {
    screening.levelIndex += 1;
    screening.message = "再大一点。";
  } else {
    recordHearingThreshold(screening, trial, { thresholdDbHl: null, noResponseAtMax: true });
    response.finalForFrequency = true;
    advanceHearingTrial(screening);
  }
  state.hearingScreening = screening;
  saveDraft();
  render();
  if (screening.phase !== previousPhase) queueHearingPrompt();
}

function recordHearingThreshold(screening, trial, result) {
  screening.thresholds[trial.ear] = screening.thresholds[trial.ear] || {};
  screening.thresholds[trial.ear][trial.frequencyHz] = {
    frequencyHz: trial.frequencyHz,
    primary: trial.primary,
    thresholdDbHl: result.thresholdDbHl,
    noResponseAtMax: Boolean(result.noResponseAtMax),
    recordedAt: new Date().toISOString()
  };
}

function advanceHearingTrial(screening) {
  screening.message = "";
  screening.levelIndex = 0;
  if (screening.trialIndex < screening.trials.length - 1) {
    screening.trialIndex += 1;
    return;
  }
  screening.phase = "summary";
  screening.status = "completed";
  screening.finishedAt = new Date().toISOString();
  screening.summary = summarizeHearingScreening(screening);
  applyMocaAudioLevelFromHearingSummary(screening);
}

function applyMocaAudioLevelFromHearingSummary(screening) {
  screening.mocaAudioLevelDbHl = clampMocaAudioLevelDbHl(screening.summary?.mocaAudioLevelDbHl);
  screening.mocaAudioAdjustedAt = screening.finishedAt || new Date().toISOString();
}

function hearingReactionMs(screening) {
  const endedAt = Number(screening.lastToneEndedAt || 0);
  if (!endedAt) return null;
  return Math.max(0, Date.now() - endedAt);
}

async function playHearingTone(stimulus) {
  const screening = normalizeHearingScreening(state.hearingScreening);
  const frequencyHz = Number(stimulus.frequencyHz);
  const levelDbHl = Number(stimulus.levelDbHl);
  const ear = stimulus.ear === "left" ? "left" : "right";
  if (!Number.isFinite(frequencyHz) || !Number.isFinite(levelDbHl)) return;
  const playbackId = beginAudioPlayback();
  const context = await resumeSpeechAudioContext();
  if (!context || playbackId !== speechPlaybackId) {
    screening.message = "当前浏览器无法播放测试音，请检查声音设置后重试。";
    state.hearingScreening = screening;
    render();
    return;
  }
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const merger = context.createChannelMerger(2);
  const now = context.currentTime + 0.06;
  const duration = HEARING_TONE_DURATION_MS / 1000;
  const endAt = now + duration;
  const outputGain = hearingGainForLevel(levelDbHl, frequencyHz);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequencyHz, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(outputGain, now + HEARING_FADE_SECONDS);
  gain.gain.setValueAtTime(outputGain, Math.max(now + HEARING_FADE_SECONDS, endAt - HEARING_FADE_SECONDS));
  gain.gain.linearRampToValueAtTime(0.0001, endAt);
  oscillator.connect(gain);
  gain.connect(merger, 0, ear === "left" ? 0 : 1);
  merger.connect(context.destination);

  activeHearingTone = { oscillator, gain, merger, playbackId };
  screening.currentTonePlaying = true;
  screening.currentTonePlayed = false;
  screening.lastToneStartedAt = Date.now();
  screening.lastToneEndedAt = null;
  screening.message = "";
  state.hearingScreening = screening;
  playState = "播放中...";
  saveDraft();
  render();

  oscillator.onended = () => {
    if (playbackId !== speechPlaybackId) return;
    cleanupHearingToneNodes(activeHearingTone);
    activeHearingTone = null;
    state.hearingScreening = {
      ...normalizeHearingScreening(state.hearingScreening),
      currentTonePlaying: false,
      currentTonePlayed: true,
      lastToneEndedAt: Date.now()
    };
    playState = "开始";
    saveDraft();
    render();
  };
  oscillator.start(now);
  oscillator.stop(endAt + 0.02);
}

function hearingGainForLevel(levelDbHl, frequencyHz) {
  const base = HEARING_GAIN_BY_LEVEL[levelDbHl] || HEARING_GAIN_BY_LEVEL[35];
  const scale = HEARING_FREQUENCY_GAIN_SCALE[frequencyHz] || 1;
  return Math.max(0.001, Math.min(0.32, base * scale));
}

function stopHearingTone({ markPlayed = false } = {}) {
  if (!activeHearingTone) return false;
  const tone = activeHearingTone;
  activeHearingTone = null;
  try {
    tone.oscillator.onended = null;
    tone.oscillator.stop();
  } catch {}
  cleanupHearingToneNodes(tone);
  if (state.hearingScreening) {
    state.hearingScreening.currentTonePlaying = false;
    if (!markPlayed) state.hearingScreening.currentTonePlayed = false;
  }
  return true;
}

function cleanupHearingToneNodes(tone) {
  if (!tone) return;
  try {
    tone.oscillator.disconnect();
  } catch {}
  try {
    tone.gain.disconnect();
  } catch {}
  try {
    tone.merger.disconnect();
  } catch {}
}

root.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const current = tasks[state.activeTaskIndex];
  const buttonSpeech = buttonSpeechData(target);
  if (action === "closeAdminPasswordDialog") {
    adminPasswordDialog = null;
    render();
    return;
  }
  if (action === "submitAdminPasswordDialog") {
    await submitAdminPasswordDialog();
    return;
  }
  if (requiresDrawerAdminPassword(action, target)) {
    openAdminPasswordDialog(target);
    return;
  }
  if (isTaskActionBlockedUntilInstructionComplete(action, current)) {
    render();
    return;
  }
  if (shouldStartTaskTimingForAction(action, current)) beginTask(current.id);
  if (action === "startSession") playSfx("start");
  else if (["skipTask", "nextTask", "goHome", "navView", "closeMenu", "openMenu"].includes(action)) playSfx("nav");
  else if (["chooseParticipant", "selectTask", "chooseNaming", "toggleMemoryWord", "reviewMemoryReplay", "confirmMemoryIncorrectSubmit", "chooseAbstraction", "appendDigit", "inputSerialDigit", "inputOrientationDigit", "setOrientationDateField", "chooseOrientation", "openRubric", "closeRubric", "clearDrawing", "undoDrawing", "undoTrail", "clearTrail", "confirmTrailCompletion", "cancelTrailCompletion", "selectSavedSession", "startHearingCalibration", "skipHearingCalibration", "restartHearingCalibration", "enterCognitionTest", "confirmHearingChannel", "answerHearingPractice", "answerHearingTrial", "checkHearingEnvironment", "toggleCognitionMenu", "playVolumeSample", "continueToHearing", "replayTaskGuide", "acknowledgeTaskGuide", "touchTrailGuideNode"].includes(action)) playSfx("pick");

  if (shouldStopAudioForAction(action, target)) stopAudioPlayback();
  if (buttonSpeech) speakButtonSelection(buttonSpeech);

  if (action === "toggleCognitionMenu") {
    cognitionMenuOpen = !cognitionMenuOpen;
    render();
    return;
  }
  if (action === "toggleSetupVoice") {
    return;
  }
  if (action === "playVolumeSample") {
    playVolumeSample();
    return;
  }
  if (action === "continueToHearing") {
    continueToHearing();
    return;
  }
  if (action === "checkHearingEnvironment") {
    await checkHearingEnvironment();
    return;
  }
  if (action === "startHearingCalibration") {
    startHearingCalibration();
    return;
  }
  if (action === "skipHearingCalibration") {
    skipHearingCalibration();
    return;
  }
  if (action === "restartHearingCalibration") {
    restartHearingCalibration();
    return;
  }
  if (action === "enterCognitionTest") {
    enterCognitionTest();
    return;
  }
  if (action === "playHearingTone") {
    await playHearingTone({
      ear: target.dataset.ear,
      frequencyHz: Number(target.dataset.frequency),
      levelDbHl: Number(target.dataset.level),
      context: target.dataset.context || "test"
    });
    return;
  }
  if (action === "confirmHearingChannel") {
    confirmHearingChannel(target.dataset.value);
    return;
  }
  if (action === "answerHearingPractice") {
    answerHearingPractice(target.dataset.heard === "true");
    return;
  }
  if (action === "answerHearingTrial") {
    answerHearingTrial(target.dataset.heard === "true");
    return;
  }

  if (action === "startSession") {
    if (!isParticipantComplete()) {
      state.setupAttempted = true;
      saveDraft();
      render();
      return;
    }
    await startNewSession({ ...state.participant });
  }
  if (action === "openMenu") {
    menuOpen = true;
    render();
  }
  if (action === "closeMenu") {
    menuOpen = false;
    render();
  }
  if (action === "navView") {
    const nextView = target.dataset.view;
    if (isProtectedView(nextView) && !ensureProtectedViewAccess()) {
      menuOpen = false;
      render();
      return;
    }
    state.view = nextView;
    menuOpen = false;
    activeRubricItem = null;
    if (state.view === "test") requestImmediateInstructionPlayback(tasks[state.activeTaskIndex]);
    if (state.view === "admin") await loadSessions(false);
    render();
  }
  if (action === "goHome") {
    resetState();
    state.view = "setup";
    menuOpen = false;
    cognitionMenuOpen = false;
    render();
  }
  if (action === "chooseParticipant") {
    state.participant[target.dataset.key] = target.dataset.value;
    state.setupAttempted = false;
    saveDraft();
    render();
  }
  if (action === "selectTask") {
    const nextIndex = Number(target.dataset.index);
    if (tasks[nextIndex]?.id === "memory2" && !isMemory2Available()) {
      menuOpen = false;
      render();
      return;
    }
    state.activeTaskIndex = nextIndex;
    state.view = "test";
    menuOpen = false;
    cognitionMenuOpen = false;
    requestImmediateInstructionPlayback(tasks[nextIndex]);
    render();
  }
  if (action === "skipTask") await skipTask();
  if (action === "nextTask") await nextTask();
  if (action === "chooseNaming") {
    const response = getResponse(current.id);
    const item = current.items[getTaskStep(current)];
    response.answer[item.key] = target.dataset.value;
    saveDraft();
    render();
  }
  if (action === "toggleMemoryWord") toggleMemoryWord(target.dataset.word);
  if (action === "reviewMemoryReplay") {
    reviewMemoryReplay();
    return;
  }
  if (action === "confirmMemoryIncorrectSubmit") {
    await confirmMemoryIncorrectSubmit();
    return;
  }
  if (action === "chooseAbstraction") {
    const response = getResponse("abstraction");
    response.answer[target.dataset.key] = target.dataset.value;
    delete response.behavior.selectionWarning;
    saveDraft();
    render();
  }
  if (action === "playCurrentAudio") playCurrentAudio();
  if (action === "replayTaskGuide") replayTaskGuide();
  if (action === "acknowledgeTaskGuide") acknowledgeTaskGuide();
  if (action === "touchTrailGuideNode") touchTrailGuideNode(target.dataset.label);
  if (action === "toggleVoiceInput") await toggleVoiceInput();
  if (action === "appendDigit") await appendDigit(target.dataset.digit);
  if (action === "backspaceDigit") backspaceDigit();
  if (action === "inputSerialDigit") inputSerialDigit(target.dataset.digit);
  if (action === "backspaceSerial") backspaceSerial();
  if (action === "inputOrientationDigit") inputOrientationDigit(target.dataset.field, target.dataset.digit);
  if (action === "backspaceOrientation") backspaceOrientation(target.dataset.field);
  if (action === "setOrientationDateField") setOrientationDateField(target.dataset.field);
  if (action === "chooseOrientation") {
    applyOrientationChoice(target.dataset.key, target.dataset.value);
    render();
  }
  if (action === "openRubric") {
    activeRubricItem = getRubricItem(Number(target.dataset.group), Number(target.dataset.item));
    render();
  }
  if (action === "closeRubric") {
    activeRubricItem = null;
    render();
  }
  if (action === "tapVigilance") {
    if (Date.now() - vigilancePointerTapAt > 500) tapVigilance();
  }
  if (action === "startFluency") await startFluency();
  if (action === "stopFluency") stopFluency();
  if (action === "clearDrawing") {
    delete state.drawings[current.id];
    drawingUndoStacks[current.id] = [];
    const response = getResponse(current.id);
    delete response.drawingImage;
    delete response.ai;
    response.behavior.strokes = 0;
    response.behavior.undoCount = 0;
    delete response.behavior.confirmNudge;
    delete response.behavior.firstInteractionAt;
    render();
  }
  if (action === "undoDrawing") {
    undoDrawing(current);
    return;
  }
  if (action === "undoTrail") {
    state.trail.edges = state.trail.edges || [];
    state.trail.edges.pop();
    state.trail.undoCount += 1;
    rebuildTrailFromEdges();
    const response = getResponse("trail");
    response.behavior.sequence = [...state.trail.sequence];
    response.behavior.edges = [...state.trail.edges];
    response.behavior.errors = state.trail.errors;
    response.behavior.correctStep = state.trail.correctStep;
    response.behavior.undoCount = state.trail.undoCount;
    delete response.behavior.trailCompletionPromptVisible;
    delete response.behavior.trailCompletionPromptDismissedEdgeCount;
    delete state.drawings.trail;
    render();
  }
  if (action === "confirmTrailCompletion") await confirmTrailCompletion();
  if (action === "cancelTrailCompletion") cancelTrailCompletion();
  if (action === "clearTrail") {
    state.trail = createTrailState({ undoCount: state.trail.undoCount || 0 });
    const response = getResponse("trail");
    response.behavior.sequence = [];
    response.behavior.edges = [];
    response.behavior.errors = 0;
    response.behavior.correctStep = 0;
    delete response.behavior.trailCompletionPromptVisible;
    delete response.behavior.trailCompletionPromptDismissedEdgeCount;
    delete response.drawingImage;
    delete state.drawings.trail;
    render();
  }
  if (action === "saveSession") await saveSession();
  if (action === "saveSessionFromResults") await saveSession({ stayOnResults: true });
  if (action === "newSession") {
    resetState();
    render();
  }
  if (action === "loadSessions") await loadSessions(true);
  if (action === "exportCsv") await exportSessionsCsv();
  if (action === "selectSavedSession") await selectSavedSession(target.dataset.id);
});

function isTaskActionBlockedUntilInstructionComplete(action, task) {
  if (state.view !== "test" || !task) return false;
  if (!taskActionsRequiringInstruction().has(action)) return false;
  return !isTaskReadyToAnswer(task);
}

function taskActionsRequiringInstruction() {
  return new Set([
    "nextTask",
    "confirmTrailCompletion",
    "playCurrentAudio",
    "toggleVoiceInput",
    "chooseNaming",
    "toggleMemoryWord",
    "reviewMemoryReplay",
    "confirmMemoryIncorrectSubmit",
    "appendDigit",
    "backspaceDigit",
    "tapVigilance",
    "startFluency",
    "stopFluency",
    "chooseAbstraction",
    "inputSerialDigit",
    "backspaceSerial",
    "inputOrientationDigit",
    "backspaceOrientation",
    "setOrientationDateField",
    "chooseOrientation",
    "undoDrawing",
    "undoTrail",
    "clearDrawing",
    "clearTrail"
  ]);
}

function shouldStartTaskTimingForAction(action, task) {
  if (state.view !== "test" || !task) return false;
  return new Set([
    "playCurrentAudio",
    "toggleVoiceInput",
    "chooseNaming",
    "toggleMemoryWord",
    "appendDigit",
    "tapVigilance",
    "startFluency",
    "chooseAbstraction",
    "inputSerialDigit",
    "inputOrientationDigit",
    "setOrientationDateField",
    "chooseOrientation",
    "nextTask",
    "confirmTrailCompletion"
  ]).has(action);
}

function shouldStopAudioForAction(action, target) {
  if (action === "tapVigilance") return false;
  if (["closeAdminPasswordDialog", "submitAdminPasswordDialog"].includes(action)) return false;
  if (["openMenu", "closeMenu", "toggleCognitionMenu"].includes(action)) return false;
  if (target.closest(".hidden-drawer") && ["navView", "selectTask"].includes(action)) return false;
  return true;
}

function requiresDrawerAdminPassword(action, target) {
  if (protectedViewsUnlocked) return false;
  if (!target.closest(".drawer-panel")) return false;
  if (action === "goHome") return false;
  return ["navView", "toggleCognitionMenu", "selectTask"].includes(action);
}

function openAdminPasswordDialog(target) {
  adminPasswordDialog = {
    value: "",
    error: "",
    pending: drawerAdminActionFromTarget(target)
  };
  render();
}

function drawerAdminActionFromTarget(target) {
  return {
    action: target.dataset.action || "",
    view: target.dataset.view || "",
    index: target.dataset.index || ""
  };
}

async function submitAdminPasswordDialog() {
  if (!adminPasswordDialog) return;
  const password = String(adminPasswordDialog.value || "");
  if (password !== ADMIN_PASSWORD) {
    adminPasswordDialog = { ...adminPasswordDialog, value: "", error: "密码错误" };
    render();
    return;
  }
  protectedViewsUnlocked = true;
  const pending = adminPasswordDialog.pending;
  adminPasswordDialog = null;
  await runDrawerAdminAction(pending);
}

async function runDrawerAdminAction(pending) {
  if (!pending) return;
  if (pending.action === "toggleCognitionMenu") {
    cognitionMenuOpen = !cognitionMenuOpen;
    render();
    return;
  }
  if (pending.action === "navView") {
    const nextView = pending.view;
    state.view = nextView;
    menuOpen = false;
    activeRubricItem = null;
    if (state.view === "test") requestImmediateInstructionPlayback(tasks[state.activeTaskIndex]);
    if (state.view === "admin") await loadSessions(false);
    render();
    return;
  }
  if (pending.action === "selectTask") {
    const nextIndex = Number(pending.index);
    if (tasks[nextIndex]?.id === "memory2" && !isMemory2Available()) {
      menuOpen = false;
      render();
      return;
    }
    state.activeTaskIndex = nextIndex;
    state.view = "test";
    menuOpen = false;
    cognitionMenuOpen = false;
    requestImmediateInstructionPlayback(tasks[nextIndex]);
    render();
  }
}

function focusAdminPasswordInput() {
  if (!adminPasswordDialog) return;
  window.requestAnimationFrame(() => {
    document.querySelector("[data-admin-password]")?.focus();
  });
}

document.addEventListener("click", (event) => {
  if (state.view !== "setup" || !setupPromptRetryPending || setupPromptPlayed) return;
  if (shouldIgnoreSetupPromptRetryClick(event.target)) return;
  void playSetupPrompt().then((started) => {
    if (!started) return;
    setupPromptPlayed = true;
    setupPromptRetryPending = false;
  });
});

function shouldIgnoreSetupPromptRetryClick(target) {
  return Boolean(target?.closest?.("input, select, textarea, button, [contenteditable='true']"));
}

function buttonSpeechData(target) {
  const text = target?.dataset?.speech;
  if (!text) return null;
  return {
    text,
    audioKey: target.dataset.audioKey || "",
    action: target.dataset.action || ""
  };
}

function speakButtonSelection({ text, audioKey, action }) {
  if (state.view === "setup") return;
  if (state.view === "hearing") {
    speakText(text, { audioKey, rate: 0.82, pitch: 1.1, purpose: "option", staticOnly: true, preferBuffer: true });
    return;
  }
  const task = tasks[state.activeTaskIndex];
  if (!task || ["playCurrentAudio", "toggleVoiceInput", "tapVigilance"].includes(action)) return;
  if (task.type === "choice" && ["appendDigit", "backspaceDigit"].includes(action)) return;
  const response = getResponse(task.id);
  response.behavior.optionAudioPlayback = response.behavior.optionAudioPlayback || [];
  response.behavior.optionAudioPlayback.push({ text, audioKey, action, at: new Date().toISOString() });
  speakText(text, { audioKey, rate: 0.82, pitch: 1.1, purpose: "option", staticOnly: true, preferBuffer: true });
}

root.addEventListener("pointerdown", (event) => {
  const target = event.target.closest("[data-action='tapVigilance']");
  if (!target) return;
  event.preventDefault();
  const task = tasks[state.activeTaskIndex];
  if (!isTaskReadyToAnswer(task)) return;
  vigilancePointerTapAt = Date.now();
  beginTask("vigilance");
  tapVigilance(vigilancePointerTapAt);
}, { passive: false });

root.addEventListener("input", (event) => {
  const target = event.target;
  if (target.dataset.adminPassword !== undefined && adminPasswordDialog) {
    adminPasswordDialog.value = target.value;
    adminPasswordDialog.error = "";
  }
  if (target.dataset.bind) {
    const [, key] = target.dataset.bind.split(".");
    state.participant[key] = target.value;
    saveDraft();
  }
  if (target.dataset.audioVolume !== undefined) {
    updateSelfSelectedAudioLevel(target.value);
    scheduleVolumeSamplePlayback();
  }
  if (target.dataset.voiceManual !== undefined) {
    if (manualTranscriptComposing || event.isComposing) return;
    const task = tasks[state.activeTaskIndex];
    if (!isTaskReadyToAnswer(task)) return;
    beginTask(task.id);
    applyManualVoiceText(target.value);
    refreshTaskActionButtons();
    saveDraft();
  }
  if (target.dataset.fluencyManual !== undefined) {
    if (manualTranscriptComposing || event.isComposing) return;
    const task = tasks[state.activeTaskIndex];
    if (!isTaskReadyToAnswer(task)) return;
    beginTask(task.id);
    const response = getResponse("fluency");
    response.answer.rawTranscript = toSimplifiedChinese(target.value);
    response.answer.interimTranscript = "";
    response.answer.animals = extractAnimalNames(response.answer.rawTranscript);
    response.answer.transcriptionStatus = response.answer.rawTranscript ? "manual" : response.answer.transcriptionStatus;
    if (response.answer.rawTranscript) response.answer.transcriptionMessage = "";
    refreshFluencyCountUi(response);
    refreshTaskActionButtons();
    saveDraft();
  }
});

root.addEventListener("keydown", async (event) => {
  if (!adminPasswordDialog) return;
  if (event.key === "Enter" && event.target?.dataset?.adminPassword !== undefined) {
    event.preventDefault();
    await submitAdminPasswordDialog();
  }
  if (event.key === "Escape") {
    adminPasswordDialog = null;
    render();
  }
});

root.addEventListener("compositionstart", (event) => {
  const target = event.target;
  if (target?.dataset?.voiceManual !== undefined || target?.dataset?.fluencyManual !== undefined) {
    manualTranscriptComposing = true;
  }
});

root.addEventListener("compositionend", (event) => {
  const target = event.target;
  if (target?.dataset?.voiceManual === undefined && target?.dataset?.fluencyManual === undefined) return;
  manualTranscriptComposing = false;
  const task = tasks[state.activeTaskIndex];
  if (!isTaskReadyToAnswer(task)) return;
  beginTask(task.id);
  if (target.dataset.voiceManual !== undefined) applyManualVoiceText(target.value);
  if (target.dataset.fluencyManual !== undefined) {
    const response = getResponse("fluency");
    response.answer.rawTranscript = toSimplifiedChinese(target.value);
    response.answer.interimTranscript = "";
    response.answer.animals = extractAnimalNames(response.answer.rawTranscript);
    response.answer.transcriptionStatus = response.answer.rawTranscript ? "manual" : response.answer.transcriptionStatus;
    if (response.answer.rawTranscript) response.answer.transcriptionMessage = "";
    refreshFluencyCountUi(response);
  }
  refreshTaskActionButtons();
  saveDraft();
});

root.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.birthPart) {
    updateBirthDatePart(target.dataset.birthPart, target.value);
    state.setupAttempted = false;
    saveDraft();
    render();
    return;
  }
  if (target.dataset.audioVolume !== undefined) {
    updateSelfSelectedAudioLevel(target.value, { saveOnly: true });
    return;
  }
  if (target.dataset.bind) {
    const [, key] = target.dataset.bind.split(".");
    state.participant[key] = target.value;
    saveDraft();
  }
});

function updateSelfSelectedAudioLevel(value, options = {}) {
  const level = clampSelfSelectedAudioLevelDbHl(value);
  state.hearingScreening = {
    ...normalizeHearingScreening(state.hearingScreening),
    selfSelectedAudioLevelDbHl: level
  };
  const label = document.querySelector("[data-volume-value]");
  if (label) label.textContent = formatAudioLevel(level);
  saveDraft();
  if (!options.saveOnly) queueVisibleSpeechAudioPreload();
}

function scheduleVolumeSamplePlayback() {
  if (state.view !== "volume") return;
  const now = Date.now();
  const elapsed = now - lastVolumeSampleAt;
  const minGapMs = 850;
  window.clearTimeout(volumeSampleTimer);
  if (elapsed >= minGapMs) {
    lastVolumeSampleAt = now;
    playVolumeSample();
    return;
  }
  volumeSampleTimer = window.setTimeout(() => {
    if (state.view !== "volume") return;
    lastVolumeSampleAt = Date.now();
    playVolumeSample();
  }, minGapMs - elapsed);
}

function playVolumeSample() {
  updateSelfSelectedAudioLevel(state.hearingScreening?.selfSelectedAudioLevelDbHl ?? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL, { saveOnly: true });
  return speakText(VOLUME_SAMPLE_TEXT, {
    audioKey: VOLUME_SAMPLE_AUDIO_KEY,
    rate: 0.82,
    pitch: 1.18,
    purpose: "instruction",
    staticOnly: true,
    preferBuffer: true,
    fallbackMs: browserSpeechFallbackMs(VOLUME_SAMPLE_TEXT)
  });
}

function continueToHearing() {
  enterHearingFlow(currentSelfSelectedAudioLevelDbHl());
}

function enterHearingFlow(audioLevel = MOCA_AUDIO_DEFAULT_LEVEL_DB_HL) {
  window.clearTimeout(volumeSampleTimer);
  volumeSampleTimer = null;
  state.hearingScreening = {
    ...normalizeHearingScreening(state.hearingScreening),
    selfSelectedAudioLevelDbHl: clampSelfSelectedAudioLevelDbHl(audioLevel),
    selfSelectedAudioConfirmedAt: new Date().toISOString()
  };
  state.view = "hearing";
  saveDraft();
  render();
  playHearingIntroPromptNow();
  window.setTimeout(() => {
    if (state.view === "hearing") void requestStartupPermissions();
  }, 2800);
}

async function startNewSession(participant) {
  const adminSessions = state.adminSessions || [];
  state = createInitialState();
  drawingUndoStacks = {};
  pendingAiScoreTaskIds = new Set();
  fluencyAutoAdvanceInProgress = false;
  if (backgroundSessionSaveTimer) window.clearTimeout(backgroundSessionSaveTimer);
  backgroundSessionSaveTimer = null;
  hearingIntroPromptStartedAt = 0;
  state.participant = participant;
  state.adminSessions = adminSessions;
  state.startedAt = new Date().toISOString();
  state.activeTaskIndex = 0;
  state.hearingScreening = createHearingScreeningState();
  cognitionMenuOpen = false;
  enterHearingFlow(MOCA_AUDIO_DEFAULT_LEVEL_DB_HL);
}

async function requestStartupPermissions(options = {}) {
  const { rerender = true } = options;
  await Promise.allSettled([
    primeMicrophonePermission({ keepStream: true }),
    primeLocationPermission({ rerender: false, resolveAddress: true, timeout: 15000 })
  ]);
  if (rerender) render();
}

async function finishSessionAndShowResults() {
  state.view = "results";
  playSfx("finish");
  state.finishedAt = state.finishedAt || new Date().toISOString();
  render();
  if (state.sessionSaveStatus === "saving" || state.sessionSaveStatus === "saved") return;
  try {
    await saveSession({ stayOnResults: true });
  } catch (error) {
    console.warn("Auto-save session failed", error);
    state.sessionSaveStatus = "error";
    state.sessionSaveError = error?.message || String(error || "保存失败");
    render();
  }
}

async function submitActiveTaskWithFeedback(task) {
  if ((task.type === "drawing" || task.type === "trail") && hasDrawableResponse(task)) {
    refreshDrawingImage(task.id);
  }
  state.taskSubmitting = {
    taskId: task.id,
    label: isAsyncDrawingAiTask(task) ? "保存图片..." : needsBlockingAiScore(task) ? "正在评分..." : "请稍等...",
    startedAt: Date.now()
  };
  render();
  try {
    await submitActiveTask();
    return true;
  } catch (error) {
    console.error("Submit task failed", error);
    const response = getResponse(task.id);
    response.behavior.submitError = error?.message || String(error || "提交失败");
    response.behavior.selectionWarning = "提交较慢或失败，请稍后再点确定。";
    return false;
  } finally {
    if (state.taskSubmitting?.taskId === task.id) state.taskSubmitting = null;
  }
}

async function nextTask() {
  if (speechTranscribing || isTaskSubmitting()) return;
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  ensureBlankAnswerForStep(task, response, step);
  if (!isTaskReadyToAnswer(task, step) || !hasTaskAnswer(task, response, step)) {
    render();
    return;
  }
  if (!canConfirmTask(task, response)) {
    render();
    return;
  }
  if (task.type === "serial7") finishSerialStepTiming(response, step);
  if (step < getTaskStepCount(task) - 1) {
    response.answer.step = step + 1;
    requestImmediateInstructionPlayback(task, response.answer.step);
    render();
    return;
  }
  const submitted = await submitActiveTaskWithFeedback(task);
  if (!submitted) {
    render();
    return;
  }
  if (task.id === "memory1" && !state.memoryWaitStartedAt) state.memoryWaitStartedAt = Date.now();
  const nextIndex = nextTaskIndexAfterSubmit(task);
  if (nextIndex < 0) {
    await finishSessionAndShowResults();
    return;
  } else {
    state.activeTaskIndex = nextIndex;
    requestImmediateInstructionPlayback(tasks[nextIndex]);
  }
  render();
}

async function skipTask() {
  if (speechTranscribing || isTaskSubmitting()) return;
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  if (getTaskStepCount(task) > 1) {
    await skipCurrentTaskStep(task, response);
    return;
  }
  response.answer.skipped = true;
  response.behavior.skippedAt = new Date().toISOString();
  if (recognizing || recordingAudio || speechRecognitionStartPending || speechRecognitionWanted) stopVoiceInput();
  if (task.type === "fluency" && response.answer.running) {
    response.answer.running = false;
    window.clearInterval(fluencyTimer);
    stopVoiceInput();
  }
  if (task.type === "vigilance" && response.answer.running) response.answer.running = false;
  if (task.type === "vigilance") {
    window.clearTimeout(vigilanceAutoAdvanceTimer);
    vigilanceAutoAdvanceTimer = null;
  }
  if ((task.type === "drawing" || task.type === "trail") && hasDrawableResponse(task, response)) {
    response.drawingImage = currentDrawingImage(task.id);
  }
  finishTask(task.id);
  if ((task.type === "drawing" || task.type === "trail") && !hasDrawableResponse(task, response)) {
    response.ai = { mode: "blank-response", taskId: task.id, scoreSuggestion: 0, confidence: 1, requiresHumanReview: false };
    response.score = 0;
    saveDraft();
    return;
  }
  response.ai = { mode: "skipped", taskId: task.id, scoreSuggestion: 0, confidence: 1, requiresHumanReview: false };
  response.score = 0;
  if (task.id === "memory1" && !state.memoryWaitStartedAt) state.memoryWaitStartedAt = Date.now();
  const nextIndex = nextTaskIndexAfterSubmit(task);
  if (nextIndex < 0) {
    saveDraft();
    await finishSessionAndShowResults();
    return;
  } else {
    state.activeTaskIndex = nextIndex;
    requestImmediateInstructionPlayback(tasks[nextIndex]);
  }
  saveDraft();
  render();
}

async function skipCurrentTaskStep(task, response) {
  const step = getTaskStep(task);
  if (recognizing || recordingAudio || speechRecognitionStartPending || speechRecognitionWanted) stopVoiceInput();
  if (task.type === "serial7") finishSerialStepTiming(response, step);
  recordSkippedStep(task, response, step);
  clearAnswerForSkippedStep(task, response, step);
  ensureBlankAnswerForStep(task, response, step);
  if (step < getTaskStepCount(task) - 1) {
    response.answer.step = step + 1;
    requestImmediateInstructionPlayback(task, response.answer.step);
    saveDraft();
    render();
    return;
  }
  const submitted = await submitActiveTaskWithFeedback(task);
  if (!submitted) {
    render();
    return;
  }
  const nextIndex = nextTaskIndexAfterSubmit(task);
  if (nextIndex < 0) {
    await finishSessionAndShowResults();
    return;
  }
  state.activeTaskIndex = nextIndex;
  requestImmediateInstructionPlayback(tasks[nextIndex]);
  saveDraft();
  render();
}

function recordSkippedStep(task, response, step) {
  const key = task.type === "orientation"
    ? orientationPrompts[step]?.key || `step${step + 1}`
    : task.items?.[step]?.key || task.sentences?.[step] || `step${step + 1}`;
  response.behavior.skippedSteps = response.behavior.skippedSteps || {};
  response.behavior.skippedSteps[key] = new Date().toISOString();
  if (task.type === "orientation") {
    response.behavior.orientationSkipped = response.behavior.orientationSkipped || {};
    response.behavior.orientationSkipped[key] = response.behavior.skippedSteps[key];
  }
}

function clearAnswerForSkippedStep(task, response, step) {
  response.answer = response.answer || {};
  if (task.type === "naming") {
    const key = task.items?.[step]?.key;
    if (key) response.answer[key] = "";
  }
  if (task.type === "serial7") {
    response.answer.values = response.answer.values || ["", "", "", "", ""];
    response.answer.values[step] = "";
  }
  if (task.type === "sentence") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.interimTranscript = response.answer.interimTranscript || {};
    response.answer.transcript[step] = "";
    response.answer.interimTranscript[step] = "";
  }
  if (task.type === "abstractionChoice") {
    const key = task.items?.[step]?.key;
    if (key) response.answer[key] = "";
  }
  if (task.type === "orientation") {
    const key = orientationPrompts[step]?.key;
    response.answer.orientationChoices = response.answer.orientationChoices || {};
    if (key) delete response.answer.orientationChoices[key];
    if (key === "year") response.answer.year = "";
    if (key === "date") {
      response.answer.month = "";
      response.answer.day = "";
      response.answer.orientationDateActiveField = "month";
    }
    if (key === "weekday") response.answer.weekday = "";
    if (key === "city") response.answer.city = "";
    if (key === "place") response.answer.place = "";
  }
}

function canConfirmTask(task, response) {
  if (task.type === "memory") {
    const selected = response.answer.selectedWords || [];
    const targets = memoryTargetWords();
    response.behavior.memoryCandidateWords = [...memoryCandidateWords("memory1")];
    response.behavior.memoryRecallCandidateWords = [...memoryCandidateWords("memory2")];
    response.behavior.memoryTargetWords = [...targets];
    response.behavior.memorySelectedCorrectCount = selected.filter((word) => targets.includes(word)).length;
    delete response.behavior.selectionWarning;
    if (task.id === "memory1") {
      const complete = selected.length === targets.length && targets.every((word) => selected.includes(word));
      if (!complete && !response.behavior.memoryIncorrectSubmitConfirmed) {
        response.behavior.memoryReviewPromptVisible = true;
        response.behavior.selectionWarning = "这次选择和刚刚读到的词不完全一致。";
        return false;
      }
      delete response.behavior.memoryReviewPromptVisible;
    }
  }
  if (task.type === "abstractionChoice") {
    const item = task.items[getTaskStep(task)];
    if (item.practice && response.answer[item.key] !== item.answer) {
      response.behavior.selectionWarning = "请选择正确答案：水果";
      return false;
    }
    delete response.behavior.selectionWarning;
  }
  if (task.type === "fluency") {
    if (!response.answer.completedAt) {
      response.behavior.selectionWarning = "请先完成 1 分钟动物词语流畅性计数。";
      return false;
    }
    delete response.behavior.selectionWarning;
  }
  return true;
}

function ensureBlankAnswerForStep(task, response, step = getTaskStep(task)) {
  response.answer = response.answer || {};
  if (task.type === "memory") response.answer.selectedWords = response.answer.selectedWords || [];
  if (task.type === "choice") response.answer.sequence = response.answer.sequence || [];
  if (task.type === "serial7") {
    response.answer.values = response.answer.values || ["", "", "", "", ""];
    if (response.answer.values[step] === undefined) response.answer.values[step] = "";
  }
  if (task.type === "naming") {
    const item = task.items[step];
    if (item && response.answer[item.key] === undefined) response.answer[item.key] = "";
  }
  if (task.type === "sentence") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.interimTranscript = response.answer.interimTranscript || {};
    if (response.answer.transcript[step] === undefined) response.answer.transcript[step] = "";
  }
  if (task.type === "fluency") {
    response.answer.rawTranscript = response.answer.rawTranscript || "";
    response.answer.animals = response.answer.animals || [];
  }
  if (task.type === "abstractionChoice") {
    const item = task.items[step];
    if (item && response.answer[item.key] === undefined) response.answer[item.key] = "";
  }
  if (task.type === "orientation") {
    const prompt = orientationPrompts[step];
    response.answer.orientationChoices = response.answer.orientationChoices || {};
    if (prompt?.key === "year") response.answer.year = response.answer.year || "";
    if (prompt?.key === "date") {
      response.answer.month = response.answer.month || "";
      response.answer.day = response.answer.day || "";
    }
    if (prompt?.key === "weekday") response.answer.weekday = response.answer.weekday || "";
    if (prompt?.key === "city") response.answer.city = response.answer.city || "";
    if (prompt?.key === "place") response.answer.place = response.answer.place || "";
  }
}

function nextTaskIndexAfterSubmit(task) {
  if (shouldInsertMemory2(task.id)) {
    state.resumeAfterMemory2Index = nextSequentialIndex(state.activeTaskIndex);
    return taskIndex("memory2");
  }
  if (task.id === "memory2") {
    const resumeIndex = state.resumeAfterMemory2Index;
    state.resumeAfterMemory2Index = null;
    if (Number.isInteger(resumeIndex) && resumeIndex >= 0 && resumeIndex < tasks.length) return resumeIndex;
    if (allNonMemory2TasksSubmitted()) return -1;
  }
  const nextIndex = nextSequentialIndex(state.activeTaskIndex);
  if (nextIndex >= 0) return nextIndex;
  if (shouldRunMemory2AtEnd()) return taskIndex("memory2");
  return -1;
}

function nextSequentialIndex(fromIndex) {
  for (let index = fromIndex + 1; index < tasks.length; index += 1) {
    if (tasks[index].id === "memory2" && !isMemory2Available()) continue;
    return index;
  }
  return -1;
}

function shouldInsertMemory2(currentTaskId) {
  return currentTaskId !== "memory2" && !isMemory2Submitted() && isMemory2Ready();
}

function ensureRenderableTask() {
  if (state.view !== "test") return;
  const task = tasks[state.activeTaskIndex];
  if (task?.id !== "memory2" || isMemory2Available()) return;
  const fallback = nextSequentialIndex(taskIndex("memory2"));
  state.activeTaskIndex = fallback >= 0 ? fallback : 0;
}

function isMemory2Available() {
  return isMemory2Submitted() || isMemory2Ready() || allNonMemory2TasksSubmitted();
}

function isMemory2Submitted() {
  return Boolean(state.responses.memory2?.submitted);
}

function isMemory2Ready() {
  return Boolean(state.memoryWaitStartedAt) && memoryWaitRemaining() <= 0;
}

function shouldRunMemory2AtEnd() {
  return Boolean(state.memoryWaitStartedAt) && !isMemory2Submitted() && allNonMemory2TasksSubmitted();
}

function allNonMemory2TasksSubmitted() {
  return tasks.every((task) => task.id === "memory2" || Boolean(state.responses[task.id]?.submitted));
}

function taskIndex(taskId) {
  return tasks.findIndex((task) => task.id === taskId);
}

async function submitActiveTask() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  if (task.type === "serial7") finishSerialStepTiming(response, getTaskStep(task));
  if (recognizing || recordingAudio || speechRecognitionStartPending || speechRecognitionWanted) stopVoiceInput();
  if (task.type === "fluency" && response.answer.running) {
    response.answer.running = false;
    window.clearInterval(fluencyTimer);
    stopVoiceInput();
  }
  if (task.type === "vigilance") {
    window.clearTimeout(vigilanceAutoAdvanceTimer);
    vigilanceAutoAdvanceTimer = null;
  }
  if ((task.type === "drawing" || task.type === "trail") && hasDrawableResponse(task, response)) {
    response.drawingImage = currentDrawingImage(task.id);
  }
  finishTask(task.id);
  if (isAsyncDrawingAiTask(task)) {
    markDrawingAiPending(task, response);
    response.score = computeTaskScore(task, response);
    saveDraft();
    scheduleDrawingAiScore(task);
    return;
  }
  if (needsBlockingAiScore(task)) response.ai = await scoreTaskWithAi(task);
  response.score = computeTaskScore(task, response);
  saveDraft();
}

function hasDrawableResponse(task, response = getResponse(task.id)) {
  if (task.type === "trail") return trailCompletionEdgeCount() > 0 || Boolean(response.drawingImage || state.drawings.trail);
  if (task.type === "drawing") return Boolean(response.drawingImage || state.drawings[task.id] || Number(response.behavior.strokes || 0));
  return false;
}

function scheduleTaskInstruction(task) {
  const step = getTaskStep(task);
  const key = taskInstructionKey(task, step);
  const force = immediateInstructionPlayback;
  immediateInstructionPlayback = false;
  const alreadyComplete = isInstructionComplete(task, step);
  const instructionPending = Boolean(instructionTimer) || (playState === "播放中..." && speechPlaybackPurpose === "instruction");
  if (state.playedInstructionKeys[key] && !force && (alreadyComplete || instructionPending)) return;
  const text = taskGuideText(task, step);
  if (!text) {
    markInstructionComplete(task, step);
    return;
  }
  state.playedInstructionKeys[key] = true;
  delete state.completedInstructionKeys[key];
  saveDraft();
  clearInstructionTimer();
  instructionTimer = window.setTimeout(() => {
    instructionTimer = null;
    if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== task.id || getTaskStep(task) !== step) return;
    if (task.id === "memory1" && getResponse(task.id).answer.wordsPlaybackStarted) return;
    speakText(text, {
      rate: 0.82,
      pitch: 1.18,
      purpose: "instruction",
      audioKey: audioKeyForInstruction(task, step),
      done: () => markInstructionComplete(task, step)
    });
  }, force ? 0 : 260);
}

function resetInstructionPlayback(task, step = getTaskStep(task)) {
  if (!task) return;
  const key = taskInstructionKey(task, step);
  delete state.playedInstructionKeys[key];
  delete state.completedInstructionKeys[key];
}

function requestImmediateInstructionPlayback(task, step = getTaskStep(task)) {
  resetInstructionPlayback(task, step);
  immediateInstructionPlayback = true;
}

function taskGuideText(task, step = getTaskStep(task)) {
  if (task.type === "naming") {
    const instruction = task.instruction || "请您告诉我这个动物的名字。";
    return instruction.includes(NAMING_QUESTION_TEXT) ? instruction : `${instruction}${NAMING_QUESTION_TEXT}`;
  }
  if (task.type === "abstractionChoice") return abstractionInstructionText(task, step);
  if (task.type === "orientation") return orientationInstructionText(step);
  if (task.type === "serial7") return task.instruction || `请从 100 开始连续减 ${serialSubtractionNumber()}。`;
  if (task.id === "digitBackward") return "下面我再说一些数字，您仔细听。说完后，请按相反的顺序选择出来。例如，听到一二三，您就选择三二一。";
  return task.instruction || task.prompt;
}

function abstractionInstructionText(task, step = getTaskStep(task)) {
  const item = task.items?.[step];
  if (!item) return task.instruction || task.prompt;
  if (item.practice) return "先看一个例子。桔子和香蕉在什么方面相类似？请选择水果。";
  return `请您说说${item.words.join("和")}在什么方面相类似？`;
}

function orientationInstructionText(step = getTaskStep(tasks[state.activeTaskIndex])) {
  return orientationPrompts[step]?.label || tasks.find((task) => task.id === "orientation")?.instruction || "";
}

function taskInstructionKey(task, step = getTaskStep(task)) {
  if (task?.type === "naming") return `${task.id}:guide:${step}`;
  if (task?.type === "abstractionChoice" || task?.type === "orientation") return `${task.id}:guide:${step}`;
  return task ? `${task.id}:guide` : "";
}

function isInstructionComplete(task, step = getTaskStep(task)) {
  if (!task) return true;
  return Boolean(state.completedInstructionKeys?.[taskInstructionKey(task, step)]);
}

function isTaskGuideAcknowledged(task, step = getTaskStep(task)) {
  if (!task) return true;
  return Boolean(state.acknowledgedInstructionKeys?.[taskInstructionKey(task, step)]);
}

function isTaskGuideActive(task, step = getTaskStep(task)) {
  return state.view === "test" && Boolean(task) && !isTaskGuideAcknowledged(task, step);
}

function markInstructionComplete(task, step = getTaskStep(task)) {
  if (!task) return;
  state.completedInstructionKeys = state.completedInstructionKeys || {};
  state.completedInstructionKeys[taskInstructionKey(task, step)] = true;
  saveDraft();
  render();
}

function audioKeyForInstruction(task, step = getTaskStep(task)) {
  if (task?.type === "naming") return `instruction:naming:${step}`;
  if (task?.type === "abstractionChoice") return `instruction:abstraction:${step}`;
  if (task?.type === "orientation") return `instruction:orientation:${step}`;
  if (task?.type === "serial7") return "instruction:serial7:0";
  return task ? `instruction:${task.id}:0` : null;
}

function replayTaskGuide() {
  const task = tasks[state.activeTaskIndex];
  if (!task) return;
  resetInstructionPlayback(task);
  immediateInstructionPlayback = true;
  render();
}

function acknowledgeTaskGuide() {
  const task = tasks[state.activeTaskIndex];
  const step = getTaskStep(task);
  if (!task || !isInstructionComplete(task, step)) return;
  if (task.type === "trail" && !isTrailGuidePracticeComplete()) return;
  state.acknowledgedInstructionKeys = state.acknowledgedInstructionKeys || {};
  state.acknowledgedInstructionKeys[taskInstructionKey(task, step)] = true;
  const response = getResponse(task.id);
  response.behavior.guideAcknowledgedAt = response.behavior.guideAcknowledgedAt || new Date().toISOString();
  beginTask(task.id);
  saveDraft();
  render();
}

function trailGuidePracticeSequence() {
  const sequence = getResponse("trail").behavior.trailGuidePracticeSequence;
  return Array.isArray(sequence) ? sequence : [];
}

function isTrailGuidePracticeComplete() {
  const response = getResponse("trail");
  return Boolean(response.behavior.trailGuidePracticeCompletedAt);
}

function touchTrailGuideNode(label) {
  const task = tasks[state.activeTaskIndex];
  if (task?.type !== "trail" || !isInstructionComplete(task)) return;
  const expected = trailGuidePracticeExpected();
  const response = getResponse("trail");
  if (isTrailGuidePracticeComplete()) return;
  const current = trailGuidePracticeSequence();
  const nextExpected = expected[current.length];
  let next = current;
  if (label === nextExpected) {
    next = [...current, label];
  } else {
    next = label === "1" ? ["1"] : [];
  }
  response.behavior.trailGuidePracticeSequence = next;
  response.behavior.trailGuidePracticeAttempts = Number(response.behavior.trailGuidePracticeAttempts || 0) + 1;
  if (next.length >= expected.length) {
    response.behavior.trailGuidePracticeCompletedAt = new Date().toISOString();
  } else {
    delete response.behavior.trailGuidePracticeCompletedAt;
  }
  saveDraft();
  render();
}

function playCurrentAudio() {
  const task = tasks[state.activeTaskIndex];
  const step = getTaskStep(task);
  if (task.type === "vigilance") return startVigilance();
  if (task.type === "memory") {
    const response = getResponse(task.id);
    prioritizeStartPlayback(task, step);
    return playMemoryWords(response);
  }
  if (task.type === "choice") {
    prioritizeStartPlayback(task, step);
    return playDigitStimulus(task);
  }
  if (task.type === "sentence") return playSentenceForRepeat(task, step);
}

function playMemoryWords(response) {
  const targets = memoryTargetWords();
  const wasStarted = Boolean(response.answer.wordsPlaybackStarted);
  response.answer.audioReady = wasStarted;
  response.answer.wordsPlaybackStarted = true;
  response.behavior.memoryTargetWords = [...targets];
  response.behavior.memoryCandidateWords = [...memoryCandidateWords("memory1")];
  response.behavior.memoryRecallCandidateWords = [...memoryCandidateWords("memory2")];
  response.behavior.memoryPlaybackCount = Number(response.behavior.memoryPlaybackCount || 0) + 1;
  if (wasStarted) response.behavior.replayCount = Number(response.behavior.replayCount || 0) + 1;
  delete response.behavior.memoryReviewPromptVisible;
  return speakItemsSlow(targets, {
    audioKeys: targets.map(memoryWordAudioKey),
    gapMs: 1000,
    rate: 0.72,
    staticOnly: true,
    done: () => {
      response.answer.audioReady = true;
      delete response.behavior.selectionWarning;
      saveDraft();
      render();
    }
  });
}

function reviewMemoryReplay() {
  const task = tasks[state.activeTaskIndex];
  if (task?.id !== "memory1") return;
  const response = getResponse("memory1");
  delete response.behavior.memoryReviewPromptVisible;
  delete response.behavior.selectionWarning;
  saveDraft();
  playMemoryWords(response);
}

async function confirmMemoryIncorrectSubmit() {
  const task = tasks[state.activeTaskIndex];
  if (task?.id !== "memory1") return;
  const response = getResponse("memory1");
  response.behavior.memoryIncorrectSubmitConfirmed = true;
  response.behavior.memoryIncorrectSubmitConfirmedAt = new Date().toISOString();
  delete response.behavior.memoryReviewPromptVisible;
  delete response.behavior.selectionWarning;
  saveDraft();
  await nextTask();
}

function markCurrentInstructionHandled(task, step = getTaskStep(task)) {
  if (!task) return;
  state.playedInstructionKeys[taskInstructionKey(task, step)] = true;
  immediateInstructionPlayback = false;
  saveDraft();
}

function prioritizeStartPlayback(task, step = getTaskStep(task)) {
  clearInstructionTimer();
  stopAudioPlayback();
  markCurrentInstructionHandled(task, step);
}

function playSentenceForRepeat(task, step) {
  const text = task.sentences[step];
  if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== task.id || getTaskStep(task) !== step) return;
  const response = getResponse(task.id);
  response.answer.sentenceAudioReady = response.answer.sentenceAudioReady || {};
  response.answer.sentenceAudioReady[step] = false;
  response.behavior.sentencePlayback = response.behavior.sentencePlayback || [];
  response.behavior.sentencePlayback.push({ step, at: new Date().toISOString() });
  saveDraft();
  return speakText(text, {
    audioKey: `stimulus:sentence:${step}`,
    rate: 0.86,
    purpose: "sentence",
    fallbackMs: sentencePlaybackFallbackMs(text),
    done: () => {
      if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== task.id || getTaskStep(task) !== step) return;
      response.answer.sentenceAudioReady = response.answer.sentenceAudioReady || {};
      response.answer.sentenceAudioReady[step] = true;
      saveDraft();
      render();
    }
  });
}

async function prepareSpeechInputBeforePlayback() {
  speechRecognition = speechRecognition || initSpeechRecognition();
  if (micPermissionReady || !navigator.mediaDevices?.getUserMedia) return micPermissionReady;
  return primeMicrophonePermission();
}

async function startSentenceRepeat(task, step) {
  if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== task.id || getTaskStep(task) !== step) return;
  voiceState = "请复述";
  render();
  await startVoiceInput();
}

function sentencePlaybackFallbackMs(text) {
  return Math.max(3600, Math.min(10000, String(text || "").length * 360 + 1600));
}

function queueSetupPrompt(delayMs = 420) {
  if (setupPromptAttempted || setupPromptPlayed) return;
  setupPromptAttempted = true;
  window.setTimeout(async () => {
    if (state.view !== "setup" || setupPromptPlayed) return;
    const started = await playSetupPrompt();
    if (started) {
      setupPromptPlayed = true;
      setupPromptRetryPending = false;
    } else {
      setupPromptRetryPending = true;
    }
  }, delayMs);
}

function resetSetupPromptPlayback() {
  setupPromptAttempted = false;
  setupPromptPlayed = false;
  setupPromptRetryPending = false;
}

function playSetupPrompt() {
  return speakText(SETUP_PROMPT_TEXT, {
    audioKey: SETUP_PROMPT_AUDIO_KEY,
    rate: 0.82,
    pitch: 1.18,
    purpose: "instruction",
    staticOnly: true,
    preferBuffer: true
  });
}

function playHearingPrompt() {
  const screening = normalizeHearingScreening(state.hearingScreening);
  if (screening.phase === "intro") return playHearingIntroPromptNow();
  const key = hearingPromptAudioKey();
  if (key) return playStaticPrompt(key, "instruction");
  return Promise.resolve(false);
}

function playHearingIntroPromptNow() {
  hearingIntroPromptStartedAt = Date.now();
  return speakText(HEARING_INTRO_PROMPT_TEXT, {
    audioKey: HEARING_PROMPT_AUDIO_KEYS.intro,
    rate: 0.82,
    pitch: 1.18,
    purpose: "instruction",
    preferBuffer: true,
    fallbackMs: browserSpeechFallbackMs(HEARING_INTRO_PROMPT_TEXT)
  });
}

function hearingPromptAudioKey(screening = state.hearingScreening) {
  const normalized = normalizeHearingScreening(screening);
  if (normalized.phase === "channel") {
    const side = HEARING_SIDES[normalized.channelCheckIndex] || HEARING_SIDES[0];
    return HEARING_PROMPT_AUDIO_KEYS.channel[side.key];
  }
  return HEARING_PROMPT_AUDIO_KEYS[normalized.phase] || "";
}

function queueHearingPrompt(delayMs = 180) {
  window.setTimeout(() => {
    if (state.view !== "hearing") return;
    playHearingPrompt();
  }, delayMs);
}

async function playStaticPrompt(audioKey, purpose = "speech") {
  const playbackId = beginAudioPlayback();
  startPlaybackUi(playbackId, purpose);
  let finished = false;
  const finish = () => {
    if (playbackId !== speechPlaybackId || finished) return;
    finished = true;
    playState = "开始";
    speechPlaybackPurpose = null;
    if (shouldRenderForPlaybackUi()) render();
  };
  const started = await playStaticTtsAudio(audioKey, {
    playbackId,
    onStart: null,
    done: finish
  });
  if (!started) finish();
  return started;
}

async function speakText(text, options = {}) {
  const { rate = 0.82, pitch = 1.18, done, onStart, fallbackMs = 0, purpose = "speech", audioKey = null, staticOnly = false, preferBuffer = false } = options;
  const playbackId = beginAudioPlayback();
  const speechParams = speechParamsFor(rate, pitch);
  startPlaybackUi(playbackId, purpose);
  let finished = false;
  const finish = () => {
    if (playbackId !== speechPlaybackId) return;
    if (finished) return;
    finished = true;
    clearSpeechTextFallbackTimer();
    playState = "开始";
    speechPlaybackPurpose = null;
    if (shouldRenderForPlaybackUi()) render();
    if (done) done();
  };

  const staticAudioStarted = await playStaticTtsAudio(audioKey, {
    playbackId,
    onStart,
    done: finish,
    preferBuffer
  });
  if (staticAudioStarted) return;
  if (playbackId !== speechPlaybackId || finished) return;
  if (staticOnly) {
    finish();
    return;
  }
  if (!("speechSynthesis" in window)) {
    finish();
    return;
  }
  await prepareBrowserSpeechSynthesis();
  if (playbackId !== speechPlaybackId || finished) return;
  speechTextFallbackTimer = window.setTimeout(finish, fallbackMs || browserSpeechFallbackMs(text));
  speakTextWithBrowser(text, { playbackId, speechParams, onStart, finish });
}

function startPlaybackUi(playbackId, purpose) {
  if (playbackId !== speechPlaybackId) return;
  playState = "播放中...";
  speechPlaybackPurpose = purpose;
  if (shouldRenderForPlaybackUi()) render();
}

function shouldRenderForPlaybackUi() {
  return state.view !== "setup" && state.view !== "volume";
}

function speakTextWithBrowser(text, { playbackId, speechParams, onStart, finish }) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = speechParams.speedRatio;
  utterance.pitch = speechParams.browserPitch;
  utterance.volume = mocaSpeechVolume();
  const voice = pickNaturalVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => {
    if (playbackId !== speechPlaybackId) return;
    playState = "播放中...";
    if (onStart) onStart();
    if (shouldRenderForPlaybackUi()) render();
  };
  utterance.onend = finish;
  utterance.onerror = finish;
  window.speechSynthesis.resume?.();
  window.speechSynthesis.speak(utterance);
}

function prepareBrowserSpeechSynthesis() {
  if (!("speechSynthesis" in window)) return Promise.resolve(false);
  window.speechSynthesis.resume?.();
  if (window.speechSynthesis.getVoices().length) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(false), 300);
    window.speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timer);
      resolve(true);
    };
  });
}

function browserSpeechFallbackMs(text) {
  return Math.max(1400, Math.min(14000, String(text || "").length * 360 + 1100));
}

function pickNaturalVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter((voice) => /^zh/i.test(voice.lang) || /chinese|mandarin|普通话|中文|國語|国语/i.test(voice.name));
  const profile = currentVoiceProfile();
  const hints = [...profile.hints, ...NATURAL_VOICE_HINTS].map((hint) => hint.toLowerCase());
  return zhVoices.find((voice) => hints.some((hint) => voice.name.toLowerCase().includes(hint))) || zhVoices[0] || null;
}

function speakItemsSlow(items, options = {}) {
  const { gapMs = 1000, rate = 0.72, done, onItemStart, audioKeyPrefix = "", audioKeys = [], staticOnly = false } = options;
  const playbackId = beginAudioPlayback();
  playState = "播放中...";
  render();
  playStaticItemSequence(items, { audioKeyPrefix, audioKeys, gapMs, playbackId, onItemStart, done })
    .catch(() => false)
    .then((started) => {
      if (!started && staticOnly) {
        if (playbackId !== speechPlaybackId) return;
        playState = "开始";
        render();
        if (done) done();
        return;
      }
      if (!started) speakItemsWithBrowser(items, { gapMs, rate, done, onItemStart, audioKeyPrefix, audioKeys, playbackId });
    });
}

function speakItemsWithBrowser(items, { gapMs, rate, done, onItemStart, audioKeyPrefix, audioKeys, playbackId }) {
  let index = 0;
  const speakNext = async () => {
    if (playbackId !== speechPlaybackId) return;
    if (index >= items.length) {
      playState = "开始";
      render();
      if (done) done();
      return;
    }
    const value = items[index];
    const speechParams = speechParamsFor(rate, 1.18);
    const queueNext = () => {
      if (playbackId !== speechPlaybackId) return;
      index += 1;
      speechItemTimer = window.setTimeout(speakNext, gapMs);
    };
    const itemStart = () => {
      if (onItemStart) onItemStart(value, index);
    };
    const audioKey = audioKeys[index] || (audioKeyPrefix ? `${audioKeyPrefix}:${index}` : null);
    const staticAudioStarted = await playStaticTtsAudio(audioKey, {
      playbackId,
      onStart: itemStart,
      done: queueNext
    });
    if (staticAudioStarted) return;
    if (playbackId !== speechPlaybackId) return;
    if (!("speechSynthesis" in window)) {
      itemStart();
      queueNext();
      return;
    }
    await prepareBrowserSpeechSynthesis();
    if (playbackId !== speechPlaybackId) return;
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "zh-CN";
    utterance.rate = speechParams.speedRatio;
    utterance.pitch = speechParams.browserPitch;
    utterance.volume = mocaSpeechVolume();
    const voice = pickNaturalVoice();
    if (voice) utterance.voice = voice;
    let itemFinished = false;
    const finishItem = () => {
      if (itemFinished) return;
      itemFinished = true;
      queueNext();
    };
    const itemFallback = window.setTimeout(finishItem, browserSpeechFallbackMs(value));
    utterance.onstart = itemStart;
    utterance.onend = () => {
      window.clearTimeout(itemFallback);
      finishItem();
    };
    utterance.onerror = () => {
      window.clearTimeout(itemFallback);
      finishItem();
    };
    window.speechSynthesis.resume?.();
    window.speechSynthesis.speak(utterance);
  };
  speakNext();
}

function speechParamsFor(rate, pitch) {
  const profile = currentVoiceProfile();
  const browserPitch = clampSpeech(pitch + profile.pitchOffset, 0.72, 1.55);
  return {
    profile: state.voiceProfile,
    speedRatio: clampSpeech(rate * profile.rateScale, 0.55, 1.08),
    pitchRatio: clampSpeech(browserPitch / 1.18, 0.6, 1.4),
    browserPitch
  };
}

function mocaSpeechVolume() {
  const level = currentSpeechAudioLevelDbHl();
  const volume = MOCA_AUDIO_REFERENCE_VOLUME
    + ((level - MOCA_AUDIO_REFERENCE_LEVEL_DB_HL) / 30) * (1 - MOCA_AUDIO_REFERENCE_VOLUME);
  return clampSpeech(volume, 0.45, 0.95);
}

function currentSpeechAudioLevelDbHl() {
  if (state.view === "hearing" || state.view === "volume") return currentSelfSelectedAudioLevelDbHl();
  return currentMocaAudioLevelDbHl();
}

function currentSelfSelectedAudioLevelDbHl() {
  const screeningLevel = Number(state.hearingScreening?.selfSelectedAudioLevelDbHl);
  if (Number.isFinite(screeningLevel)) return clampSelfSelectedAudioLevelDbHl(screeningLevel);
  return MOCA_AUDIO_DEFAULT_LEVEL_DB_HL;
}

function currentMocaAudioLevelDbHl() {
  const summaryLevel = Number(state.hearingScreening?.summary?.mocaAudioLevelDbHl);
  if (Number.isFinite(summaryLevel)) return clampMocaAudioLevelDbHl(summaryLevel);
  const screeningLevel = Number(state.hearingScreening?.mocaAudioLevelDbHl);
  if (Number.isFinite(screeningLevel)) return clampMocaAudioLevelDbHl(screeningLevel);
  return MOCA_AUDIO_DEFAULT_LEVEL_DB_HL;
}

async function playStaticTtsAudio(audioKey, { playbackId, onStart, done, preferBuffer = false }) {
  if (!audioKey) return false;
  try {
    if (preferBuffer) {
      const bufferStarted = await playStaticTtsBuffer(audioKey, { playbackId, onStart, done });
      if (bufferStarted) return true;
    }
    const url = await staticTtsAudioUrl(audioKey);
    if (!url) return false;
    if (playbackId !== speechPlaybackId) return true;
    return await playAudioUrl(url, playbackId, onStart, done);
  } catch {
    return false;
  }
}

async function playStaticTtsBuffer(audioKey, { playbackId, onStart, done }) {
  const url = await staticTtsAudioUrl(audioKey);
  if (!url) return false;
  const context = await resumeSpeechAudioContext();
  if (!context) return false;
  const buffer = await loadCachedSpeechAudioBuffer(url, context);
  if (playbackId !== speechPlaybackId) return true;
  stopStaticSpeechSources();
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.value = mocaSpeechVolume();
  source.connect(gain);
  gain.connect(context.destination);
  activeSpeechBufferSources.push(source);
  source.onended = () => {
    if (playbackId !== speechPlaybackId) return;
    activeSpeechBufferSources = activeSpeechBufferSources.filter((entry) => entry !== source);
    if (done) done();
  };
  if (onStart) onStart();
  source.start(context.currentTime + 0.01);
  return true;
}

async function staticTtsAudioUrl(audioKey) {
  const manifest = await loadStaticTtsManifest();
  const entry = manifest?.entries?.[audioKey];
  const src = typeof entry === "string" ? entry : entry?.src;
  if (!src) return "";
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("./")) return src;
  return `./${src}`;
}

async function loadStaticTtsManifest() {
  if (staticTtsManifest) return staticTtsManifest;
  if (!staticTtsManifestPromise) {
    staticTtsManifestPromise = fetch(STATIC_TTS_MANIFEST_SRC, { cache: "no-cache" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest) => {
        staticTtsManifest = manifest && typeof manifest === "object" ? manifest : null;
        return staticTtsManifest;
      })
      .catch(() => null);
  }
  return staticTtsManifestPromise;
}

function queueVisibleSpeechAudioPreload() {
  window.clearTimeout(staticAudioPreloadTimer);
  staticAudioPreloadTimer = window.setTimeout(preloadVisibleSpeechAudio, 80);
}

async function preloadVisibleSpeechAudio() {
  staticAudioPreloadTimer = null;
  const keys = [...new Set([...root.querySelectorAll("[data-audio-key]")]
    .map((element) => element.dataset.audioKey)
    .filter(Boolean))]
    .slice(0, 16);
  if (!keys.length) return;
  await Promise.allSettled(keys.map((key) => preloadStaticTtsAudio(key)));
}

async function preloadStaticTtsAudio(audioKey) {
  const url = await staticTtsAudioUrl(audioKey);
  if (!url || staticAudioBufferCache.has(url)) return;
  const context = await speechAudioContextForDecode();
  if (!context) return;
  await loadCachedSpeechAudioBuffer(url, context).catch(() => null);
}

async function playStaticItemSequence(items, { audioKeyPrefix, audioKeys, gapMs, playbackId, onItemStart, done }) {
  const keys = items.map((_, index) => audioKeys[index] || (audioKeyPrefix ? `${audioKeyPrefix}:${index}` : null));
  if (!keys.every(Boolean)) return false;
  const context = await resumeSpeechAudioContext();
  if (!context) return false;
  const urls = await Promise.all(keys.map((key) => staticTtsAudioUrl(key)));
  if (playbackId !== speechPlaybackId) return true;
  if (!urls.every(Boolean)) return false;
  let buffers;
  try {
    buffers = await Promise.all(urls.map((url) => loadCachedSpeechAudioBuffer(url, context)));
  } catch {
    return false;
  }
  if (playbackId !== speechPlaybackId) return true;

  stopStaticSpeechSources();
  let cursor = context.currentTime + 0.08;
  const gapSeconds = gapMs / 1000;
  buffers.forEach((buffer, index) => {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = mocaSpeechVolume();
    source.connect(gain);
    gain.connect(context.destination);
    activeSpeechBufferSources.push(source);
    const delayMs = Math.max(0, (cursor - context.currentTime) * 1000);
    const timer = window.setTimeout(() => {
      if (playbackId !== speechPlaybackId) return;
      if (onItemStart) onItemStart(items[index], index);
    }, delayMs);
    speechItemTimers.push(timer);
    source.start(cursor);
    cursor += buffer.duration + gapSeconds;
    if (index === buffers.length - 1) {
      source.onended = () => finishStaticItemSequence(playbackId, done);
    }
  });
  return true;
}

async function resumeSpeechAudioContext() {
  const context = await speechAudioContextForDecode();
  if (!context) return null;
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      return null;
    }
  }
  return context;
}

async function speechAudioContextForDecode() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  speechAudioContext = speechAudioContext || new AudioContextClass();
  return speechAudioContext;
}

async function loadCachedSpeechAudioBuffer(url, context) {
  if (staticAudioBufferCache.has(url)) return staticAudioBufferCache.get(url);
  if (!staticAudioBufferPromiseCache.has(url)) {
    staticAudioBufferPromiseCache.set(url, loadSpeechAudioBuffer(url, context)
      .then((buffer) => {
        rememberStaticAudioBuffer(url, buffer);
        staticAudioBufferPromiseCache.delete(url);
        return buffer;
      })
      .catch((error) => {
        staticAudioBufferPromiseCache.delete(url);
        throw error;
      }));
  }
  return staticAudioBufferPromiseCache.get(url);
}

function rememberStaticAudioBuffer(url, buffer) {
  if (staticAudioBufferCache.has(url)) staticAudioBufferCache.delete(url);
  staticAudioBufferCache.set(url, buffer);
  while (staticAudioBufferCache.size > STATIC_AUDIO_BUFFER_CACHE_LIMIT) {
    const oldestKey = staticAudioBufferCache.keys().next().value;
    staticAudioBufferCache.delete(oldestKey);
  }
}

async function loadSpeechAudioBuffer(url, context) {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error("Audio fetch failed");
  const arrayBuffer = await response.arrayBuffer();
  return decodeAudioDataCompat(context, arrayBuffer.slice(0));
}

function decodeAudioDataCompat(context, arrayBuffer) {
  return new Promise((resolve, reject) => {
    const result = context.decodeAudioData(arrayBuffer, resolve, reject);
    if (result?.then) result.then(resolve, reject);
  });
}

function finishStaticItemSequence(playbackId, done) {
  if (playbackId !== speechPlaybackId) return;
  activeSpeechBufferSources = [];
  clearSpeechItemTimers();
  playState = "开始";
  render();
  if (done) done();
}

function stopStaticSpeechSources() {
  activeSpeechBufferSources.forEach((source) => {
    source.onended = null;
    try {
      source.stop();
    } catch {
      // Already stopped.
    }
  });
  activeSpeechBufferSources = [];
  clearSpeechItemTimers();
}

function clearSpeechItemTimers() {
  speechItemTimers.forEach((timer) => window.clearTimeout(timer));
  speechItemTimers = [];
}

function playAudioUrl(url, playbackId, onStart, done) {
  return new Promise((resolve) => {
    let resolved = false;
    const resolveOnce = (value) => {
      if (resolved) return;
      resolved = true;
      resolve(value);
    };
    const audio = new Audio(url);
    let progressFrame = null;
    const stopProgress = () => {
      if (progressFrame) cancelAnimationFrame(progressFrame);
      progressFrame = null;
    };
    const updateProgress = () => {
      if (activeSpeechAudio !== audio || playbackId !== speechPlaybackId) return;
      const fill = document.getElementById("audioProgressFill");
      if (fill && Number.isFinite(audio.duration) && audio.duration > 0) {
        fill.style.width = `${Math.min(100, (audio.currentTime / audio.duration) * 100)}%`;
      }
      progressFrame = requestAnimationFrame(updateProgress);
    };
    activeSpeechAudio = audio;
    audio.volume = mocaSpeechVolume();
    audio.onended = () => {
      stopProgress();
      const fill = document.getElementById("audioProgressFill");
      if (fill) fill.style.width = "100%";
      if (activeSpeechAudio === audio) activeSpeechAudio = null;
      if (done) done();
    };
    audio.onerror = () => {
      stopProgress();
      if (activeSpeechAudio === audio) activeSpeechAudio = null;
      if (resolved) {
        if (done) done();
      } else {
        resolveOnce(false);
      }
    };
    audio.play()
      .then(() => {
        if (playbackId !== speechPlaybackId) {
          stopActiveSpeechAudio();
          resolveOnce(true);
          return;
        }
        if (onStart) onStart();
        updateProgress();
        resolveOnce(true);
      })
      .catch(() => {
        if (activeSpeechAudio === audio) activeSpeechAudio = null;
        resolveOnce(false);
      });
  });
}

function stopActiveSpeechAudio() {
  if (!activeSpeechAudio) return;
  activeSpeechAudio.onended = null;
  activeSpeechAudio.onerror = null;
  activeSpeechAudio.pause();
  activeSpeechAudio.removeAttribute("src");
  activeSpeechAudio.load();
  activeSpeechAudio = null;
}

function beginAudioPlayback() {
  speechPlaybackId += 1;
  clearInstructionTimer();
  clearSpeechTextFallbackTimer();
  stopActiveSpeechAudio();
  stopStaticSpeechSources();
  stopHearingTone();
  prepareAudioOutputMode();
  if (speechItemTimer) {
    window.clearTimeout(speechItemTimer);
    speechItemTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  speechPlaybackPurpose = null;
  return speechPlaybackId;
}

function prepareAudioOutputMode() {
  if (recordingAudio || recognizing || speechRecognitionStartPending || speechRecognitionWanted) {
    stopVoiceInput({ releaseMic: false, shouldRender: false });
  }
}

function stopAudioPlayback() {
  clearInstructionTimer();
  const stoppedHearingTone = stopHearingTone();
  if (!("speechSynthesis" in window) && !activeSpeechAudio && !speechItemTimer && playState !== "播放中..." && !stoppedHearingTone) return;
  speechPlaybackId += 1;
  clearSpeechTextFallbackTimer();
  stopActiveSpeechAudio();
  stopStaticSpeechSources();
  if (speechItemTimer) {
    window.clearTimeout(speechItemTimer);
    speechItemTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (playState === "播放中...") playState = "开始";
  speechPlaybackPurpose = null;
}

function clearInstructionTimer() {
  if (!instructionTimer) return;
  window.clearTimeout(instructionTimer);
  instructionTimer = null;
}

function clearSpeechTextFallbackTimer() {
  if (!speechTextFallbackTimer) return;
  window.clearTimeout(speechTextFallbackTimer);
  speechTextFallbackTimer = null;
}

function currentVoiceProfile() {
  return VOICE_PROFILES[state.voiceProfile] || VOICE_PROFILES.cartoon;
}

function clampSpeech(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function playDigitStimulus(task) {
  const response = getResponse(task.id);
  const digitItem = activeDigitItem(task);
  const digits = digitItem.stimulus.split("");
  response.answer.sequence = [];
  response.answer.audioReady = false;
  response.behavior.digitPlayback = [{ stimulus: digitItem.stimulus, digits, bankId: digitItem.bankId, gapMs: 1000, audioMode: "per-digit", at: Date.now() }];
  response.behavior[`${task.id}BankId`] = digitItem.bankId;
  response.behavior[`${task.id}Stimulus`] = digitItem.stimulus;
  speakItemsSlow(digits, {
    audioKeys: digits.map((digit) => `digit:${digit}`),
    gapMs: 1000,
    rate: 0.66,
    staticOnly: true,
    done: () => {
      response.answer.audioReady = true;
      saveDraft();
      render();
    }
  });
}

function initSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => {
    speechRecognitionStartPending = false;
    if (!speechRecognitionWanted) {
      try {
        recognition.stop();
      } catch {
        recognition.abort?.();
      }
      return;
    }
    recognizing = true;
    speechRecognitionLastError = null;
    voiceState = voicePromptText();
    recordSpeechRecognitionEvent("started");
    render();
  };
  recognition.onresult = (event) => {
    if (!speechRecognitionWanted) return;
    const transcript = recognitionTranscriptFromEvent(event);
    applyLiveVoiceText(transcript);
    voiceState = "正在识别";
    render();
  };
  recognition.onend = () => {
    speechRecognitionStartPending = false;
    recognizing = false;
    promoteLiveInterimTranscript();
    recordSpeechRecognitionEvent("end", { finalText: currentLiveFinalText() });
    if (speechRecognitionWanted && !speechRecognitionBlocked) {
      voiceState = "继续听";
      queueSpeechRecognitionRestart();
      render();
      return;
    }
    activeSpeechTaskId = null;
    voiceState = recordingAudio
      ? "已录音，识别已暂停"
      : speechRecognitionLastError
        ? speechRecognitionErrorText(speechRecognitionLastError)
        : "识别结束";
    render();
  };
  recognition.onerror = async (event) => {
    speechRecognitionStartPending = false;
    recognizing = false;
    const error = event?.error || "unknown";
    speechRecognitionLastError = error;
    recordSpeechRecognitionEvent("error", { error });
    if (SPEECH_RECOGNITION_BLOCKING_ERRORS.includes(error)) {
      speechRecognitionBlocked = true;
      speechRecognitionWanted = false;
    }
    voiceState = speechRecognitionErrorText(event?.error);
    if (error === "no-speech") {
      const { task, step } = activeVoiceContext();
      if (task?.type === "sentence") setSpeechWarning(getResponse(task.id), step, "未录到声音，请再说一次");
    }
    render();
    if (SPEECH_RECOGNITION_RECORDING_FALLBACK_ERRORS.includes(error)) {
      await fallbackToAudioRecording("识别服务不可用，已改为录音，可手动修改文字");
    }
  };
  return recognition;
}

async function toggleVoiceInput() {
  if (speechTranscribing) return;
  if (recognizing || recordingAudio || speechRecognitionWanted || speechRecognitionStartPending) stopVoiceInput();
  else await startVoiceInput();
}

async function startVoiceInput() {
  if (speechTranscribing) return false;
  clearSpeechRecognitionRestartTimer();
  voiceState = voicePromptText();
  speechRecognitionLastError = null;
  beginLiveTranscriptSession({ resetFinal: true });
  speechRecognitionStartPending = true;
  render();
  if (PREFER_CLOUDFLARE_ASR) {
    recordSpeechRecognitionEvent("cloudflare-asr-preferred");
    const task = tasks[state.activeTaskIndex];
    const recordingStarted = await startAudioRecording({ transcribeOnStop: true, liveAsr: task?.type !== "fluency" });
    speechRecognitionStartPending = false;
    voiceState = recordingStarted ? voicePromptText() : "当前浏览器不能录音或识别";
    render();
    return recordingStarted;
  }
  speechRecognition = speechRecognition || initSpeechRecognition();
  const micReady = await primeMicrophonePermission();
  if (!micReady && !speechRecognition) {
    recordSpeechRecognitionEvent("mic-unavailable", { permission: state.permissions.microphone });
    activeSpeechTaskId = null;
    speechRecognitionStartPending = false;
    voiceState = speechMicrophoneUnavailableText();
    render();
    return false;
  }
  if (!micReady && state.permissions.microphone === "denied") {
    recordSpeechRecognitionEvent("mic-permission-denied");
    activeSpeechTaskId = null;
    speechRecognitionStartPending = false;
    voiceState = "请允许麦克风权限";
    render();
    return false;
  }
  if (speechRecognition) {
    speechRecognitionWanted = true;
    speechRecognitionBlocked = false;
    recordingAudio = false;
    recordSpeechRecognitionEvent("start-request", { engine: speechRecognition.constructor?.name || "SpeechRecognition" });
    const started = startSpeechRecognitionSafe();
    if (!started) await fallbackToAudioRecording("识别启动失败，已改为录音，可手动修改文字");
    if (!started && !recordingAudio) speechRecognitionStartPending = false;
    render();
    return started || recordingAudio;
  }

  recordSpeechRecognitionEvent("unsupported", { message: "SpeechRecognition API is not available" });
  const recordingStarted = await startAudioRecording();
  speechRecognitionStartPending = false;
  voiceState = recordingStarted ? "已录音，但此浏览器不支持自动转文字" : "当前浏览器不能录音或识别";
  render();
  return recordingStarted;
}

function startSpeechRecognitionSafe() {
  if (!speechRecognition || recognizing || speechRecognitionStartPending || !speechRecognitionWanted || speechRecognitionBlocked) return false;
  try {
    speechRecognitionStartPending = true;
    speechRecognition.start();
    return true;
  } catch (error) {
    speechRecognitionStartPending = false;
    speechRecognitionBlocked = true;
    speechRecognitionWanted = false;
    recordSpeechRecognitionEvent("start-failed", {
      message: error?.message || "SpeechRecognition.start() failed",
      name: error?.name || "Error"
    });
    voiceState = "识别启动失败，请再点一次开始";
    render();
    return false;
  }
}

function queueSpeechRecognitionRestart() {
  clearSpeechRecognitionRestartTimer();
  speechRecognitionRestartTimer = window.setTimeout(() => {
    speechRecognitionRestartTimer = null;
    if (!speechRecognitionWanted || speechRecognitionBlocked || recognizing || speechRecognitionStartPending) return;
    startSpeechRecognitionSafe();
  }, SPEECH_RECOGNITION_RESTART_DELAY_MS);
}

function clearSpeechRecognitionRestartTimer() {
  if (!speechRecognitionRestartTimer) return;
  window.clearTimeout(speechRecognitionRestartTimer);
  speechRecognitionRestartTimer = null;
}

async function fallbackToAudioRecording(reason) {
  if (recordingAudio || mediaRecorder?.state === "recording") return true;
  recordSpeechRecognitionEvent("recording-fallback", { reason });
  const recordingStarted = await startAudioRecording();
  if (recordingStarted) {
    voiceState = reason;
    render();
  }
  return recordingStarted;
}

function stopVoiceInput(options = {}) {
  const { releaseMic = false, shouldRender = true } = options;
  clearSpeechRecognitionRestartTimer();
  const wasRecognitionPending = speechRecognitionStartPending;
  const wasRecording = mediaRecorder && mediaRecorder.state === "recording";
  const wasPcmRecording = Boolean(pcmRecorder);
  speechRecognitionWanted = false;
  speechRecognitionStartPending = false;
  speechRecognitionLastError = null;
  if (!recognizing) {
    promoteLiveInterimTranscript();
    activeSpeechTaskId = null;
  }
  if (speechRecognition && (recognizing || wasRecognitionPending)) {
    try {
      speechRecognition.stop();
    } catch {
      speechRecognition.abort?.();
    }
  }
  if (wasPcmRecording) {
    releaseMicAfterRecordingStop = releaseMic;
    if (recordingWillTranscribe) {
      speechTranscribing = true;
      voiceState = "请稍等";
    }
    finishPcmAudioRecording(pcmRecorder);
    pcmRecorder = null;
  } else if (wasRecording) {
    releaseMicAfterRecordingStop = releaseMic;
    if (recordingWillTranscribe) {
      speechTranscribing = true;
      voiceState = "请稍等";
    }
    try {
      mediaRecorder.requestData?.();
    } catch {
      // Some mobile browsers throw if requestData lands too close to stop().
    }
    mediaRecorder.stop();
  } else if (releaseMic) {
    releaseMicStream();
  }
  recordingAudio = false;
  if (!speechTranscribing) voiceState = "待说";
  if (shouldRender) render();
}

async function startAudioRecording(options = {}) {
  const { transcribeOnStop = false, liveAsr = true } = options;
  if (transcribeOnStop) {
    const pcmStarted = await startPcmAudioRecording({ transcribeOnStop, liveAsr });
    if (pcmStarted !== null) return pcmStarted;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    voiceState = "当前浏览器不能录音";
    render();
    return false;
  }
  if (state.permissions.microphone === "denied") {
    voiceState = "请允许麦克风权限";
    render();
    return false;
  }
  if (mediaRecorder && mediaRecorder.state === "recording") return true;
  try {
    micStream = await getReusableMicStream();
    micPermissionReady = true;
    audioChunks = [];
    releaseMicAfterRecordingStop = false;
    recordingWillTranscribe = transcribeOnStop;
    const recorderOptions = mediaRecorderOptions();
    const recorder = new MediaRecorder(micStream, recorderOptions);
    mediaRecorder = recorder;
    const recordingMimeType = recorder.mimeType || recorderOptions.mimeType || "";
    const task = tasks[state.activeTaskIndex];
    const step = getTaskStep(task);
    const response = getResponse(task.id);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) audioChunks.push(event.data);
    };
    mediaRecorder.onerror = (event) => {
      recordSpeechRecognitionEvent("media-recorder-error", { message: event?.error?.message || "MediaRecorder error" });
    };
    mediaRecorder.onstop = async () => {
      const shouldReleaseMic = releaseMicAfterRecordingStop;
      releaseMicAfterRecordingStop = false;
      let micReleased = false;
      try {
        const blobType = recordingBlobType(recorder, audioChunks, recordingMimeType);
        const blob = new Blob(audioChunks, { type: blobType });
        response.behavior.audioRecordings = response.behavior.audioRecordings || [];
        response.behavior.audioRecordings.push({
          step,
          mimeType: blob.type || "application/octet-stream",
          size: blob.size,
          chunks: audioChunks.length,
          recorderMimeType: recordingMimeType,
          endedAt: new Date().toISOString()
        });
        storeAudioRecordingDraft(response, step, blob);
        if (shouldReleaseMic) {
          releaseMicStream();
          micReleased = true;
        }
        if (transcribeOnStop && blob.size) {
          await transcribeAudioBlob(blob, task.id, step);
        } else if (transcribeOnStop) {
          speechTranscribing = false;
          voiceState = "未录到声音，请再说一次";
          setSpeechWarning(response, step, "未录到声音，请再说一次");
          saveDraft();
          if (task.id === "fluency" && response.answer.completedAt) {
            const advanced = await autoAdvanceFluencyAfterTranscription();
            if (!advanced) render();
          } else {
            render();
          }
        }
      } finally {
        recordingWillTranscribe = false;
        if (mediaRecorder === recorder) mediaRecorder = null;
        if (shouldReleaseMic && !micReleased) releaseMicStream();
      }
    };
    try {
      mediaRecorder.start(1000);
    } catch {
      mediaRecorder.start();
    }
    recordingAudio = true;
    playSfx("recordStart");
    voiceState = voicePromptText();
    render();
    return true;
  } catch {
    recordingAudio = false;
    releaseMicAfterRecordingStop = false;
    recordingWillTranscribe = false;
    state.permissions.microphone = "denied";
    voiceState = "请允许麦克风权限";
    saveDraft();
    render();
    return false;
  }
}

async function startPcmAudioRecording(options = {}) {
  const { transcribeOnStop = false, liveAsr = true } = options;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!navigator.mediaDevices?.getUserMedia || !AudioContextClass) return null;
  if (!AudioContextClass.prototype?.createScriptProcessor) return null;
  if (state.permissions.microphone === "denied") {
    voiceState = "请允许麦克风权限";
    render();
    return false;
  }
  if (pcmRecorder) return true;
  try {
    micStream = await getReusableMicStream();
    micPermissionReady = true;
    const context = new AudioContextClass();
    await context.resume?.().catch(() => {});
    const source = context.createMediaStreamSource(micStream);
    const processor = context.createScriptProcessor(4096, 1, 1);
    const chunks = [];
    const task = tasks[state.activeTaskIndex];
    const step = getTaskStep(task);
    const response = getResponse(task.id);
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(input));
      const output = event.outputBuffer.getChannelData(0);
      output.fill(0);
    };
    source.connect(processor);
    processor.connect(context.destination);
    pcmRecorder = {
      chunks,
      context,
      liveChunkIndex: 0,
      liveRequestActive: false,
      liveSequence: 0,
      liveTimer: null,
      processor,
      response,
      sampleRate: context.sampleRate,
      source,
      step,
      taskId: task.id,
      transcribeOnStop
    };
    releaseMicAfterRecordingStop = false;
    recordingWillTranscribe = transcribeOnStop;
    recordingAudio = true;
    playSfx("recordStart");
    voiceState = voicePromptText();
    if (task.type === "fluency" && transcribeOnStop && liveAsr) startFluencyLiveAsr(pcmRecorder);
    render();
    return true;
  } catch (error) {
    cleanupPcmRecorder(pcmRecorder);
    pcmRecorder = null;
    recordingAudio = false;
    recordingWillTranscribe = false;
    if (["NotAllowedError", "PermissionDeniedError", "NotFoundError", "NotReadableError"].includes(error?.name)) {
      state.permissions.microphone = error?.name === "NotFoundError" ? "unsupported" : "denied";
      voiceState = error?.name === "NotFoundError" ? "没有找到麦克风" : "请允许麦克风权限";
      saveDraft();
      render();
      return false;
    }
    return null;
  }
}

async function finishPcmAudioRecording(recorder) {
  if (!recorder) return;
  const shouldReleaseMic = releaseMicAfterRecordingStop;
  releaseMicAfterRecordingStop = false;
  let micReleased = false;
  try {
    stopFluencyLiveAsr(recorder);
    if (recorder.liveRequestPromise) {
      await recorder.liveRequestPromise.catch(() => {});
    }
    if (recorder.taskId === "fluency" && recorder.transcribeOnStop) {
      await flushFluencyLiveAsr(recorder, { force: true, finalChunk: true });
    }
    recorder.finished = true;
    cleanupPcmRecorder(recorder);
    const task = tasks.find((entry) => entry.id === recorder.taskId);
    const response = getResponse(recorder.taskId);
    const blob = wavBlobFromFloat32Chunks(recorder.chunks, recorder.sampleRate);
    response.behavior.audioRecordings = response.behavior.audioRecordings || [];
    response.behavior.audioRecordings.push({
      step: recorder.step,
      mimeType: blob.type,
      size: blob.size,
      chunks: recorder.chunks.length,
      recorderMimeType: "audio/wav;codec=pcm",
      inputSampleRate: recorder.sampleRate,
      endedAt: new Date().toISOString()
    });
    storeAudioRecordingDraft(response, recorder.step, blob);
    if (shouldReleaseMic) {
      releaseMicStream();
      micReleased = true;
    }
    if (recorder.transcribeOnStop && blob.size && task) {
      await transcribeAudioBlob(blob, recorder.taskId, recorder.step);
    } else if (recorder.transcribeOnStop) {
      speechTranscribing = false;
      voiceState = "未录到声音，请再说一次";
      setSpeechWarning(response, recorder.step, "未录到声音，请再说一次");
      saveDraft();
      if (recorder.taskId === "fluency" && response.answer.completedAt) {
        const advanced = await autoAdvanceFluencyAfterTranscription();
        if (!advanced) render();
      } else {
        render();
      }
    }
  } catch (error) {
    speechTranscribing = false;
    voiceState = "录音处理失败，请重试";
    saveDraft();
    if (recorder.taskId === "fluency" && getResponse("fluency").answer.completedAt) {
      const advanced = await autoAdvanceFluencyAfterTranscription();
      if (!advanced) render();
    } else {
      render();
    }
  } finally {
    recordingWillTranscribe = false;
    if (shouldReleaseMic && !micReleased) releaseMicStream();
  }
}

function cleanupPcmRecorder(recorder) {
  if (!recorder) return;
  stopFluencyLiveAsr(recorder);
  recorder.processor.onaudioprocess = null;
  try {
    recorder.processor.disconnect();
  } catch {}
  try {
    recorder.source.disconnect();
  } catch {}
  recorder.context.close?.().catch(() => {});
}

function startFluencyLiveAsr(recorder) {
  stopFluencyLiveAsr(recorder);
  recorder.liveChunkIndex = 0;
  recorder.liveRequestActive = false;
  recorder.liveSequence = 0;
  recorder.liveTimer = window.setInterval(() => {
    flushFluencyLiveAsr(recorder);
  }, FLUENCY_LIVE_ASR_INTERVAL_MS);
}

function stopFluencyLiveAsr(recorder) {
  if (!recorder?.liveTimer) return;
  window.clearInterval(recorder.liveTimer);
  recorder.liveTimer = null;
}

async function flushFluencyLiveAsr(recorder, options = {}) {
  const { force = false, finalChunk = false } = options;
  if (!recorder || recorder.finished || recorder.liveRequestActive || recorder.taskId !== "fluency") return;
  const endIndex = recorder.chunks.length;
  if (!force && endIndex - recorder.liveChunkIndex < FLUENCY_LIVE_ASR_MIN_CHUNKS) return;
  const chunks = recorder.chunks.slice(recorder.liveChunkIndex, endIndex);
  if (!chunks.length) return;
  recorder.liveChunkIndex = endIndex;
  recorder.liveRequestActive = true;
  const sequence = recorder.liveSequence + 1;
  recorder.liveSequence = sequence;
  const blob = wavBlobFromFloat32Chunks(chunks, recorder.sampleRate);
  const task = tasks.find((entry) => entry.id === "fluency");
  const response = getResponse("fluency");
  response.behavior.speechRecognition = response.behavior.speechRecognition || [];
  response.behavior.speechRecognition.push({
    step: recorder.step,
    eventType: "cloudflare-asr-live-upload",
    sequence,
    finalChunk,
    size: blob.size,
    at: new Date().toISOString()
  });
  const uploadPromise = (async () => {
    const result = await requestAsrJson(task, `live-${sequence}`, blob);
    if (recorder.finished && !finalChunk) return;
    const text = cleanAsrTranscript(result?.text || result?.transcription || "");
    response.behavior.speechRecognition.push({
      step: recorder.step,
      eventType: "cloudflare-asr-live-result",
      sequence,
      finalChunk,
      text,
      at: new Date().toISOString()
    });
    if (text) applyFluencyLiveText(response, recorder.step, text);
  })();
  recorder.liveRequestPromise = uploadPromise;
  try {
    await uploadPromise;
  } catch (error) {
    response.behavior.speechRecognition.push({
      step: recorder.step,
      eventType: "cloudflare-asr-live-error",
      sequence,
      finalChunk,
      message: error?.message || "Live ASR failed",
      at: new Date().toISOString()
    });
    saveDraft();
  } finally {
    recorder.liveRequestActive = false;
    if (recorder.liveRequestPromise === uploadPromise) recorder.liveRequestPromise = null;
  }
}

function applyFluencyLiveText(response, step, text) {
  response.answer.rawTranscript = fluencyTranscriptFromAsrText(text, response.answer.rawTranscript);
  response.answer.interimTranscript = "";
  response.answer.animals = extractAnimalNames(response.answer.rawTranscript);
  response.behavior.liveTranscript = response.behavior.liveTranscript || {};
  response.behavior.liveTranscript[step] = {
    finalText: response.answer.rawTranscript,
    interimText: "",
    updatedAt: new Date().toISOString()
  };
  saveDraft();
  render();
}

function wavBlobFromFloat32Chunks(chunks, inputSampleRate) {
  const merged = mergeFloat32Chunks(chunks);
  const outputSampleRate = Math.min(16000, Math.max(8000, Math.round(inputSampleRate || 16000)));
  const samples = downsampleFloat32(merged, inputSampleRate || outputSampleRate, outputSampleRate);
  const bytesPerSample = 2;
  const headerBytes = 44;
  const buffer = new ArrayBuffer(headerBytes + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, outputSampleRate, true);
  view.setUint32(28, outputSampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 8 * bytesPerSample, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);
  floatTo16BitPcm(view, 44, samples);
  return new Blob([buffer], { type: "audio/wav" });
}

function mergeFloat32Chunks(chunks) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Float32Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });
  return merged;
}

function downsampleFloat32(samples, inputSampleRate, outputSampleRate) {
  if (outputSampleRate >= inputSampleRate) return samples;
  const ratio = inputSampleRate / outputSampleRate;
  const length = Math.max(1, Math.round(samples.length / ratio));
  const result = new Float32Array(length);
  for (let index = 0; index < length; index += 1) {
    const start = Math.floor(index * ratio);
    const end = Math.min(samples.length, Math.floor((index + 1) * ratio));
    let sum = 0;
    for (let source = start; source < end; source += 1) sum += samples[source];
    result[index] = sum / Math.max(1, end - start);
  }
  return result;
}

function writeAscii(view, offset, text) {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
}

function floatTo16BitPcm(view, offset, samples) {
  for (let index = 0; index < samples.length; index += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
}

function mediaRecorderOptions() {
  const mimeType = RECORDER_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
  return mimeType
    ? { mimeType, audioBitsPerSecond: 32000 }
    : { audioBitsPerSecond: 32000 };
}

function recordingBlobType(recorder, chunks, fallbackType) {
  return recorder?.mimeType || chunks.find((chunk) => chunk.type)?.type || fallbackType || "application/octet-stream";
}

function storeAudioRecordingDraft(response, step, blob) {
  if (!blob.size) {
    saveDraft();
    return;
  }
  if (blob.size > MAX_DRAFT_AUDIO_RECORDING_BYTES) {
    response.answer.audioRecordings = response.answer.audioRecordings || {};
    delete response.answer.audioRecordings[step];
    saveDraft();
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    response.answer.audioRecordings = response.answer.audioRecordings || {};
    response.answer.audioRecordings[step] = reader.result;
    saveDraft();
  };
  reader.onerror = () => {
    saveDraft();
  };
  try {
    reader.readAsDataURL(blob);
  } catch {
    saveDraft();
  }
}

async function getReusableMicStream() {
  if (micStream && micStream.getAudioTracks().some((track) => track.readyState === "live")) return micStream;
  micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  state.permissions.microphone = "granted";
  return micStream;
}

async function transcribeAudioBlob(blob, taskId, step) {
  const task = tasks.find((entry) => entry.id === taskId);
  if (!task || !["sentence", "fluency"].includes(task.type)) {
    speechTranscribing = false;
    render();
    return;
  }
  const response = getResponse(task.id);
  const transcriptionId = activeTranscriptionId + 1;
  activeTranscriptionId = transcriptionId;
  const transcriptionStartedAt = Date.now();
  speechTranscribing = true;
  response.behavior.speechRecognition = response.behavior.speechRecognition || [];
  response.behavior.asrStartedAt = response.behavior.asrStartedAt || {};
  response.behavior.asrStartedAt[step] = transcriptionStartedAt;
  if (task.type === "fluency") {
    response.answer.transcriptionStatus = "uploading";
    response.answer.transcriptionMessage = "正在上传录音并计数...";
  }
  response.behavior.speechRecognition.push({
    step,
    eventType: "cloudflare-asr-upload",
    mimeType: blob.type,
    size: blob.size,
    at: new Date().toISOString()
  });
  voiceState = "请稍等";
  render();
  try {
    const result = await requestAsrJson(task, step, blob, {
      timeoutMs: task.type === "fluency" ? FLUENCY_ASR_TIMEOUT_MS : ASR_TIMEOUT_MS
    });
    const text = cleanAsrTranscript(result?.text || result?.transcription || "");
    response.behavior.speechRecognition.push({
      step,
      eventType: "cloudflare-asr-result",
      provider: result?.provider || "cloudflare-workers-ai",
      model: result?.model || "",
      text,
      at: new Date().toISOString()
    });
    if (text) {
      applyVoiceTextForTask(task, response, step, text, { transcriptionStartedAt });
      if (task.type === "fluency") {
        response.answer.transcriptionStatus = "completed";
        response.answer.transcriptionMessage = "计数完成";
      }
    } else {
      setSpeechWarning(response, step, "未录到声音，请再说一次");
      if (task.type === "fluency") {
        response.answer.transcriptionStatus = "empty";
        response.answer.transcriptionMessage = "未识别到动物名称，可手动修改后继续";
      }
    }
    voiceState = text ? "转文字完成" : "未录到声音，请再说一次";
    render();
  } catch (error) {
    response.behavior.speechRecognition.push({
      step,
      eventType: "cloudflare-asr-error",
      message: error?.message || "ASR failed",
      at: new Date().toISOString()
    });
    if (task.type === "fluency") {
      response.answer.transcriptionStatus = "error";
      response.answer.transcriptionMessage = "计数失败，可手动修改后继续";
    }
    voiceState = "转文字失败，可手动输入";
    saveDraft();
    render();
  } finally {
    if (activeTranscriptionId === transcriptionId) {
      speechTranscribing = false;
      const advanced = task.type === "fluency" && response.answer.completedAt
        ? await autoAdvanceFluencyAfterTranscription()
        : false;
      if (!advanced) render();
    }
  }
}

async function requestAsrJson(task, step, blob, options = {}) {
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs) || ASR_TIMEOUT_MS;
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${ASR_ENDPOINT}?taskId=${encodeURIComponent(task.id)}&step=${encodeURIComponent(step)}`, {
      method: "POST",
      headers: { "content-type": blob.type || "application/octet-stream" },
      body: blob,
      signal: controller.signal
    });
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }
    if (!response.ok) {
      throw new Error(payload?.message || payload?.error || `HTTP ${response.status}`);
    }
    return payload;
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("转文字超时，请检查网络后重试");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function applyVoiceTextForTask(task, response, step, text, options = {}) {
  text = cleanAsrTranscript(text);
  if (!text) return;
  if (task.type === "sentence") {
    const manualEditAt = Number(response.behavior.manualTranscriptEditAt?.[step] || 0);
    if (manualEditAt && manualEditAt > Number(options.transcriptionStartedAt || 0)) {
      response.behavior.ignoredAsrAfterManualEdit = response.behavior.ignoredAsrAfterManualEdit || [];
      response.behavior.ignoredAsrAfterManualEdit.push({
        step,
        text,
        manualEditAt,
        at: new Date().toISOString()
      });
      saveDraft();
      return;
    }
    response.answer.transcript = response.answer.transcript || {};
    response.answer.interimTranscript = response.answer.interimTranscript || {};
    response.answer.transcript[step] = text;
    response.answer.interimTranscript[step] = "";
    clearSpeechWarning(response, step);
  }
  if (task.type === "fluency") {
    response.answer.rawTranscript = fluencyTranscriptFromAsrText(text, response.answer.rawTranscript);
    response.answer.interimTranscript = "";
    response.answer.animals = extractAnimalNames(response.answer.rawTranscript);
  }
  response.behavior.liveTranscript = response.behavior.liveTranscript || {};
  response.behavior.liveTranscript[step] = {
    finalText: text,
    interimText: "",
    updatedAt: new Date().toISOString()
  };
  response.behavior.voiceEvents = response.behavior.voiceEvents || [];
  response.behavior.voiceEvents.push({ step, text, finalText: text, interimText: "", eventType: "cloudflare-asr", at: new Date().toISOString() });
  saveDraft();
}

function releaseMicStream() {
  if (!micStream) return;
  micStream.getTracks().forEach((track) => track.stop());
  micStream = null;
}

function voicePromptText() {
  return tasks[state.activeTaskIndex]?.type === "sentence" ? "请复述" : "请说";
}

function speechMicrophoneUnavailableText() {
  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    return "请用 HTTPS 页面打开麦克风";
  }
  if (state.permissions.microphone === "unsupported") return "当前浏览器不能录音";
  return "请允许麦克风权限";
}

async function primeMicrophonePermission(options = {}) {
  const { keepStream = true } = options;
  const hasLiveStream = micStream && micStream.getAudioTracks().some((track) => track.readyState === "live");
  if (micPermissionReady && (!keepStream || hasLiveStream)) return true;
  if (state.permissions.microphone === "denied") return false;
  if (!navigator.mediaDevices?.getUserMedia) {
    state.permissions.microphone = "unsupported";
    return false;
  }
  try {
    const stream = keepStream ? await getReusableMicStream() : await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!keepStream) stream.getTracks().forEach((track) => track.stop());
    micPermissionReady = true;
    state.permissions.microphone = "granted";
    saveDraft();
    return true;
  } catch {
    micPermissionReady = false;
    state.permissions.microphone = "denied";
    saveDraft();
    return false;
  }
}

function speechRecognitionErrorText(error) {
  if (error === "not-allowed" || error === "service-not-allowed") return "请允许麦克风和语音识别权限";
  if (error === "no-speech") return "未录到声音，请再说一次";
  if (error === "audio-capture") return "没有检测到麦克风";
  if (error === "network") return "浏览器语音识别服务不可用，请换 Chrome/Edge 或接入云端识别";
  return "识别未完成，请再试一次";
}

function recognitionTranscriptFromEvent(event) {
  let finalPart = "";
  let interimText = "";
  for (let i = 0; i < event.results.length; i += 1) {
    const result = event.results[i];
    const text = cleanAsrTranscript(result?.[0]?.transcript || "");
    if (result?.isFinal) finalPart = joinTranscriptText(finalPart, text);
    else interimText = joinTranscriptText(interimText, text);
  }
  return {
    finalText: joinTranscriptText(speechSessionBaseFinal, finalPart),
    interimText
  };
}

function joinTranscriptText(...parts) {
  return parts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ");
}

function cleanAsrTranscript(text) {
  const normalized = toSimplifiedChinese(String(text || ""))
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "";
  const cleaned = normalized
    .replace(/本\s*字幕\s*由[^。！？.!?]*?提供[。.!！]?/g, "")
    .replace(/字幕\s*由[^。！？.!?]*?(提供|制作)[。.!！]?/g, "")
    .replace(/字幕\s*(志愿者|校对|翻译|制作|制作者|后期|时间轴|听录|来源)?\s*[：:]?\s*[\u4e00-\u9fa5A-Za-z·]{2,10}(?=$|[\s。！？.!?])/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned || isAsrAdLike(cleaned)) return "";
  return cleaned;
}

function isAsrAdLike(text) {
  const compact = normalizeText(text);
  if (!compact) return false;
  const adPhrases = [
    "谢谢观看", "感谢观看", "请不吝点赞", "点赞订阅", "订阅转发", "打赏支持",
    "明镜与点点栏目", "字幕由", "字幕志愿者", "字幕校对", "字幕翻译", "字幕制作",
    "amara", "广告", "下集再见"
  ];
  return adPhrases.some((phrase) => compact.toLowerCase().includes(phrase.toLowerCase()));
}

function setSpeechWarning(response, step, message) {
  response.behavior.speechWarning = response.behavior.speechWarning || {};
  response.behavior.speechWarning[step] = message;
}

function clearSpeechWarning(response, step) {
  if (!response.behavior.speechWarning) return;
  delete response.behavior.speechWarning[step];
}

function beginLiveTranscriptSession({ resetFinal = false } = {}) {
  const task = tasks[state.activeTaskIndex];
  if (!["sentence", "fluency"].includes(task?.type)) return;
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  activeSpeechTaskId = task.id;
  activeSpeechStep = step;
  if (resetFinal) {
    if (response.behavior.manualTranscriptEditAt) delete response.behavior.manualTranscriptEditAt[step];
    setLiveVoiceText(task, response, step, { finalText: "", interimText: "", eventType: "reset" });
  }
  else setLiveVoiceText(task, response, step, { finalText: currentLiveFinalText(), interimText: "", eventType: "start" });
  speechSessionBaseFinal = currentLiveFinalText();
}

function currentLiveFinalText() {
  const { task, step } = activeVoiceContext();
  if (!["sentence", "fluency"].includes(task?.type)) return "";
  const response = getResponse(task.id);
  return getLiveTranscript(task, response, step).finalText || "";
}

function applyLiveVoiceText({ finalText = "", interimText = "" } = {}) {
  finalText = cleanAsrTranscript(finalText);
  interimText = cleanAsrTranscript(interimText);
  const { task, step } = activeVoiceContext();
  if (["sentence", "fluency"].includes(task?.type)) {
    const response = getResponse(task.id);
    setLiveVoiceText(task, response, step, { finalText, interimText, eventType: interimText ? "interim" : "final" });
    return;
  }
  applyVoiceText(joinTranscriptText(finalText, interimText));
}

function setLiveVoiceText(task, response, step, { finalText = "", interimText = "", eventType = "update" } = {}) {
  finalText = cleanAsrTranscript(finalText);
  interimText = cleanAsrTranscript(interimText);
  if (task.type === "sentence") {
    if (response.behavior.manualTranscriptEditAt?.[step] && eventType !== "reset" && eventType !== "start") {
      response.behavior.ignoredLiveTranscriptAfterManualEdit = response.behavior.ignoredLiveTranscriptAfterManualEdit || [];
      response.behavior.ignoredLiveTranscriptAfterManualEdit.push({
        step,
        finalText,
        interimText,
        eventType,
        at: new Date().toISOString()
      });
      saveDraft();
      return;
    }
    response.answer.transcript = response.answer.transcript || {};
    response.answer.interimTranscript = response.answer.interimTranscript || {};
    response.answer.transcript[step] = finalText;
    response.answer.interimTranscript[step] = interimText;
    if (finalText || interimText) clearSpeechWarning(response, step);
  }
  if (task.type === "fluency") {
    const transcript = joinTranscriptText(finalText, interimText);
    response.answer.rawTranscript = fluencyTranscriptFromAsrText(transcript, response.answer.rawTranscript);
    response.answer.interimTranscript = "";
    response.answer.animals = extractAnimalNames(response.answer.rawTranscript);
    refreshFluencyCountUi(response);
  }
  response.behavior.liveTranscript = response.behavior.liveTranscript || {};
  response.behavior.liveTranscript[step] = {
    finalText,
    interimText,
    updatedAt: new Date().toISOString()
  };
  response.behavior.voiceEvents = response.behavior.voiceEvents || [];
  response.behavior.voiceEvents.push({ step, text: joinTranscriptText(finalText, interimText), finalText, interimText, eventType, at: new Date().toISOString() });
  saveDraft();
}

function promoteLiveInterimTranscript() {
  const { task, step } = activeVoiceContext();
  if (!["sentence", "fluency"].includes(task?.type)) return;
  const response = getResponse(task.id);
  const live = getLiveTranscript(task, response, step);
  if (!live.interimText) return;
  const finalText = joinTranscriptText(live.finalText, live.interimText);
  setLiveVoiceText(task, response, step, { finalText, interimText: "", eventType: "promote" });
  speechSessionBaseFinal = finalText;
}

function activeVoiceContext() {
  const task = tasks.find((entry) => entry.id === activeSpeechTaskId) || tasks[state.activeTaskIndex];
  const step = activeSpeechTaskId ? activeSpeechStep : getTaskStep(task);
  return { task, step };
}

function recordSpeechRecognitionEvent(eventType, details = {}) {
  const { task, step } = activeVoiceContext();
  if (!task) return;
  const response = getResponse(task.id);
  response.behavior.speechRecognition = response.behavior.speechRecognition || [];
  response.behavior.speechRecognition.push({
    step,
    eventType,
    ...details,
    at: new Date().toISOString()
  });
  saveDraft();
}

function applyVoiceText(text) {
  text = cleanAsrTranscript(text);
  if (!text) return;
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (task.type === "memory") response.answer.freeText = text;
  if (task.type === "sentence") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.interimTranscript = response.answer.interimTranscript || {};
    response.answer.transcript[step] = text;
    response.answer.interimTranscript[step] = "";
  }
  if (task.type === "fluency") {
    response.answer.rawTranscript = fluencyTranscriptFromAsrText(text, response.answer.rawTranscript);
    response.answer.animals = extractAnimalNames(response.answer.rawTranscript);
    refreshFluencyCountUi(response);
  }
  if (task.type === "orientation") applyOrientationText(response, step, text);
  response.behavior.voiceEvents = response.behavior.voiceEvents || [];
  response.behavior.voiceEvents.push({ step, text, at: new Date().toISOString() });
  saveDraft();
}

function applyManualVoiceText(text) {
  text = toSimplifiedChinese(text);
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  const step = getTaskStep(task);
  if (task.type === "memory") response.answer.freeText = text;
  if (task.type === "sentence") {
    response.answer.transcript = response.answer.transcript || {};
    response.answer.interimTranscript = response.answer.interimTranscript || {};
    response.answer.transcript[step] = text;
    response.answer.interimTranscript[step] = "";
    response.behavior.manualTranscriptEditAt = response.behavior.manualTranscriptEditAt || {};
    response.behavior.manualTranscriptEditAt[step] = Date.now();
    response.behavior.liveTranscript = response.behavior.liveTranscript || {};
    response.behavior.liveTranscript[step] = {
      finalText: text,
      interimText: "",
      updatedAt: new Date().toISOString(),
      source: "manual"
    };
    speechSessionBaseFinal = text;
  }
  if (task.type === "orientation") applyOrientationText(response, step, text);
}

function applyOrientationText(response, step, text) {
  text = cleanAsrTranscript(text);
  if (!text) return;
  const prompt = orientationPrompts[step];
  response.answer.orientationTranscript = response.answer.orientationTranscript || {};
  response.answer.orientationTranscript[prompt.key] = text;
  if (prompt.key === "year") response.answer.year = firstNumber(text) || text;
  if (prompt.key === "date") {
    const nums = numbersInText(text);
    response.answer.month = nums[0] || text;
    response.answer.day = nums[1] || text;
  }
  if (prompt.key === "weekday") response.answer.weekday = text;
  if (prompt.key === "city") response.answer.city = text;
  if (prompt.key === "place") response.answer.place = text;
}

function applyOrientationChoice(key, value) {
  const response = getResponse("orientation");
  response.answer.orientationChoices = response.answer.orientationChoices || {};
  response.answer.orientationChoices[key] = value;
  if (key === "year") response.answer.year = value;
  if (key === "date") {
    const [month, day] = value.split("-");
    response.answer.month = month;
    response.answer.day = day;
  }
  if (key === "weekday") response.answer.weekday = value;
  if (key === "city") response.answer.city = value;
  if (key === "place") response.answer.place = value;
  saveDraft();
}

function abstractionOptions(response, item) {
  if (item.practice) return stableOptionValues(response, `abstraction:${item.key}`, item.answer, item.options.filter((option) => option !== item.answer));
  response.behavior.abstractionCorrectAnswers = response.behavior.abstractionCorrectAnswers || {};
  const savedCorrect = response.behavior.abstractionCorrectAnswers[item.key];
  const correctAnswers = Array.isArray(item.correctAnswers) ? item.correctAnswers : [item.answer].filter(Boolean);
  const correct = correctAnswers.includes(savedCorrect) ? savedCorrect : randomBankItem(correctAnswers);
  response.behavior.abstractionCorrectAnswers[item.key] = correct;
  const suffix = correct.slice(-2);
  const distractors = ABSTRACTION_DISTRACTORS_BY_SUFFIX[suffix] || [];
  return stableOptionValues(response, `abstraction:${item.key}:${correct}`, correct, distractors);
}

function orientationOptions(prompt) {
  const response = getResponse("orientation");
  const today = todayParts();
  if (prompt.key === "year") {
    const year = Number(today.year);
    const distractors = [year - 1, year + 1, year - 2, year + 2, year - 3, year + 3].map(String);
    return optionObjects(stableOptionValues(response, "orientation:year", today.year, distractors), today.year);
  }
  if (prompt.key === "date") {
    const correct = dateOptionValue(0);
    const distractors = [-1, 1, -2, 2, -7, 7, -14, 14].map((offset) => dateOptionValue(offset));
    return optionObjects(stableOptionValues(response, "orientation:date", correct, distractors), correct).map((option) => ({ ...option, label: dateOptionLabel(option.value) }));
  }
  if (prompt.key === "weekday") {
    const weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    return optionObjects(weekdays, today.weekday);
  }
  if (prompt.key === "city") {
    const expected = currentCityName();
    if (response.answer.expectedCity !== expected) {
      response.answer.expectedCity = expected;
      saveDraft();
    }
    return optionObjects(stableOptionValues(response, `orientation:city:${expected}`, expected, CITY_DISTRACTORS), expected);
  }
  const expectedPlace = currentPlaceName();
  if (!expectedPlace) {
    response.answer.expectedPlace = DEFAULT_PLACE;
    saveDraft();
    return optionObjects(stableOptionValues(response, `orientation:place:${DEFAULT_PLACE}`, DEFAULT_PLACE, PLACE_DISTRACTOR_POOL), DEFAULT_PLACE);
  }
  if (response.answer.expectedPlace !== expectedPlace) {
    response.answer.expectedPlace = expectedPlace;
    saveDraft();
  }
  const placeDistractors = [...PLACE_DISTRACTOR_POOL, ...DEFAULT_PLACE_OPTIONS].filter((value) => value !== expectedPlace);
  return optionObjects(stableOptionValues(response, `orientation:place:${expectedPlace}`, expectedPlace, placeDistractors), expectedPlace);
}

function currentCityName() {
  const response = getResponse("orientation");
  const location = response.behavior.location || {};
  return normalizeCityName(response.answer.expectedCity || location.city) || DEFAULT_CITY;
}

function currentPlaceName() {
  const response = getResponse("orientation");
  const location = response.behavior.location || {};
  return placeCategoryName(response.answer.expectedPlace || location.place || location.address) || DEFAULT_PLACE;
}

function placeNameFromReverse(data, loc) {
  const address = data.address || {};
  const raw = [
    data.name,
    data.namedetails?.name,
    data.type,
    data.category,
    address.amenity,
    address.building,
    address.shop,
    address.leisure,
    address.tourism,
    address.road,
    data.display_name,
    loc.address
  ].filter(Boolean).join(" ");
  return placeCategoryName(raw) || DEFAULT_PLACE;
}

async function sameCityPlaceDistractors(loc) {
  if (!loc?.city || !Number.isFinite(Number(loc.latitude)) || !Number.isFinite(Number(loc.longitude))) return [];
  const collected = [];
  for (const term of PLACE_SEARCH_TERMS) {
    if (collected.length >= 8) break;
    try {
      const query = encodeURIComponent(`${loc.city} ${term}`);
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=30&accept-language=zh-CN&q=${query}`;
      const entries = await fetch(url).then((entry) => entry.json());
      if (!Array.isArray(entries)) continue;
      entries.forEach((entry) => {
        const lat = Number(entry.lat);
        const lon = Number(entry.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
        const distanceKm = distanceKmBetween(loc.latitude, loc.longitude, lat, lon);
        if (distanceKm < MIN_PLACE_DISTRACTOR_KM) return;
        if (!isSameCityPlace(entry, loc.city)) return;
        const name = specificPlaceName(entry.name || firstLocationPart(entry.display_name), loc.city);
        if (!name || name === loc.place || collected.some((item) => item.name === name)) return;
        collected.push({ name, distanceKm: Number(distanceKm.toFixed(1)), latitude: lat, longitude: lon, source: "nominatim" });
      });
    } catch {
      // Keep trying other search terms.
    }
  }
  return shuffle(collected).slice(0, 6);
}

function isSameCityPlace(entry, city) {
  const address = entry.address || {};
  const text = [address.city, address.town, address.county, address.state, entry.display_name].filter(Boolean).join(" ");
  const clean = cleanCityName(city);
  return !clean || text.includes(clean) || clean.includes(cleanCityName(text));
}

function distanceKmBetween(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const toRad = (value) => Number(value) * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function firstLocationPart(address) {
  return String(address || "").split(/[，,]/).map((part) => part.trim()).filter(Boolean)[0] || "";
}

function specificPlaceName(value, city = "") {
  const raw = firstLocationPart(value).replace(/\s/g, "");
  if (!raw) return "";
  const cityText = cleanCityName(city).replace(/市$/, "");
  const compact = raw
    .replace(/^中国/, "")
    .replace(new RegExp(`^${escapeRegExp(cityText)}市?`), "")
    .replace(/^(江苏省|浙江省|广东省|四川省|湖北省|陕西省|山东省|福建省|北京市|上海市|天津市|重庆市)/, "");
  if (/医院|门诊|卫生院|卫生服务/.test(compact)) return shortNamedPlace(compact, "医院");
  if (/学校|大学|学院|中学|小学/.test(compact)) return shortNamedPlace(compact, "学校");
  if (/社区|街道|居委|服务中心/.test(compact)) return shortNamedPlace(compact, "社区中心");
  if (/公园|图书馆|体育中心|博物馆|文化馆/.test(compact)) return compact.slice(0, 14);
  if (compact.length >= 2 && compact.length <= 14 && !/^\d+$/.test(compact)) return compact;
  return "";
}

function cleanCityName(value) {
  const text = String(value || "");
  const cityMatch = text.match(/[^省市自治区县区,，\s]{2,12}市/);
  if (cityMatch) return cityMatch[0];
  const countyMatch = text.match(/[^省市自治区县区,，\s]{2,12}(县|区)/);
  if (countyMatch) return countyMatch[0];
  return text.split(/[，,\s]/).find(Boolean) || "";
}

function normalizeCityName(value) {
  const text = String(value || "").replace(/\s/g, "");
  if (!text) return "";
  const cityMatch = text.match(/[^省市自治区县区,，\s]{2,12}市/);
  if (cityMatch) return cityMatch[0];
  const municipality = text.match(/^(北京|上海|天津|重庆)$/)?.[1];
  if (municipality) return `${municipality}市`;
  return "";
}

function placeCategoryName(value) {
  const text = toSimplifiedChinese(String(value || ""));
  if (!text) return "";
  if (/医院|门诊|卫生院|卫生服务|诊所/.test(text)) return "医院";
  if (/学校|大学|学院|中学|小学|幼儿园/.test(text)) return "学校";
  if (/社区|街道|居委|党群服务|服务中心/.test(text)) return "社区中心";
  if (/公园|广场|绿地/.test(text)) return "公园";
  if (/商场|购物中心|商城|百货|商业中心/.test(text)) return "商场";
  if (/超市|便利店/.test(text)) return "超市";
  if (/图书馆|书城|书店/.test(text)) return "图书馆";
  if (/体育|运动中心|健身中心/.test(text)) return "体育中心";
  if (/博物馆|展览馆|美术馆|科技馆/.test(text)) return "博物馆";
  if (/车站|火车站|地铁站|公交站|客运站|机场/.test(text)) return "车站";
  if (/银行/.test(text)) return "银行";
  if (/药店|药房/.test(text)) return "药店";
  if (/菜市场|农贸市场|市场/.test(text)) return "菜市场";
  return "";
}

function generalizePlaceName(value) {
  const category = placeCategoryName(value);
  if (category) return category;
  const text = String(value || "");
  if (/医院|门诊|卫生院|卫生服务/.test(text)) return shortNamedPlace(text, "医院");
  if (/学校|大学|学院|中学|小学/.test(text)) return shortNamedPlace(text, "学校");
  if (/社区|街道|居委|服务中心/.test(text)) return shortNamedPlace(text, "社区中心");
  return specificPlaceName(text) || "";
}

function shortNamedPlace(text, fallbackSuffix) {
  const compact = String(text || "").replace(/\s/g, "");
  const pattern = fallbackSuffix === "医院" ? /医院|门诊|卫生院|卫生服务/ : fallbackSuffix === "学校" ? /学校|大学|学院|中学|小学/ : /社区|街道|居委|服务中心/;
  const match = compact.match(pattern);
  if (!match) return fallbackSuffix;
  const start = Math.max(0, match.index - 6);
  const end = Math.min(compact.length, match.index + match[0].length);
  const name = compact.slice(start, end);
  if (name.length >= 2) return name.replace(/卫生服务$/, "社区中心").replace(/服务中心$/, "社区中心");
  return fallbackSuffix;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function optionObjects(values, correct) {
  const unique = [...new Set(values.filter(Boolean))];
  return unique.map((value) => ({ value, label: value, correct: value === correct }));
}

function stableOptionValues(response, key, correct, distractors, count = 4) {
  response.behavior.optionOrders = response.behavior.optionOrders || {};
  const saved = response.behavior.optionOrders[key];
  if (Array.isArray(saved) && saved.includes(correct) && saved.length >= count) return saved;
  const uniqueDistractors = [...new Set(distractors.filter((value) => value && value !== correct))];
  const selected = shuffle(uniqueDistractors).slice(0, Math.max(0, count - 1));
  const values = shuffle([correct, ...selected]).slice(0, count);
  response.behavior.optionOrders[key] = values;
  saveDraft();
  return values;
}

function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function dateOptionValue(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getMonth() + 1}-${date.getDate()}`;
}

function dateOptionLabel(value) {
  const [month, day] = value.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function toggleMemoryWord(word) {
  const response = getResponse(tasks[state.activeTaskIndex].id);
  response.answer.selectedWords = response.answer.selectedWords || [];
  delete response.behavior.selectionWarning;
  delete response.behavior.memoryReviewPromptVisible;
  delete response.behavior.memoryIncorrectSubmitConfirmed;
  if (response.answer.selectedWords.includes(word)) {
    response.answer.selectedWords = response.answer.selectedWords.filter((entry) => entry !== word);
  } else if (response.answer.selectedWords.length < MEMORY_TARGET_COUNT) {
    response.answer.selectedWords.push(word);
  } else {
    response.behavior.selectionWarning = "最多选择 5 个词";
  }
  saveDraft();
  render();
}

function firstNumber(text) {
  return numbersInText(text)[0] || "";
}

function numbersInText(text) {
  return String(text || "").match(/\d+/g) || [];
}

async function appendDigit(digit) {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  response.answer.sequence = response.answer.sequence || [];
  if (response.answer.sequence.length < activeDigitItem(task).answer.length) response.answer.sequence.push(digit);
  saveDraft();
  refreshDigitChoiceUi(task, response);
  refreshTaskActionButtons();
}

function backspaceDigit() {
  const task = tasks[state.activeTaskIndex];
  const response = getResponse(task.id);
  response.answer.sequence = response.answer.sequence || [];
  response.answer.sequence.pop();
  saveDraft();
  refreshDigitChoiceUi(task, response);
  refreshTaskActionButtons();
}

function refreshDigitChoiceUi(task, response = getResponse(task.id)) {
  if (!task || task.type !== "choice") return;
  const sequence = response.answer.sequence || [];
  const row = document.querySelector(".digit-answer-squares");
  if (!row) return;
  Array.from(row.children).forEach((entry, index) => {
    const value = sequence[index] || " ";
    entry.textContent = value;
    entry.classList.toggle("empty", !sequence[index]);
  });
  document.querySelectorAll(".digit-keypad button[data-action='appendDigit']").forEach((button) => {
    button.disabled = false;
  });
}

function inputSerialDigit(digit) {
  const response = getResponse("serial7");
  const step = getTaskStep(tasks[state.activeTaskIndex]);
  const timing = ensureSerialStepTiming(response, step);
  if (!timing.firstInputAt) timing.firstInputAt = new Date().toISOString();
  response.answer.values = response.answer.values || ["", "", "", "", ""];
  response.answer.values[step] = `${response.answer.values[step] || ""}${digit}`;
  render();
}

function backspaceSerial() {
  const response = getResponse("serial7");
  const step = getTaskStep(tasks[state.activeTaskIndex]);
  ensureSerialStepTiming(response, step);
  response.answer.values = response.answer.values || ["", "", "", "", ""];
  response.answer.values[step] = response.answer.values[step].slice(0, -1);
  render();
}

function inputOrientationDigit(field, digit) {
  const response = getResponse("orientation");
  const key = field === "day" ? "day" : field === "month" ? "month" : "year";
  const maxLength = key === "year" ? 4 : 2;
  response.answer[key] = String(response.answer[key] || "");
  if (response.answer[key].length >= maxLength) return;
  const previousLength = response.answer[key].length;
  response.answer[key] = `${response.answer[key]}${digit}`;
  if (key === "month") {
    const singleDigitMonth = previousLength === 0 && /^[2-9]$/.test(String(digit));
    if (singleDigitMonth || response.answer.month.length >= 2) response.answer.orientationDateActiveField = "day";
  }
  saveDraft();
  render();
}

function backspaceOrientation(field) {
  const response = getResponse("orientation");
  const key = field === "day" ? "day" : field === "month" ? "month" : "year";
  response.answer[key] = String(response.answer[key] || "").slice(0, -1);
  saveDraft();
  render();
}

function setOrientationDateField(field) {
  const response = getResponse("orientation");
  response.answer.orientationDateActiveField = field === "day" ? "day" : "month";
  saveDraft();
  render();
}

function ensureSerialStepTiming(response, step) {
  response.behavior.serialStepTimings = response.behavior.serialStepTimings || [];
  const timings = response.behavior.serialStepTimings;
  if (!timings[step]) {
    timings[step] = {
      step: step + 1,
      startedAt: new Date().toISOString(),
      startedAtMs: Date.now()
    };
  }
  return timings[step];
}

function finishSerialStepTiming(response, step) {
  const timing = response.behavior.serialStepTimings?.[step];
  if (!timing) return null;
  const now = Date.now();
  timing.endedAt = new Date().toISOString();
  const startedAtMs = Number(timing.startedAtMs);
  timing.durationMs = Number.isFinite(startedAtMs) ? Math.max(0, now - startedAtMs) : null;
  return timing;
}

function startVigilance() {
  const response = getResponse("vigilance");
  window.clearTimeout(vigilanceAutoAdvanceTimer);
  vigilanceAutoAdvanceTimer = null;
  response.answer.taps = [];
  response.answer.startedAt = Date.now();
  response.answer.running = true;
  response.behavior.vigilanceDigits = [];
  window.clearInterval(vigilanceTimer);
  speakItemsSlow(VIGILANCE_DIGITS, {
    audioKeyPrefix: "stimulus:vigilance:digit",
    gapMs: 1000,
    rate: 0.66,
    staticOnly: true,
    onItemStart: (digit, index) => response.behavior.vigilanceDigits.push({ digit, index, at: Date.now() }),
    done: () => {
      window.clearInterval(vigilanceTimer);
      response.answer.running = false;
      response.answer.completedAt = Date.now();
      response.behavior.autoAdvanceDelayMs = 2000;
      render();
      vigilanceAutoAdvanceTimer = window.setTimeout(() => {
        vigilanceAutoAdvanceTimer = null;
        autoAdvanceVigilance();
      }, 2000);
    }
  });
  render();
}

async function autoAdvanceVigilance() {
  const task = tasks[state.activeTaskIndex];
  if (state.view !== "test" || task?.id !== "vigilance") return;
  await submitActiveTask();
  const nextIndex = nextTaskIndexAfterSubmit(task);
  if (nextIndex < 0) {
    await finishSessionAndShowResults();
    return;
  } else {
    state.activeTaskIndex = nextIndex;
    requestImmediateInstructionPlayback(tasks[nextIndex]);
  }
  render();
}

function tapVigilance(at = Date.now()) {
  const response = getResponse("vigilance");
  if (!response.answer.startedAt) return;
  playSfx("pick");
  response.answer.taps = response.answer.taps || [];
  response.answer.taps.push(at);
  render();
}

async function startFluency() {
  const response = getResponse("fluency");
  if (response.answer.running || response.answer.completedAt) return;
  response.answer.remaining = 60;
  response.answer.running = true;
  response.answer.timerStartedAt = Date.now();
  delete response.answer.completedAt;
  delete response.answer.completedReason;
  delete response.answer.transcriptionStatus;
  delete response.answer.transcriptionMessage;
  delete response.behavior.selectionWarning;
  render();
  const voiceStarted = await startVoiceInput();
  if (!voiceStarted) {
    response.answer.running = false;
    window.clearInterval(fluencyTimer);
    saveDraft();
    render();
    return;
  }
  window.clearInterval(fluencyTimer);
  fluencyTimer = window.setInterval(() => {
    response.answer.remaining -= 1;
    if (response.answer.remaining <= 0) {
      response.answer.remaining = 0;
      completeFluency("timeout");
      return;
    }
    render();
  }, 1000);
  render();
}

function stopFluency() {
  const response = getResponse("fluency");
  if (!response.answer.running && response.answer.completedAt) return;
  completeFluency("manual");
}

function completeFluency(reason) {
  const response = getResponse("fluency");
  response.answer.running = false;
  response.answer.completedAt = Date.now();
  response.answer.completedReason = reason;
  response.behavior.autoAdvanceRequestedAt = response.behavior.autoAdvanceRequestedAt || new Date().toISOString();
  if (recordingAudio || pcmRecorder || mediaRecorder) {
    response.answer.transcriptionStatus = "uploading";
    response.answer.transcriptionMessage = "正在上传录音并计数...";
  }
  window.clearInterval(fluencyTimer);
  stopVoiceInput();
  saveDraft();
  render();
  if (!recordingAudio && !pcmRecorder && !mediaRecorder && !speechTranscribing) {
    void autoAdvanceFluencyAfterTranscription();
  }
}

async function autoAdvanceFluencyAfterTranscription() {
  const task = tasks.find((entry) => entry.id === "fluency");
  if (!task || fluencyAutoAdvanceInProgress) return false;
  const response = getResponse("fluency");
  if (!response.answer.completedAt || response.submitted) return false;
  if (state.view !== "test" || tasks[state.activeTaskIndex]?.id !== "fluency") {
    saveDraft();
    return false;
  }
  fluencyAutoAdvanceInProgress = true;
  response.behavior.autoAdvanceStartedAt = new Date().toISOString();
  try {
    const submitted = await submitActiveTaskWithFeedback(task);
    if (!submitted) {
      render();
      return false;
    }
    response.behavior.autoAdvanceCompletedAt = new Date().toISOString();
    const nextIndex = nextTaskIndexAfterSubmit(task);
    if (nextIndex < 0) {
      await finishSessionAndShowResults();
      return true;
    }
    state.activeTaskIndex = nextIndex;
    requestImmediateInstructionPlayback(tasks[nextIndex]);
    saveDraft();
    render();
    return true;
  } finally {
    fluencyAutoAdvanceInProgress = false;
  }
}

function memoryWaitRemaining() {
  if (!state.memoryWaitStartedAt) return 0;
  return Math.max(0, state.memoryWaitStartedAt + MEMORY_WAIT_MS - Date.now());
}

function prepareLocationAnswer() {
  const response = getResponse("orientation");
  const location = response.behavior.location;
  if (location?.error) return;
  if (location && !location.error) {
    if (!location.city && !location.place) void reverseGeocodeLocation(response).then(() => {
      saveDraft();
      render();
    });
    return;
  }
  primeLocationPermission({ rerender: true });
}

async function primeLocationPermission(options = {}) {
  const { rerender = false, resolveAddress = true, timeout = 10000 } = options;
  const response = getResponse("orientation");
  if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(location.hostname)) {
    state.permissions.location = "unsupported";
    response.behavior.location = { error: "定位需要 HTTPS 页面", at: new Date().toISOString() };
    response.answer.expectedCity = response.answer.expectedCity || DEFAULT_CITY;
    response.answer.expectedPlace = response.answer.expectedPlace || DEFAULT_PLACE;
    saveDraft();
    if (rerender) render();
    return false;
  }
  if (!navigator.geolocation) {
    state.permissions.location = "unsupported";
    response.behavior.location = { error: "当前设备不支持定位", at: new Date().toISOString() };
    response.answer.expectedCity = response.answer.expectedCity || DEFAULT_CITY;
    response.answer.expectedPlace = response.answer.expectedPlace || DEFAULT_PLACE;
    saveDraft();
    if (rerender) render();
    return false;
  }
  try {
    state.permissions.location = "prompting";
    response.behavior.location = { status: "requesting", at: new Date().toISOString() };
    saveDraft();
    const position = await getCurrentPosition({ enableHighAccuracy: true, timeout, maximumAge: 60000 });
    state.permissions.location = "granted";
    response.behavior.location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      at: new Date().toISOString()
    };
    if (resolveAddress) await reverseGeocodeLocation(response);
    saveDraft();
    if (rerender) render();
    return true;
  } catch (error) {
    const locationError = geolocationErrorDetail(error);
    state.permissions.location = locationError.permission;
    response.behavior.location = {
      error: locationError.message,
      errorCode: error?.code || null,
      errorName: error?.name || "",
      errorMessage: error?.message || "",
      at: new Date().toISOString()
    };
    response.answer.expectedCity = response.answer.expectedCity || DEFAULT_CITY;
    response.answer.expectedPlace = response.answer.expectedPlace || DEFAULT_PLACE;
    saveDraft();
    if (rerender) render();
    return false;
  }
}

function geolocationErrorDetail(error) {
  if (error?.code === 1) return { permission: "denied", message: "定位权限被拒绝" };
  if (error?.code === 2) return { permission: "unavailable", message: "定位暂不可用" };
  if (error?.code === 3) return { permission: "timeout", message: "定位超时" };
  return { permission: "unavailable", message: "定位未授权或不可用" };
}

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function reverseGeocodeLocation(response) {
  const loc = response.behavior.location;
  if (!loc || loc.error) return;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&namedetails=1&zoom=18&lat=${loc.latitude}&lon=${loc.longitude}&accept-language=zh-CN`;
    const data = await fetch(url).then((entry) => entry.json());
    const address = data.address || {};
    loc.address = data.display_name || "";
    loc.city = normalizeCityName(address.city || address.municipality || address.state || address.town || loc.address || "") || DEFAULT_CITY;
    loc.place = placeNameFromReverse(data, loc);
    loc.placeDistractors = PLACE_DISTRACTOR_POOL.filter((value) => value !== loc.place).map((name) => ({ name, source: "common-scene" }));
    Object.keys(response.behavior.optionOrders || {}).forEach((key) => {
      if (key.startsWith("orientation:city") || key.startsWith("orientation:place")) delete response.behavior.optionOrders[key];
    });
    getResponse("orientation").answer.expectedCity = loc.city || DEFAULT_CITY;
    getResponse("orientation").answer.expectedPlace = loc.place || DEFAULT_PLACE;
  } catch {
    // Coordinates are still kept for backend review.
  }
}

function locationStatus() {
  const location = getResponse("orientation").behavior.location;
  if (!location) return "定位未获取";
  if (location.error) return location.error;
  if (location.city || location.place) return "定位完成";
  return "已记录定位信息";
}

async function requestJson(path, options, fallback) {
  try {
    const response = await fetch(path, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    return fallback(error);
  }
}

function readLocalSessions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalSessions(sessions) {
  localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
}

function localSaveSession(payload) {
  const sessions = readLocalSessions();
  const saved = { ...payload, id: payload.id || crypto.randomUUID(), savedAt: new Date().toISOString(), storageMode: "browser-local" };
  const index = sessions.findIndex((entry) => entry.id === saved.id);
  if (index >= 0) sessions[index] = saved;
  else sessions.unshift(saved);
  writeLocalSessions(sessions);
  return saved;
}

function localListSessions() {
  return readLocalSessions().map((session) => ({
    id: session.id,
    participant: session.participant,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    savedAt: session.savedAt,
    totalDurationMs: session.totalDurationMs,
    rawScore: session.rawScore,
    educationBonus: session.educationBonus,
    totalScore: session.totalScore,
    riskBand: session.riskBand,
    itemCount: session.itemResponses?.length || 0,
    storageMode: session.storageMode || "browser-local"
  }));
}

function localAiScore(payload) {
  const maxScore = Number.isFinite(Number(payload.maxScore)) ? Number(payload.maxScore) : 0;
  let scoreSuggestion = typeof payload.clientAutoScore === "number" ? payload.clientAutoScore : null;
  const needsConfiguredAi = ["cube", "clock"].includes(payload.taskId) && payload.image && scoreSuggestion === null;
  if (scoreSuggestion === null) scoreSuggestion = 0;
  scoreSuggestion = Math.max(0, Math.min(maxScore, Math.round(scoreSuggestion)));
  return {
    mode: "browser-local-demo",
    taskId: payload.taskId,
    scoreSuggestion,
    confidence: needsConfiguredAi ? 0 : payload.image ? 0.68 : 0.82,
    requiresHumanReview: false,
    aiImageScoringConfigured: !needsConfiguredAi,
    rubricMatched: !needsConfiguredAi,
    comment: needsConfiguredAi ? "画图题已关闭人工勾选；本地演示环境未配置 OPENAI_API_KEY，无法完成图片 AI 评分。" : "本地演示评分已返回结果。"
  };
}

async function scoreTaskWithAi(task) {
  const response = getResponse(task.id);
  const image = task.type === "drawing" || task.type === "trail" ? currentDrawingImage(task.id) : null;
  const payload = {
    taskId: task.id,
    taskType: task.type,
    image,
    answer: response.answer,
    rubric: task.scoring,
    rubricDetails: drawingAiRubric(task),
    maxScore: task.maxScore,
    clientAutoScore: clientAutoScoreForAi(task, response)
  };
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), AI_SCORE_TIMEOUT_MS);
  let result;
  try {
    result = await requestJson("/api/ai-score", {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }, () => localAiScore(payload));
  } finally {
    window.clearTimeout(timeout);
  }
  if (image) response.drawingImage = image;
  return result;
}

function needsAiScore(task) {
  return ["trail", "drawing", "fluency"].includes(task.type);
}

function isAsyncDrawingAiTask(task) {
  return task?.type === "drawing" && ["cube", "clock"].includes(task.id);
}

function needsBlockingAiScore(task) {
  return needsAiScore(task) && !isAsyncDrawingAiTask(task);
}

function markDrawingAiPending(task, response = getResponse(task.id)) {
  response.ai = {
    mode: "async-pending",
    status: "pending",
    taskId: task.id,
    scoreSuggestion: null,
    confidence: 0,
    requiresHumanReview: false,
    aiImageScoringConfigured: true,
    rubricMatched: false,
    comment: "",
    criteria: [],
    queuedAt: new Date().toISOString()
  };
  response.behavior.aiScoreStatus = "pending";
}

function scheduleDrawingAiScore(task) {
  if (!isAsyncDrawingAiTask(task)) return;
  const sessionId = state.sessionId;
  const jobKey = `${sessionId}:${task.id}`;
  if (pendingAiScoreTaskIds.has(jobKey)) return;
  pendingAiScoreTaskIds.add(jobKey);
  runDrawingAiScore(task.id, sessionId, jobKey);
}

async function runDrawingAiScore(taskId, sessionId, jobKey) {
  const task = tasks.find((entry) => entry.id === taskId);
  if (!task) return;
  const response = getResponse(taskId);
  try {
    const result = await scoreTaskWithAi(task);
    if (state.sessionId !== sessionId) return;
    response.ai = {
      ...result,
      status: "completed",
      completedAt: new Date().toISOString()
    };
    response.behavior.aiScoreStatus = "completed";
    delete response.behavior.aiScoreError;
    response.score = computeTaskScore(task, response);
  } catch (error) {
    if (state.sessionId !== sessionId) return;
    response.ai = {
      mode: "async-error",
      status: "error",
      taskId,
      scoreSuggestion: null,
      confidence: 0,
      requiresHumanReview: false,
      aiImageScoringConfigured: false,
      rubricMatched: false,
      comment: "",
      criteria: [],
      error: error?.message || String(error || "AI评分失败"),
      completedAt: new Date().toISOString()
    };
    response.behavior.aiScoreStatus = "error";
    response.behavior.aiScoreError = response.ai.error;
  } finally {
    pendingAiScoreTaskIds.delete(jobKey);
    if (state.sessionId !== sessionId) return;
    saveDraft();
    if (state.sessionSaveStatus === "saved" || state.view === "results" || state.view === "admin") scheduleBackgroundSessionSave();
    render();
  }
}

function clientAutoScoreForAi(task, response) {
  if (task.type === "trail") return scoreTrail().score;
  if (task.id === "cube" || task.id === "clock") return null;
  if (task.type === "fluency") return fluencyAnimalCount(response) >= 11 ? 1 : 0;
  if (task.type === "orientation") return scoreOrientationByInputs(response);
  return null;
}

function drawingAiRubric(task) {
  if (!task || task.type !== "drawing") return null;
  return {
    scoringMode: "ai_image_only",
    taskTitle: task.title,
    drawingKind: task.drawingKind,
    maxScore: task.maxScore,
    instruction: "请只根据用户画布图片评分，按照 MoCA 中文量表分项给出 scoreSuggestion；评分时要考虑老年人手绘误差，不要因为线条抖动、轻微歪斜、椭圆形表盘、数字大小不一或间距不均而扣分。但钟表指针项必须看到两根明确指针/线段才可给分，不得凭猜测补出不存在的指针。",
    outputContract: {
      scoreSuggestion: "整数，范围 0 到 maxScore",
      comment: "只写未得分项目；满分时留空字符串。例如：未得分：指针（未看到两根明确指针）。",
      criteria: "必须逐项给 true/false，并说明图片中能直接观察到的证据",
      confidence: "0 到 1",
      rubricMatched: "所有给分条件都来自本 rubric 时为 true"
    },
    scoreRules: task.drawingKind === "cube"
      ? [
        "立方体总分只有 0 或 1 分。",
        "只要能辨认为三维盒状/立方体结构、主要边线基本存在、没有明显无关多余线条、相对边大致平行且长度接近，就给 1 分。",
        "允许手绘线条抖动、重描、轻微断开、角度不完美或长度小偏差。",
        "画成平面图形、结构无法辨认为立方体、主要边线明显缺失或出现明显无关多余线，给 0 分。"
      ]
      : [
        "钟表总分 0-3 分，每项 1 分。",
        "轮廓：圆、椭圆或近似圆都给 1 分；允许手抖、轻微开口、变形或不居中。明显不像表盘轮廓才 0 分。",
        "数字：1-12 基本写全且可辨认，总体按顺时针顺序分布在表盘内或附近，就给 1 分；允许歪斜、大小不一、间距不均、轻微偏离象限或个别数字写得潦草。缺多个数字、严重乱序、重复/多余数字导致无法辨认为 1-12 时给 0 分。",
        "指针：必须看得到两根明确的指针/线段，且大致表示 11 点 10 分，才给 1 分；允许角度小偏差，但应能看出分针指向 2 附近、时针在 11 附近且时针较短。",
        "如果没有指针、只有一根指针、只有数字/表盘，或看不出任何表示时间的线段，指针项必须 0 分；不能因为题目要求 11 点 10 分就推测用户画了指针。",
        "每个分项只按图片证据给分；不要因正常手绘误差扣分。"
      ],
    criteria: DRAWING_AI_RUBRICS[task.drawingKind] || []
  };
}

function computeTaskScore(task, response = getResponse(task.id)) {
  const aiScore = aiScoreValue(task, response);
  if (task.type === "trail") return scoreTrail().score;
  if (task.id === "cube" || task.id === "clock") return aiScore ?? 0;
  if (task.type === "naming") return task.items.reduce((sum, item) => sum + (response.answer?.[item.key] === item.answer ? 1 : 0), 0);
  if (task.type === "memory") return task.trial === 2 ? scoreMemoryChoices(response) : 0;
  if (task.type === "choice") return (response.answer?.sequence || []).join("") === activeDigitItem(task).answer ? 1 : 0;
  if (task.type === "vigilance") return scoreVigilance(response);
  if (task.type === "serial7") return scoreSerial7(response).score;
  if (task.type === "sentence") return scoreSentenceTranscript(task, response);
  if (task.type === "fluency") return aiScore ?? (fluencyAnimalCount(response) >= 11 ? 1 : 0);
  if (task.type === "abstractionChoice") return scoreAbstractionChoice(task, response);
  if (task.type === "orientation") return aiScore ?? scoreOrientationByInputs(response);
  return 0;
}

function aiScoreValue(task, response) {
  const value = response.ai?.scoreSuggestion;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(task.maxScore, Math.round(value)));
}

function scoreTrail() {
  const sequence = state.trail.sequence || summarizeTrailEdges(trailEdgesForDrawing()).sequence;
  return { score: trailContainsExpectedSequence(sequence) ? 1 : 0 };
}

function trailHasCrossing() {
  const edges = trailEdgesForDrawing();
  if (edges.length < 3) return false;
  const canvas = activeCanvas || document.querySelector("#taskCanvas");
  if (!canvas) return false;
  const nodes = trailNodes(canvas);
  const nodeMap = new Map(nodes.map((node) => [node.label, node]));
  const segments = edges
    .map((edge) => [nodeMap.get(edge.from), nodeMap.get(edge.to)])
    .filter(([from, to]) => from && to);
  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      const sharedEndpoint = [segments[i][0].label, segments[i][1].label].some((label) => [segments[j][0].label, segments[j][1].label].includes(label));
      if (!sharedEndpoint && segmentsIntersect(segments[i][0], segments[i][1], segments[j][0], segments[j][1])) return true;
    }
  }
  return false;
}

function segmentsIntersect(a, b, c, d) {
  const det = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return det(a, b, c) * det(a, b, d) < 0 && det(c, d, a) * det(c, d, b) < 0;
}

function scoreVigilance(response) {
  const taps = response.answer?.taps || [];
  const startedAt = response.answer?.startedAt || 0;
  if (!startedAt) return 0;
  const schedule = response.behavior?.vigilanceDigits?.length ? response.behavior.vigilanceDigits : VIGILANCE_DIGITS.map((digit, index) => ({ digit, at: startedAt + index * 1000 }));
  const expectedWindows = schedule.map((entry) => ({ digit: entry.digit, start: entry.at, end: entry.at + 1100 })).filter((entry) => entry.digit === "1");
  const misses = expectedWindows.filter((window) => !taps.some((tap) => tap >= window.start && tap <= window.end)).length;
  const falseTaps = taps.filter((tap) => !expectedWindows.some((window) => tap >= window.start && tap <= window.end)).length;
  const errors = misses + falseTaps;
  response.behavior.vigilance = { misses, falseTaps, errors };
  return errors >= 2 ? 0 : 1;
}

function scoreSerial7(response) {
  const subtractBy = serialSubtractionNumber();
  const values = (response.answer?.values || []).map((value) => {
    const text = String(value ?? "").trim();
    return text ? Number(text) : null;
  });
  const timings = response.behavior.serialStepTimings || [];
  let correct = 0;
  const steps = [];
  values.forEach((value, index) => {
    const previous = index === 0 ? 100 : values[index - 1];
    const expected = Number.isFinite(previous) ? previous - subtractBy : null;
    const isCorrect = Number.isFinite(value) && expected !== null && value === expected;
    const timing = timings[index] || {};
    if (isCorrect) correct += 1;
    steps.push({
      step: index + 1,
      previous,
      subtractBy,
      answer: Number.isFinite(value) ? value : null,
      expected,
      correct: isCorrect,
      startedAt: timing.startedAt || null,
      firstInputAt: timing.firstInputAt || null,
      endedAt: timing.endedAt || null,
      durationMs: Number.isFinite(Number(timing.durationMs)) ? Number(timing.durationMs) : null
    });
  });
  response.behavior.serialSubtractionNumber = subtractBy;
  response.behavior.serialSubtractionSteps = steps;
  response.behavior.serialSubtractionCorrectSteps = correct;
  const score = correct >= 4 ? 3 : correct >= 2 ? 2 : correct === 1 ? 1 : 0;
  response.behavior.serialSubtractionScore = score;
  return { correct, score };
}

function scoreSentenceTranscript(task, response) {
  const transcript = response.answer?.transcript || {};
  let score = 0;
  const details = task.sentences.map((sentence, index) => {
    const expected = sentenceMoCaNormalize(sentence);
    const answer = sentenceMoCaNormalize(transcript[index]);
    const correct = Boolean(answer) && answer === expected;
    if (correct) score += 1;
    return {
      step: index,
      expected: sentence,
      transcript: cleanAsrTranscript(transcript[index] || ""),
      expectedNormalized: expected,
      transcriptNormalized: answer,
      correct,
      rule: "MoCA 句子复述：每句话完全准确复述给 1 分；省略、替换、增加或语序变化均为 0 分。"
    };
  });
  response.behavior.sentenceScoring = {
    score,
    maxScore: task.sentences.length,
    details,
    scoredAt: new Date().toISOString()
  };
  return score;
}

function sentenceMoCaNormalize(text) {
  return toSimplifiedChinese(text)
    .replace(/[“”"'‘’`´＂＇]/g, "")
    .replace(/[，,、；;：:。.!！?？（）()\[\]【】{}《》〈〉…·—\-_/\\\s]/g, "")
    .trim();
}

function scoreAbstractionChoice(task, response) {
  return task.items.reduce((sum, item) => {
    if (item.practice) return sum;
    const correct = response.behavior?.abstractionCorrectAnswers?.[item.key]
      || (Array.isArray(item.correctAnswers) ? item.correctAnswers[0] : item.answer);
    return sum + (response.answer?.[item.key] === correct ? 1 : 0);
  }, 0);
}

function scoreMemoryChoices(response) {
  const selected = response.answer?.selectedWords || [];
  const targets = memoryTargetWords();
  response.behavior.memoryCandidateWords = [...memoryCandidateWords("memory1")];
  response.behavior.memoryRecallCandidateWords = [...memoryCandidateWords("memory2")];
  response.behavior.memoryTargetWords = [...targets];
  return selected.reduce((sum, word) => sum + (targets.includes(word) ? 1 : 0), 0);
}

function scoreOrientationByInputs(response) {
  const answer = response.answer || {};
  const today = todayParts();
  let score = 0;
  if (normalizeText(answer.weekday) === normalizeText(today.weekday)) score += 1;
  if (String(Number(answer.month)) === today.month) score += 1;
  if (String(Number(answer.year)) === today.year) score += 1;
  if (String(Number(answer.day)) === today.day) score += 1;
  const expectedCity = normalizeText(answer.expectedCity || "");
  const expectedPlace = normalizeText(answer.expectedPlace || "");
  const city = normalizeText(answer.city);
  const place = normalizeText(answer.place);
  if (city && (expectedCity ? city.includes(expectedCity) || expectedCity.includes(city) : true)) score += 1;
  if (place && (expectedPlace ? place.includes(expectedPlace) || expectedPlace.includes(place) : true)) score += 1;
  return score;
}

function todayParts() {
  const now = new Date();
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return { year: String(now.getFullYear()), month: String(now.getMonth() + 1), day: String(now.getDate()), weekday: weekdays[now.getDay()] };
}

function normalizeText(text) {
  return toSimplifiedChinese(text).replace(/\s/g, "").replace(/市$/, "");
}

function uniqueWords(words) {
  return [...new Set((words || []).map((word) => normalizeText(word)).filter(Boolean))];
}

function fluencyAnimalNamesFromResponse(response, live = {}) {
  const text = joinTranscriptText(
    response.answer?.rawTranscript,
    response.answer?.interimTranscript,
    live.finalText,
    live.interimText
  );
  const animals = extractAnimalNames(text);
  response.answer.animals = animals;
  return animals;
}

function fluencyAnimalCount(response) {
  const animals = extractAnimalNames(joinTranscriptText(response.answer?.rawTranscript, response.answer?.interimTranscript));
  response.answer.animals = animals;
  return animals.length;
}

function refreshFluencyCountUi(response) {
  if (tasks[state.activeTaskIndex]?.id !== "fluency") return;
  const animals = fluencyAnimalNamesFromResponse(response);
  const status = document.querySelector(".fluency-count-status");
  if (status) status.textContent = fluencyStatusText(response, animals);
  const list = document.querySelector(".animal-count-list");
  if (list) list.innerHTML = renderAnimalCountChips(animals);
}

function extractAnimalNames(text) {
  return uniqueWords(animalMatchesFromText(text).map((match) => match.canonical));
}

function fluencyTranscriptFromAsrText(text, existingText = "") {
  const existing = normalizeFluencyTranscript(existingText);
  const incoming = normalizeFluencyTranscript(text);
  if (!incoming) return existing;
  if (!existing) return incoming;
  const existingKey = fluencyTranscriptKey(existing);
  const incomingKey = fluencyTranscriptKey(incoming);
  if (!incomingKey) return existing;
  if (!existingKey) return incoming;
  if (existingKey.includes(incomingKey)) return existing;
  if (incomingKey.includes(existingKey)) return incoming;
  return `${existing} ${incoming}`;
}

function normalizeFluencyTranscript(text) {
  return toSimplifiedChinese(text)
    .replace(/[，,、；;。.!！?？\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fluencyTranscriptKey(text) {
  return normalizeFluencyTranscript(text).replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "");
}

function animalMatchesFromText(text) {
  const normalized = normalizeAnimalTranscriptForMatching(text);
  const aliases = animalAliasEntries();
  const matches = [];
  aliases.forEach(({ alias, canonical }) => {
    let index = normalized.indexOf(alias);
    while (index >= 0) {
      const end = index + alias.length;
      const overlaps = matches.some((match) => index < match.end && end > match.start);
      if (!overlaps) matches.push({ start: index, end, canonical });
      index = normalized.indexOf(alias, index + 1);
    }
  });
  return matches.sort((a, b) => a.start - b.start);
}

function normalizeAnimalTranscriptForMatching(text) {
  let normalized = normalizeText(text);
  fluencyAsrAnimalCorrections.forEach(([from, to]) => {
    normalized = normalized.split(normalizeText(from)).join(normalizeText(to));
  });
  fluencyFillerPhrases.forEach((phrase) => {
    normalized = normalized.split(normalizeText(phrase)).join("");
  });
  return normalized;
}

function animalAliasEntries() {
  const entries = [
    ...animalNameBank.map((name) => [name, canonicalAnimalName(name)]),
    ...animalAliasPairs
  ];
  const seen = new Set();
  return entries
    .map(([alias, canonical]) => ({ alias: normalizeText(alias), canonical: canonicalAnimalName(canonical) }))
    .filter(({ alias }) => {
      if (!alias || seen.has(alias)) return false;
      seen.add(alias);
      return true;
    })
    .sort((a, b) => b.alias.length - a.alias.length);
}

function canonicalAnimalName(name) {
  const normalized = normalizeText(name);
  const aliases = {
    小狗: "狗",
    狗狗: "狗",
    犬: "狗",
    小猫: "猫",
    猫咪: "猫",
    兔子: "兔",
    老鼠: "鼠",
    耗子: "鼠",
    老虎: "虎",
    猴子: "猴",
    鸭子: "鸭",
    鹅子: "鹅"
  };
  return aliases[normalized] || normalized;
}

function computeTotals() {
  const domainScores = {};
  let rawScore = 0;
  let completed = 0;
  tasks.forEach((task) => {
    const response = getResponse(task.id);
    const score = computeTaskScore(task, response);
    response.score = score;
    response.maxScore = task.maxScore;
    if (!domainScores[task.domain]) domainScores[task.domain] = { score: 0, max: 0 };
    domainScores[task.domain].score += score;
    domainScores[task.domain].max += task.maxScore;
    rawScore += score;
    if (response.submitted) completed += 1;
  });
  const educationBonus = educationBonusForLevel(state.participant.educationLevel);
  const totalScore = Math.min(30, rawScore + educationBonus);
  const totalDurationMs = Object.values(state.responses).reduce((sum, response) => sum + (response.durationMs || 0), 0);
  return { rawScore, educationBonus, totalScore, totalDurationMs, completed, domainScores, riskBand: totalScore >= 26 ? "正常范围（附件阈值 ≥26）" : "低于 26 分，建议进一步评估" };
}

function educationBonusForLevel(level) {
  return ["小学", "初中", "中专", "高中"].includes(level) ? 1 : 0;
}

function estimatedDataUrlBytes(value) {
  if (typeof value !== "string") return 0;
  const comma = value.indexOf(",");
  const body = comma >= 0 ? value.slice(comma + 1) : value;
  return Math.round((body.length * 3) / 4);
}

function compactAnswerForBackend(answer) {
  const copy = JSON.parse(JSON.stringify(answer || {}));
  if (!copy.audioRecordings) return copy;
  copy.audioRecordings = Object.fromEntries(
    Object.entries(copy.audioRecordings).map(([step, recording]) => [
      step,
      {
        stored: false,
        bytes: estimatedDataUrlBytes(recording),
        note: "后台保留语音识别文本和录音元数据，不保存原始音频文件。"
      }
    ])
  );
  return copy;
}

function answerSummaryForTask(task, response, score) {
  const parts = answerSummaryPartsForTask(task, response, score).map(normalizeAnswerPart);
  return {
    userAnswer: parts.map((part) => part.label ? `${part.label}: ${part.user}` : part.user).join("；"),
    standardAnswer: parts.filter((part) => part.standard).map((part) => part.label ? `${part.label}: ${part.standard}` : part.standard).join("；"),
    parts,
    score,
    maxScore: task.maxScore,
    scoreReason: drawingScoreReason(task, response, score)
  };
}

function answerSummaryPartsForTask(task, response, score) {
  const answer = response.answer || {};
  if (answer.skipped) return [answerPart("", "已跳过", "", false)];
  if (task.id === "trail") {
    const sequence = Array.isArray(response.behavior.sequence) && response.behavior.sequence.length
      ? response.behavior.sequence.join("-")
      : "未完成";
    const parts = [answerPart("连线", sequence, TRAIL_EXPECTED.join("-"), score === task.maxScore)];
    const reason = drawingScoreReason(task, response, score);
    if (reason) parts.push(answerPart("评分说明", reason, "", score === task.maxScore));
    return parts;
  }
  if (task.id === "cube" || task.id === "clock") {
    const parts = [answerPart("图案", response.drawingImage || state.drawings[task.id] ? "已提交画图" : "未提交画图", drawingStandardText(task.id), score === task.maxScore)];
    const reason = drawingScoreReason(task, response, score);
    if (reason) parts.push(answerPart("评分说明", reason, "", score === task.maxScore));
    return parts;
  }
  if (task.type === "naming") {
    return task.items.map((entry) => answerPart(entry.answer, answer[entry.key] || "未答", entry.answer, answer[entry.key] === entry.answer));
  }
  if (task.type === "memory") return memoryAnswerParts(response);
  if (task.type === "choice") {
    const item = activeDigitItem(task);
    const user = Array.isArray(answer.sequence) && answer.sequence.length ? answer.sequence.join("") : "未答";
    return [answerPart("顺序", user, item.answer, user === item.answer)];
  }
  if (task.type === "vigilance") {
    const taps = Array.isArray(answer.taps) ? answer.taps.length : 0;
    const errors = response.behavior.vigilance?.errors;
    return [answerPart("敲击", `${taps} 次${Number.isFinite(Number(errors)) ? `，错误 ${errors} 次` : ""}`, "听到数字 1 时敲击，其他数字不敲", score === task.maxScore)];
  }
  if (task.type === "serial7") {
    const steps = response.behavior.serialSubtractionSteps || [];
    return steps.length ? steps.map((entry) => answerPart(`第 ${entry.step} 步`, entry.answer ?? "未答", entry.expected ?? "", Boolean(entry.correct))) : readableItemAnswerParts({ taskId: task.id, answer });
  }
  if (task.type === "sentence") {
    const details = response.behavior.sentenceScoring?.details || [];
    return details.length
      ? details.map((entry, index) => answerPart(`句子 ${index + 1}`, entry.transcript || "未答", entry.expected || task.sentences[index] || "", Boolean(entry.correct)))
      : readableSentenceAnswer(task, answer);
  }
  if (task.type === "fluency") {
    const animals = fluencyAnimalNamesFromResponse(response);
    return [answerPart("动物", animals.length ? `已识别 ${animals.length} 个：${animals.join("、")}` : "未识别到动物", "至少 11 个动物", animals.length >= 11)];
  }
  if (task.type === "abstractionChoice") {
    return task.items
      .filter((entry) => !entry.practice)
      .map((entry) => {
        const standard = response.behavior.abstractionCorrectAnswers?.[entry.key]
          || (Array.isArray(entry.correctAnswers) ? entry.correctAnswers[0] : entry.answer);
        return answerPart(entry.words.join("和"), answer[entry.key] || "未答", standard, answer[entry.key] === standard);
      });
  }
  if (task.type === "orientation") return orientationAnswerParts(answer);
  return readableGenericAnswer(answer);
}

function answerPart(label, user, standard, correct) {
  return { label, user: stringifyAnswerValue(user), standard: stringifyAnswerValue(standard), correct };
}

function memoryAnswerParts(response) {
  const answer = response.answer || {};
  const selected = Array.isArray(answer.selectedWords) ? answer.selectedWords : [];
  const targets = Array.isArray(response.behavior.memoryTargetWords) && response.behavior.memoryTargetWords.length
    ? response.behavior.memoryTargetWords
    : memoryTargetWords();
  const parts = targets.map((word) => answerPart(word, selected.includes(word) ? word : "未选", word, selected.includes(word)));
  selected.filter((word) => !targets.includes(word)).forEach((word, index) => {
    parts.push(answerPart(`误选 ${index + 1}`, word, "不应选择", false));
  });
  if (!parts.length) return [answerPart("选择", "未选择", "", false)];
  return parts;
}

function orientationAnswerParts(answer = {}) {
  const today = todayParts();
  const expectedCity = answer.expectedCity || "南京市";
  const expectedPlace = answer.expectedPlace || "";
  const city = normalizeText(answer.city || "");
  const place = normalizeText(answer.place || "");
  const cityExpected = normalizeText(expectedCity);
  const placeExpected = normalizeText(expectedPlace);
  return [
    answerPart("年份", answer.year || "未答", today.year, String(Number(answer.year)) === today.year),
    answerPart("月份", answer.month || "未答", today.month, String(Number(answer.month)) === today.month),
    answerPart("日期", answer.day || "未答", today.day, String(Number(answer.day)) === today.day),
    answerPart("星期", answer.weekday || "未答", today.weekday, normalizeText(answer.weekday) === normalizeText(today.weekday)),
    answerPart("城市", answer.city || "未答", expectedCity, Boolean(city) && (cityExpected ? city.includes(cityExpected) || cityExpected.includes(city) : true)),
    answerPart("地点", answer.place || "未答", expectedPlace || "定位地点", Boolean(place) && (placeExpected ? place.includes(placeExpected) || placeExpected.includes(place) : true))
  ];
}

function drawingScoreReason(task, response, score) {
  if (task.type !== "drawing" && task.type !== "trail") return "";
  if (response.ai?.status === "pending") return "";
  if (task.type === "drawing") {
    const missing = missingDrawingCriteria(task, response);
    if (score < task.maxScore && missing.length) return `未得分：${missing.map(formatMissingCriterion).join("；")}`;
    if (score < task.maxScore && response.ai?.comment) return normalizeMissingScoreComment(response.ai.comment);
  }
  if (task.type === "trail" && score < task.maxScore) return "最终连线序列未包含完整正确顺序。";
  if (task.type === "drawing" && score < task.maxScore) return "图片 AI 按 MoCA 标准判为未满足全部给分条件。";
  return "";
}

function missingDrawingCriteria(task, response) {
  const criteria = Array.isArray(response.ai?.criteria) ? response.ai.criteria : [];
  if (!criteria.length) return [];
  const rubric = DRAWING_AI_RUBRICS[task.drawingKind] || [];
  const labels = Object.fromEntries(rubric.map((item) => [item.key, item.label]));
  return criteria
    .filter((item) => item && item.passed === false)
    .map((item) => ({
      label: item.label || labels[item.key] || item.key || "未通过项",
      evidence: item.evidence || ""
    }));
}

function formatMissingCriterion(item) {
  const evidence = String(item.evidence || "").trim().replace(/^未得分[:：]\s*/, "");
  return evidence ? `${item.label}（${evidence}）` : item.label;
}

function normalizeMissingScoreComment(comment) {
  const text = String(comment || "").trim();
  if (!text) return "";
  return text.startsWith("未得分") ? text : `未得分：${text}`;
}

function hasCompletedHearingScreening(screening) {
  const normalized = normalizeHearingScreening(screening);
  return normalized.status === "completed" && hearingCompletedTrialCount(normalized) > 0;
}

function hasAnyHearingScreeningRecord(screening) {
  const normalized = normalizeHearingScreening(screening);
  return hasCompletedHearingScreening(normalized)
    || normalized.status === "skipped"
    || normalized.environment.status !== "not_checked"
    || normalized.environmentChecks.length > 0
    || normalized.channelChecks.length > 0
    || normalized.practiceResponses.length > 0
    || normalized.responses.length > 0;
}

function compactHearingScreeningForPayload(screening) {
  if (!hasAnyHearingScreeningRecord(screening)) return null;
  const copy = JSON.parse(JSON.stringify(normalizeHearingScreening(screening)));
  copy.responseCounts = summarizeHearingResponses(copy);
  copy.events = hearingEventsForExport(copy);
  copy.summary = copy.summary || (hasCompletedHearingScreening(copy) ? summarizeHearingScreening(copy) : {
    protocolVersion: HEARING_PROTOCOL_VERSION,
    status: copy.status === "skipped" ? "skipped" : "incomplete",
    pass: null,
    selfSelectedAudioLevelDbHl: copy.selfSelectedAudioLevelDbHl ?? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
    mocaAudioLevelDbHl: copy.mocaAudioLevelDbHl ?? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
    cognitionTestAudioLevelDbHl: copy.mocaAudioLevelDbHl ?? MOCA_AUDIO_DEFAULT_LEVEL_DB_HL,
    responseCounts: copy.responseCounts,
    completedTrialCount: hearingCompletedTrialCount(copy),
    totalTrialCount: createHearingTrials().length
  });
  delete copy.currentTonePlaying;
  delete copy.currentTonePlayed;
  delete copy.message;
  delete copy.lastToneStartedAt;
  delete copy.lastToneEndedAt;
  return copy;
}

function buildSessionPayload({ includeAudioBlobs = false } = {}) {
  const totals = computeTotals();
  const now = new Date().toISOString();
  return {
    id: state.sessionId,
    participant: {
      ...state.participant,
      ageAtTest: participantAgeAtTest(state.participant),
      targetAgeEligible: participantAgeAtTest(state.participant) === null ? null : participantAgeAtTest(state.participant) >= 60
    },
    startedAt: state.startedAt,
    finishedAt: state.finishedAt || now,
    totalDurationMs: totals.totalDurationMs,
    rawScore: totals.rawScore,
    educationBonus: totals.educationBonus,
    totalScore: totals.totalScore,
    riskBand: totals.riskBand,
    domainScores: totals.domainScores,
    audioLevels: {
      selfSelectedAudioLevelDbHl: currentSelfSelectedAudioLevelDbHl(),
      cognitionTestAudioLevelDbHl: currentMocaAudioLevelDbHl()
    },
    hearingScreening: compactHearingScreeningForPayload(state.hearingScreening),
    taskRuntime: ensureTaskRuntime(),
    ttsManifestVersion: staticTtsManifest?.version ?? null,
    itemResponses: tasks.map((task) => {
      const response = getResponse(task.id);
      const score = computeTaskScore(task, response);
      const answerSummary = answerSummaryForTask(task, response, score);
      const answerPayload = includeAudioBlobs ? JSON.parse(JSON.stringify(response.answer || {})) : compactAnswerForBackend(response.answer);
      answerPayload.answerSummary = answerSummary;
      return {
        taskId: task.id,
        domain: task.domain,
        title: task.title,
        modality: task.modality,
        maxScore: task.maxScore,
        score,
        startedAt: response.startedAt,
        endedAt: response.endedAt,
        durationMs: response.durationMs,
        answer: answerPayload,
        standardAnswer: answerSummary.standardAnswer,
        userAnswer: answerSummary.userAnswer,
        correctness: { parts: answerSummary.parts },
        behavior: response.behavior,
        drawingImage: response.drawingImage || state.drawings[task.id],
        ai: response.ai
      };
    })
  };
}

function scheduleBackgroundSessionSave(delayMs = 600) {
  if (backgroundSessionSaveTimer) window.clearTimeout(backgroundSessionSaveTimer);
  backgroundSessionSaveTimer = window.setTimeout(() => {
    backgroundSessionSaveTimer = null;
    saveSessionInBackground();
  }, delayMs);
}

async function saveSessionInBackground() {
  if (state.sessionSaveStatus === "saving") {
    scheduleBackgroundSessionSave(1200);
    return;
  }
  try {
    const payload = buildSessionPayload();
    const saved = await requestJson("/api/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }, () => localSaveSession(payload));
    const savedDetail = { ...payload, ...saved, itemResponses: payload.itemResponses };
    state.sessionId = savedDetail.id;
    state.sessionSaveStatus = "saved";
    state.sessionSavedAt = savedDetail.savedAt || new Date().toISOString();
    cacheSessionDetail(savedDetail);
    upsertAdminSessionSummary(savedDetail);
    if (state.selectedSession?.id === savedDetail.id) {
      state.selectedSession = savedDetail;
      state.selectedSessionLoading = false;
    }
  } catch (error) {
    console.warn("Background session save failed", error);
    state.sessionSaveStatus = "error";
    state.sessionSaveError = error?.message || String(error || "保存失败");
  }
}

async function saveSession(options = {}) {
  const { stayOnResults = false } = options;
  state.finishedAt = state.finishedAt || new Date().toISOString();
  state.sessionSaveStatus = "saving";
  state.sessionSaveError = "";
  if (stayOnResults) render();
  const payload = buildSessionPayload();
  const saved = await requestJson("/api/sessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }, () => localSaveSession(payload));
  const savedDetail = { ...payload, ...saved, itemResponses: payload.itemResponses };
  state.sessionId = savedDetail.id;
  state.selectedSession = savedDetail;
  state.selectedSessionLoading = false;
  state.sessionSaveStatus = "saved";
  state.sessionSavedAt = savedDetail.savedAt || new Date().toISOString();
  cacheSessionDetail(savedDetail);
  upsertAdminSessionSummary(savedDetail);
  state.view = stayOnResults ? "results" : "admin";
  render();
}

function upsertAdminSessionSummary(session) {
  const summary = {
    id: session.id,
    participant: session.participant,
    participantAge: session.participantAge ?? session.participant?.age ?? null,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    savedAt: session.savedAt,
    totalDurationMs: session.totalDurationMs,
    rawScore: session.rawScore,
    educationBonus: session.educationBonus,
    totalScore: session.totalScore,
    riskBand: session.riskBand,
    itemCount: session.itemResponses?.length || 0,
    storageMode: session.storageMode
  };
  const existing = Array.isArray(state.adminSessions) ? state.adminSessions : [];
  state.adminSessions = [summary, ...existing.filter((entry) => entry.id !== summary.id)];
}

async function loadSessions(shouldRender = false) {
  const sessions = await requestJson("/api/sessions", undefined, () => localListSessions());
  state.adminSessions = sessions;
  const selectedId = state.selectedSession?.id;
  const next = sessions.find((session) => session.id === selectedId) || sessions[0] || null;
  state.selectedSession = next ? (sessionDetailCache.get(next.id) || next) : null;
  state.selectedSessionLoading = false;
  if (shouldRender) render();
}

function cacheSessionDetail(session) {
  if (session?.id && Array.isArray(session.itemResponses)) sessionDetailCache.set(session.id, session);
  return session;
}

function sessionSummaryById(id) {
  return (state.adminSessions || []).find((session) => session.id === id) || null;
}

async function loadSessionDetail(id, options = {}) {
  const { force = false } = options;
  if (!force && sessionDetailCache.has(id)) return sessionDetailCache.get(id);
  const detail = await requestJson(`/api/sessions/${encodeURIComponent(id)}`, undefined, () => readLocalSessions().find((entry) => entry.id === id) || null);
  return cacheSessionDetail(detail);
}

async function selectSavedSession(id, shouldRender = true) {
  const cached = sessionDetailCache.get(id);
  state.selectedSession = cached || sessionSummaryById(id) || { id };
  state.selectedSessionLoading = !cached;
  if (shouldRender) render();
  if (cached) return;
  const detail = await loadSessionDetail(id);
  if (state.selectedSession?.id !== id) return;
  state.selectedSession = detail || state.selectedSession;
  state.selectedSessionLoading = false;
  if (shouldRender) render();
}

async function exportSessionsCsv() {
  const sessions = await requestJson("/api/sessions", undefined, () => localListSessions());
  if (!sessions.length) {
    window.alert("暂无可导出的测评数据");
    return;
  }

  const fullSessions = await Promise.all(sessions.map((session) => (
    requestJson(`/api/sessions/${encodeURIComponent(session.id)}`, undefined, () => readLocalSessions().find((entry) => entry.id === session.id) || session)
  )));
  const rows = fullSessions.flatMap(csvRowsForSession);
  const csv = rowsToCsv(rows);
  const filename = `cognition-hearing-game-${formatDateForFilename(new Date())}.csv`;
  downloadTextFile(filename, csv, "text/csv;charset=utf-8");
}

function csvRowsForSession(session) {
  const participant = session.participant || {};
  const hearing = session.hearingScreening || null;
  const hearingSummary = hearing?.summary || {};
  const hearingResponseCounts = hearing?.responseCounts || hearingSummary.responseCounts || (hearing ? summarizeHearingResponses(hearing) : {});
  const hearingEvents = Array.isArray(hearing?.events) ? hearing.events : (hearing ? hearingEventsForExport(hearing) : []);
  const itemResponses = Array.isArray(session.itemResponses) && session.itemResponses.length
    ? session.itemResponses
    : [{ taskId: "", title: "", domain: "", modality: "", maxScore: "", score: "", answer: {}, behavior: {}, ai: null }];

  return itemResponses.map((item) => ({
    session_id: session.id || "",
    participant_name: participant.name || "",
    participant_age: formatParticipantAge(participant),
    birth_year: participant.birthYear || "",
    gender: participant.sex || participant.gender || "",
    education_level: participant.educationLevel || "",
    session_started_at: session.startedAt || "",
    session_finished_at: session.finishedAt || "",
    saved_at: session.savedAt || "",
    total_duration_ms: session.totalDurationMs ?? "",
    raw_score: session.rawScore ?? "",
    education_bonus: session.educationBonus ?? "",
    total_score: session.totalScore ?? "",
    risk_band: session.riskBand || "",
    domain_scores_json: stringifyForCsv(session.domainScores || {}),
    hearing_status: hearing ? formatHearingStatus(hearingSummary.status || hearing.status) : "",
    hearing_right_pta4: hearingSummary.ears?.right?.pta4 ?? "",
    hearing_left_pta4: hearingSummary.ears?.left?.pta4 ?? "",
    hearing_worse_ear: formatWorseEarLabel(hearingSummary.worseEar),
    hearing_self_selected_audio_level: hearingSummary.selfSelectedAudioLevelDbHl ?? hearing?.selfSelectedAudioLevelDbHl ?? session.audioLevels?.selfSelectedAudioLevelDbHl ?? "",
    hearing_moca_audio_level: hearingSummary.mocaAudioLevelDbHl ?? hearing?.mocaAudioLevelDbHl ?? "",
    hearing_test_audio_level: hearingSummary.cognitionTestAudioLevelDbHl ?? hearingSummary.mocaAudioLevelDbHl ?? hearing?.mocaAudioLevelDbHl ?? session.audioLevels?.cognitionTestAudioLevelDbHl ?? "",
    hearing_environment_status: hearing?.environment?.status || "",
    hearing_environment_relative_db: hearing?.environment?.relativeDb ?? "",
    hearing_environment_checked_at: hearing?.environment?.checkedAt || "",
    hearing_response_count: hearingResponseCounts.total ?? "",
    hearing_heard_count: hearingResponseCounts.heard ?? "",
    hearing_missed_count: hearingResponseCounts.missed ?? "",
    hearing_environment_checks_json: hearing ? stringifyForCsv(hearing.environmentChecks || []) : "",
    hearing_events_json: hearing ? stringifyForCsv(hearingEvents) : "",
    hearing_screening_json: hearing ? stringifyForCsv(hearing) : "",
    task_id: item.taskId || "",
    task_title: item.title || "",
    domain: item.domain || "",
    modality: item.modality || "",
    max_score: item.maxScore ?? "",
    score: item.score ?? "",
    item_started_at: item.startedAt || "",
    item_ended_at: item.endedAt || "",
    item_duration_ms: item.durationMs ?? "",
    standard_answer: item.standardAnswer || item.answer?.answerSummary?.standardAnswer || "",
    user_answer: item.userAnswer || item.answer?.answerSummary?.userAnswer || "",
    correctness_json: stringifyForCsv(item.correctness || item.answer?.answerSummary?.parts || null),
    answer_json: stringifyForCsv(item.answer || {}),
    behavior_json: stringifyForCsv(item.behavior || {}),
    ai_json: stringifyForCsv(item.ai || null),
    drawing_image: item.drawingImage || ""
  }));
}

function stringifyForCsv(value) {
  return JSON.stringify(value ?? null);
}

function rowsToCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(","))
  ].join("\r\n");
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function formatDateForFilename(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob(["\ufeff", content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function stopTimers() {
  stopTrailGuide();
  stopHearingTone();
  clearSpeechRecognitionRestartTimer();
  window.clearInterval(vigilanceTimer);
  window.clearInterval(fluencyTimer);
}
