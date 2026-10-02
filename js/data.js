// =============================================================
// 京迹 · 北京旅游攻略数据
// 说明：票价与预约政策可能调整，出行前请以官方渠道为准。
// entry.type: "预约" | "购票" | "免费"
// scalper.risk: "high" | "low" | "none"
// =============================================================
const SPOTS = [
  {
    id: "gugong",
    name: "故宫",
    en: "The Forbidden City",
    tagline: "明清两代 24 位皇帝的皇宫",
    img: "images/gugong.jpg",
    category: "宫殿",
    rating: 5,
    bestHours: "3-4 小时",
    entry: {
      type: "预约",
      summary: "实名预约，无现场售票",
      details: "必须提前在官方渠道实名预约购票，现场不售票；未预约无法入馆。",
      channels: ["微信「故宫博物院」公众号", "故宫官网", "官方 App"],
      leadDays: 1,
      saleTime: "08:00",
      leadNote: "常规：每日 8:00 放票，可买次日票；节假日/旺季建议提前 7 天抢票。10 月中旬已过大客流，但票仍紧，建议提前 3-7 天。"
    },
    tickets: [
      { name: "大门票（旺季 5.1-10.31）", price: "60 元" },
      { name: "大门票（淡季 11.1-4.30）", price: "40 元" },
      { name: "珍宝馆 / 钟表馆（各）", price: "10 元" }
    ],
    hours: "8:30 - 17:00（16:00 停止入馆）",
    closed: "周一闭馆（法定节假日除外）",
    scalper: {
      risk: "high",
      text: "实名 + 人脸/证件核验，必须人证一致。闲鱼等平台上的「故宫票」多为黄牛加价或票贩/假票，刷脸进不去、纯坑钱，风险极高。官方渠道完全买得到票，别被「抢不到」的话术吓到。"
    },
    transport: "地铁 2/8 号线「前门站」出，步行约 10 分钟至午门（南门）",
    history: "1420 年（明永乐十八年）建成，是明清两代 24 位皇帝的皇宫，世界上现存规模最大、保存最完整的木质结构古建筑群，殿宇房舍 9000 余间，故有「万千宫殿」之说。1987 年列入世界文化遗产。中轴线自午门至神武门，沿轴分布太和、中和、保和三朝大殿，后六宫是帝后居住区。",
    tips: [
      "10 月中旬刚过国庆高峰，人相对少，但票仍紧，务必提前预约",
      "买 8:30 开场票，午门进后走中轴线，3 小时看完精华",
      "周一闭馆！排日程时一定注意",
      "珍宝馆、钟表馆值得加 10 元",
      "最佳机位在景山万春亭（见「景山公园」）"
    ],
    combine: ["jingshan", "drumbell", "nanluoguxiang"]
  },
  {
    id: "changcheng",
    name: "八达岭长城",
    en: "Badaling Great Wall",
    tagline: "「不到长城非好汉」",
    img: "images/changcheng.jpg",
    category: "长城",
    rating: 5,
    bestHours: "半天",
    entry: {
      type: "预约",
      summary: "实名预约，现场基本售罄",
      details: "需提前实名预约购票，节假日现场票几乎售罄。建议提前 1-3 天，国庆等高峰提前 7 天。",
      channels: ["长城官方小程序 / 公众号", "官方 App", "携程等官方授权平台"],
      leadDays: 1,
      saleTime: "08:00",
      leadNote: "常规提前 1 天，高峰（国庆/十一）建议提前 7 天抢。10 月中旬高峰已过，提前 1-2 天即可。"
    },
    tickets: [
      { name: "成人门票", price: "40 元" },
      { name: "景交车（往返，可选）", price: "约 80 元" },
      { name: "缆车 / 滑道（单程，可选）", price: "约 100 元" }
    ],
    hours: "7:30 - 17:00",
    closed: "全年开放",
    scalper: {
      risk: "high",
      text: "八达岭黄牛/野导极多，「便宜票」「快速通道」多为套路，且实名制下人证不符进不去。务必走官方渠道购票，别信路边拉客。"
    },
    transport: "从北京市区出发：最省心是旅游专线/包车（约 1-1.5 小时）；也可从北京北站乘 S2 市郊铁路到八达岭（约 1 小时）。节假日车/票也紧，建议提前买。也可从昌平发大巴直达八达岭。",
    history: "八达岭为明长城防御工程的重要关隘，也是万里长城中建筑质量最好、保存最完整的一段，1987 年作为「长城」项目的一部分列入世界文化遗产。这里地势险要，是「北门锁钥」。",
    tips: [
      "10 月是看长城秋色最好的季节，蓝天 + 红叶",
      "建议 8:00 前到，避开旅行团大部队",
      "体力一般可坐缆车 / 滑道省力",
      "怕冷：10 月山风大，带件外套"
    ],
    combine: ["tiantan", "yuyuan"]
  },
  {
    id: "tiantan",
    name: "天坛公园",
    en: "Temple of Heaven",
    tagline: "明清帝王祭天祈谷之所",
    img: "images/tiantan.jpg",
    category: "宫殿",
    rating: 5,
    bestHours: "2-3 小时",
    entry: {
      type: "预约",
      summary: "实名预约，建议提前 1-7 天",
      details: "通过官方渠道实名预约，旺季/节假日票紧，建议提前 1-7 天。",
      channels: ["「天坛」官方公众号", "官方预约平台", "美团 / 携程（官方授权）"],
      leadDays: 1,
      saleTime: "08:00",
      leadNote: "常规提前 1 天即可；节假日建议提前 3-7 天。"
    },
    tickets: [
      { name: "大门票（旺季）", price: "15 元" },
      { name: "联票（含祈年殿等，旺季）", price: "34 元" }
    ],
    hours: "6:00 - 22:00（内部景点 8:00-17:30）",
    closed: "全年开放",
    scalper: {
      risk: "low",
      text: "天坛票源充足，基本无需黄牛，官方渠道即可轻松买到。"
    },
    transport: "地铁 5 号线「天坛东门站」出，步行约 10 分钟至东门；或地铁 2/8 号线「前门站」步行约 15 分钟至南门",
    history: "天坛是明清两代皇帝祭天、祈谷（为丰收祷告）的场所。祈年殿是核心建筑，圆形攒尖顶，用蓝瓦象征天。整体布局「天圆地方」，是古代天人合一思想的典范，1998 年列入世界文化遗产。",
    tips: [
      "建议 8:00 前入园，清晨游客少、光线好",
      "联票含祈年殿、皇穹宇、圜丘等主要景点",
      "回音壁、三音石是「声学」打卡点",
      "10 月银杏开始变黄，秋色佳"
    ],
    combine: ["gugong", "changcheng"]
  },
  {
    id: "yuyuan",
    name: "颐和园",
    en: "Summer Palace",
    tagline: "京西第一园，皇家园林",
    img: "images/yuyuan.jpg",
    category: "园林",
    rating: 5,
    bestHours: "3-4 小时",
    entry: {
      type: "预约",
      summary: "实名预约，建议提前 1-7 天",
      details: "通过官方渠道实名预约，旺季票紧，建议提前 1-7 天。",
      channels: ["「颐和园」官方公众号", "官方预约平台", "美团 / 携程（官方授权）"],
      leadDays: 1,
      saleTime: "08:00",
      leadNote: "常规提前 1 天；节假日建议提前 3-7 天。"
    },
    tickets: [
      { name: "大门票（旺季）", price: "30 元" },
      { name: "园内景点（画舫 / 苏州街等，联票）", price: "10-20 元" }
    ],
    hours: "6:30 - 18:00",
    closed: "全年开放",
    scalper: {
      risk: "low",
      text: "颐和园票源较充足，官方渠道基本都能买到，无需黄牛。"
    },
    transport: "地铁 4 号线「北宫门站」出即到颐和园北门（正门）；东门、西门可乘公交直达",
    history: "颐和园原名清漪园，1750 年（乾隆十五年）建成。1860 年被英法联军焚毁，1886 年慈禧太后用海军军费重建并改名「颐和园」。它以昆明湖、万寿山为基址，是中国现存规模之大、保存最完整的皇家园林，1998 年列入世界文化遗产。",
    tips: [
      "建议从「北宫门」进，先游万寿山、佛香阁，再沿昆明湖东行",
      "17 孔桥、石舫、苏州街是重点",
      "10 月荷花已谢，但西山秋色、昆明湖倒影很美",
      "可坐船游昆明湖，省力又出片"
    ],
    combine: ["beihai", "tiantan"]
  },
  {
    id: "beihai",
    name: "北海公园",
    en: "Beihai Park",
    tagline: "北京现存最古老的皇家园林",
    img: "images/beihai.jpg",
    category: "园林",
    rating: 4,
    bestHours: "1.5-2 小时",
    entry: {
      type: "预约",
      summary: "实名预约，票源充足",
      details: "官方渠道实名预约即可，票源充足，一般无需很早抢。",
      channels: ["「北海公园」官方公众号", "官方预约平台"],
      leadDays: 1,
      saleTime: "08:00",
      leadNote: "提前 1 天即可，无需焦虑。"
    },
    tickets: [
      { name: "大门票", price: "10 元" },
      { name: "联票（含团城、白塔等）", price: "约 20 元" }
    ],
    hours: "6:30 - 18:00",
    closed: "全年开放",
    scalper: {
      risk: "none",
      text: "无需黄牛，官方渠道轻松购票。"
    },
    transport: "地铁 6 号线「北海北」/ 地铁 8 号线「什刹海」，步行即达",
    history: "北海公园原是琼华岛上的「太液池」，辽、金、元三代在此建行宫，元世祖忽必烈定都大都时曾以琼华岛为「镇海」（镇水）之地。明、清两代发展为皇家园林，以琼岛白塔为标志，是北京现存历史最久、保存最完整的皇家园林。",
    tips: [
      "必上琼岛，看白塔 + 俯瞰全园",
      "团城、永安寺值得顺访",
      "可坐船游太液池",
      "10 月晚风凉，湖边散步很舒服"
    ],
    combine: ["yuyuan", "shichahai"]
  },
  {
    id: "jingshan",
    name: "景山公园",
    en: "Jingshan Park",
    tagline: "俯瞰故宫全景的最佳机位",
    img: "images/jingshan.jpg",
    category: "园林",
    rating: 4,
    bestHours: "1-1.5 小时",
    entry: {
      type: "购票",
      summary: "现场 / 线上购票，无需抢",
      details: "门票便宜、票源充足，现场或线上均可购票，无需提前抢票。",
      channels: ["现场售票", "官方公众号"],
      leadDays: 0,
      saleTime: "-",
      leadNote: "无需提前预约，当天现场买即可。"
    },
    tickets: [
      { name: "大门票", price: "5 元" }
    ],
    hours: "6:30 - 21:00",
    closed: "全年开放",
    scalper: {
      risk: "none",
      text: "无需黄牛，5 元门票现场买即可。"
    },
    transport: "故宫北门（神武门）出来，过马路步行约 5 分钟即达南门",
    history: "景山是元代在元大都时堆土筑成的，明清两代是皇家禁苑。它是北京老城的中轴线制高点，山身高约 100 米。登万春亭可 360° 俯瞰故宫全景与北京老城，是拍摄故宫、中轴线的经典机位。",
    tips: [
      "逛完故宫从北门（神武门）出，直接上景山看全景，顺路",
      "万春亭是核心机位，人略多但值得",
      "5 元门票性价比极高",
      "10 月傍晚，夕阳下的故宫金光，非常出片"
    ],
    combine: ["gugong", "shichahai"]
  },
  {
    id: "drumbell",
    name: "钟鼓楼",
    en: "Drum Tower & Bell Tower",
    tagline: "老北京报时中枢，中轴线北端",
    img: "images/drumbell.jpg",
    category: "历史",
    rating: 4,
    bestHours: "1-1.5 小时",
    entry: {
      type: "购票",
      summary: "现场 / 线上购票，无需抢",
      details: "门票便宜，现场或线上购票即可，无需提前抢。",
      channels: ["现场售票", "官方公众号"],
      leadDays: 0,
      saleTime: "-",
      leadNote: "无需提前预约，当天买即可。"
    },
    tickets: [
      { name: "鼓楼（登楼）", price: "30 元" },
      { name: "钟楼（登楼）", price: "25 元" },
      { name: "钟鼓楼联票", price: "约 45 元" }
    ],
    hours: "9:00 - 17:00",
    closed: "全年开放",
    scalper: {
      risk: "none",
      text: "无需黄牛，现场 / 线上购票即可。"
    },
    transport: "地铁 8 号线「什刹海」/「南锣鼓巷」站，步行约 10 分钟；或地铁 2 号线「鼓楼大街」站",
    history: "钟鼓楼始建于元代（1278 年），是元、明、清三朝北京城的报时中心，曾是皇家计时与发布政令的场所。鼓楼高约 46 米，三层重檐；钟楼内悬明代洪武年间铸造的大钟，重约 60 吨，是「暮鼓晨钟」文化的代表。",
    tips: [
      "鼓楼比钟楼更值得登，视野好",
      "和「南锣鼓巷」「什刹海」连成一片，一起玩",
      "登楼可看北京老城与中轴线",
      "傍晚亮灯后，鼓楼外观很上镜"
    ],
    combine: ["nanluoguxiang", "shichahai"]
  },
  {
    id: "kongmiao",
    name: "孔庙·国子监",
    en: "Confucius Temple & Imperial Academy",
    tagline: "元明清三代最高学府",
    img: "images/kongmiao.jpg",
    category: "历史",
    rating: 4,
    bestHours: "1-1.5 小时",
    entry: {
      type: "购票",
      summary: "现场 / 线上购票，无需抢",
      details: "门票便宜、人少，现场或线上购票即可。",
      channels: ["现场售票", "官方公众号"],
      leadDays: 0,
      saleTime: "-",
      leadNote: "无需提前预约，当天买即可。"
    },
    tickets: [
      { name: "孔庙门票", price: "30 元" },
      { name: "国子监门票", price: "20 元" },
      { name: "孔庙 + 国子监联票", price: "40 元" }
    ],
    hours: "9:00 - 17:00",
    closed: "周一闭馆（法定节假日除外）",
    scalper: {
      risk: "none",
      text: "无需黄牛，现场 / 线上购票即可。"
    },
    transport: "地铁 6/8 号线「南锣鼓巷站」出，步行约 10 分钟即达；或「鼓楼大街站」步行约 10 分钟",
    history: "孔庙始建于 1302 年（元大德六年），是元、明、清三朝祭祀孔子和先贤先师的场所，现为北京孔庙。国子监是中国古代最高学府和教育行政管理机构，始建于 1271 年，是中国现存规模最大、保存最完整的古代最高教育机构，有「古代北大」之称。",
    tips: [
      "人少、清净，适合喜欢历史和科举文化的人",
      "孔庙的「进士碑林」值得一看",
      "和「南锣鼓巷」「钟楼」片区串联游玩",
      "10 月秋高气爽，古柏夹道，很舒服"
    ],
    combine: ["drumbell", "nanluoguxiang"]
  },
  {
    id: "yonghegong",
    name: "雍和宫",
    en: "Lama Temple",
    tagline: "北京最大的藏传佛教寺院",
    img: "images/yonghegong.jpg",
    category: "历史",
    rating: 4,
    bestHours: "1.5-2 小时",
    entry: {
      type: "预约",
      summary: "实名预约，建议提前 1 天",
      details: "通过官方渠道实名预约，票源相对充足，建议提前 1 天。",
      channels: ["「雍和宫」官方公众号", "官方预约平台"],
      leadDays: 1,
      saleTime: "08:00",
      leadNote: "提前 1 天即可；节假日可提前 3 天。"
    },
    tickets: [
      { name: "大门票", price: "25 元" }
    ],
    hours: "9:00 - 16:30",
    closed: "全年开放",
    scalper: {
      risk: "none",
      text: "无需黄牛，官方渠道购票即可。"
    },
    transport: "地铁 2 号线 / 5 号线「雍和宫站」出即到",
    history: "雍和宫初建于 1694 年（康熙三十三年），原是康熙帝为皇四子胤禛（即后来的雍正帝）的府邸。1735 年雍正登基后将其改为佛寺，赐名「雍和宫」。它是北京规模最大、保存最完整的藏传佛教（喇嘛）寺院，也是清朝处理边疆民族事务的重要场所。",
    tips: [
      "主殿的檀木五佛像是镇宫之宝，一定要看",
      "香道文化浓，可体验请香",
      "红墙黄瓦出片，和故宫气质不同",
      "离「国子监」「孔庙」很近，一起逛"
    ],
    combine: ["kongmiao", "shichahai"]
  },
  {
    id: "art798",
    name: "798 艺术区",
    en: "798 Art District",
    tagline: "从老工厂到当代艺术地标",
    img: "images/art798.jpg",
    category: "艺术",
    rating: 4,
    bestHours: "2-3 小时",
    entry: {
      type: "免费",
      summary: "园区免费，部分展馆需购票 / 预约",
      details: "园区本身免费进入；部分展馆（如 UCCA、木木美术馆等）需单独购票或预约。",
      channels: ["各展馆官方公众号 / 官网", "大众点评 / 美团"],
      leadDays: 0,
      saleTime: "-",
      leadNote: "园区免费，当天去即可；看特展的展馆建议提前 1-2 天在官方渠道买票。"
    },
    tickets: [
      { name: "园区", price: "免费" },
      { name: "部分展馆特展（如 UCCA）", price: "约 80-150 元" }
    ],
    hours: "各展馆约 10:00 - 17:00",
    closed: "部分展馆周一闭馆",
    scalper: {
      risk: "none",
      text: "无需黄牛，展馆票走官方 / 正规票务平台即可。"
    },
    transport: "最近地铁：14 号线「阜通」/「望京东」站（步行约 1-1.5 公里）；最方便是打车定位「798 艺术区」（推荐，门口停车方便）",
    history: "798 艺术区的前身是建于 1950 年代的「718 厂」等老电子工业厂区（「798」之名即源于此）。2000 年代初，艺术家、画廊、设计机构陆续入驻这些空置厂房，将其改造为充满创意的当代艺术区，成为北京乃至中国最具代表性的当代艺术地标之一，也是工业遗产再利用的典范。",
    tips: [
      "适合喜欢当代艺术、拍照、喝咖啡的人",
      "彩色涂鸦墙、LOHAS 街区很出片",
      "周末常有市集、展览、活动",
      "部分展馆周一闭馆，排日程时注意"
    ],
    combine: ["shichahai", "jingshan"]
  },
  {
    id: "shichahai",
    name: "什刹海·后海",
    en: "Shichahai / Houhai",
    tagline: "京城水声，胡同与湖光",
    img: "images/shichahai.jpg",
    category: "风情",
    rating: 4,
    bestHours: "2 小时（傍晚 - 夜）",
    entry: {
      type: "免费",
      summary: "湖区免费开放，无需预约",
      details: "什刹海 / 后海为开放区域，免费进入，无需预约。划船等项目现场购票。",
      channels: ["现场购票（划船等）"],
      leadDays: 0,
      saleTime: "-",
      leadNote: "免费开放，随时可去。"
    },
    tickets: [
      { name: "进入湖区", price: "免费" },
      { name: "摇橹船 / 手划船（可选）", price: "约 60-100 元 / 船" }
    ],
    hours: "全天（划船约 9:00-17:00）",
    closed: "全年开放",
    scalper: {
      risk: "none",
      text: "无需黄牛，湖区免费开放。"
    },
    transport: "地铁 8 号线「什刹海」站 / 地铁 6 号线「北海北」站，步行即达",
    history: "什刹海由前海、后海、西海三片水域组成，原是元大都时期由「高梁河」（今高梁闸一带）水系演变形成的湖泊群，曾是元代漕运的码头，也是元、明、清皇家「西山」别苑所在地。「后海」之名即源于其位于北海公园之后，如今是京味文化与胡同生活最具代表性的区域之一。",
    tips: [
      "傍晚 - 夜晚最美：灯影、湖光、胡同烟火气",
      "可坐摇橹船 / 手划船游湖",
      "银锭桥是看「银锭观山」的机位",
      "和「北海」「钟鼓楼」「南锣鼓巷」连成一片"
    ],
    combine: ["beihai", "drumbell", "nanluoguxiang"]
  },
  {
    id: "nanluoguxiang",
    name: "南锣鼓巷",
    en: "Nanluoguxiang",
    tagline: "最古老的街区之一，胡同文化",
    img: "images/nanluoguxiang.jpg",
    category: "风情",
    rating: 4,
    bestHours: "1.5-2 小时",
    entry: {
      type: "免费",
      summary: "免费开放，无需预约",
      details: "整条街区免费开放，无需预约。部分小馆、文创需现场购票。",
      channels: ["现场"],
      leadDays: 0,
      saleTime: "-",
      leadNote: "免费开放，随时可去。"
    },
    tickets: [
      { name: "进入街区", price: "免费" }
    ],
    hours: "全天",
    closed: "全年开放",
    scalper: {
      risk: "none",
      text: "无需黄牛，免费开放。"
    },
    transport: "地铁 8 号线「南锣鼓巷」站 / 地铁 6 号线「南锣鼓巷」，出即达；或从「鼓楼」步行约 10 分钟",
    history: "南锣鼓巷是元大都时期「由北向南」规划形成的胡同街区，距今已有 700 多年历史，是北京老城内保存最完整、最古老的街区之一，也是「胡同 + 四合院」肌理的典型代表。清代时是皇城的「九门」之一周边，民国后成为文化名人聚居地，如今是胡同文化与文创商业结合的代表性街区。",
    tips: [
      "主巷游客多，真正有意思的是两侧的小胡同",
      "适合逛文创、喝酸奶、拍胡同",
      "和「钟鼓楼」「什刹海」「鼓楼大街」串联游玩",
      "想吃地道小吃，往「鼓楼大街」方向走更本地化"
    ],
    combine: ["drumbell", "shichahai", "gugong"]
  }
];

// 城市列表（未来扩展：新增城市时加一条，并补上该城市的 SPOTS/FOODS/METRO/WEATHER_BY_MONTH 数据即可）
const CITIES = [
  { id: "beijing",   name: "北京", en: "Beijing",   emoji: "🏮", tagline: "六朝帝都 · 中轴线之城", status: "ready" },
  { id: "shanghai",  name: "上海", en: "Shanghai",  emoji: "🌆", tagline: "魔都 · 海派风情", status: "coming" },
  { id: "xian",      name: "西安", en: "Xi'an",     emoji: "🏯", tagline: "十三朝古都 · 兵马俑", status: "coming" },
  { id: "chengdu",   name: "成都", en: "Chengdu",   emoji: "🐼", tagline: "天府之国 · 熊猫故乡", status: "coming" },
  { id: "chongqing", name: "重庆", en: "Chongqing", emoji: "🌃", tagline: "山城 · 8D 魔幻都市", status: "coming" },
  { id: "hangzhou",  name: "杭州", en: "Hangzhou",  emoji: "⛵", tagline: "人间天堂 · 西湖", status: "coming" },
  { id: "guangzhou", name: "广州", en: "Guangzhou", emoji: "🥟", tagline: "羊城 · 美食之都", status: "coming" },
  { id: "harbin",    name: "哈尔滨", en: "Harbin",  emoji: "❄️", tagline: "冰雪之城", status: "coming" }
];

// 北京 · 各月天气与穿衣档案（多年平均，出行前 3-5 天再查实时预报）
const WEATHER_BY_MONTH = {
  beijing: [
    { m: 1,  temp: "白天 0~2°C · 夜间 -12~-7°C", clothes: "羽绒服 + 毛衣，帽子手套必备", extras: ["干冷风大，注意保湿","室内有暖气，可穿脱的外套更方便"] },
    { m: 2,  temp: "白天 3~8°C · 夜间 -8~-5°C", clothes: "羽绒服 + 围巾", extras: ["一年中最冷时段","风大，护好脖子"] },
    { m: 3,  temp: "白天 10~15°C · 夜间 1~5°C", clothes: "冲锋衣/薄羽绒 + 长袖", extras: ["多风沙，建议带口罩","昼夜温差大，洋葱式穿法"] },
    { m: 4,  temp: "白天 17~22°C · 夜间 8~12°C", clothes: "夹克 + 长袖", extras: ["春季最佳，玉兰花开","花粉过敏者注意"] },
    { m: 5,  temp: "白天 22~28°C · 夜间 14~18°C", clothes: "T恤/薄衬衫 + 外套", extras: ["初夏，紫外线增强，防晒","长城徒步建议轻薄透气"] },
    { m: 6,  temp: "白天 27~32°C · 夜间 19~23°C", clothes: "短袖为主", extras: ["入夏，防晒 + 遮阳帽","进入雨季，带伞"] },
    { m: 7,  temp: "白天 28~33°C · 夜间 21~24°C", clothes: "短袖 + 透气衣物", extras: ["最热 + 雨季，防暑","带伞，随身带水"] },
    { m: 8,  temp: "白天 27~33°C · 夜间 20~24°C", clothes: "短袖 + 透气衣物", extras: ["持续炎热","带伞，防暑"] },
    { m: 9,  temp: "白天 23~28°C · 夜间 15~19°C", clothes: "长袖 + 薄外套", extras: ["初秋最舒适","秋色开始，银杏微黄"] },
    { m: 10, temp: "白天 17~24°C · 夜间 8~13°C", clothes: "T恤/薄长袖 + 轻薄外套", extras: ["秋高气爽，一年最美季节","昼夜温差大，早晚加衣；登长城再加一件"] },
    { m: 11, temp: "白天 9~12°C · 夜间 1~5°C", clothes: "风衣/薄羽绒 + 毛衣", extras: ["入冬，风大注意保暖","供暖开始（室内很暖）"] },
    { m: 12, temp: "白天 3~6°C · 夜间 -5~-4°C", clothes: "羽绒服 + 帽子围巾", extras: ["干冷","故宫等室内景点可稍减衣"] }
  ]
};

// 节假日/人流预警（按日期动态生成）
function _pd(s) { const p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function crowdAlert(dateStr) {
  const d = _pd(dateStr);
  const m = d.getMonth() + 1, day = d.getDate();
  if (m === 10 && day >= 1 && day <= 7) {
    return { level: "high", text: "🔥 正处国庆黄金周：人流极大！故宫/长城务必提前 7 天抢票，酒店机票越早订越好" };
  }
  if (m === 10 && day >= 8 && day <= 12) {
    return { level: "low", text: "✅ 刚过国庆黄金周，人流回落，是出行好时机" };
  }
  if (m === 1 && day >= 20) {
    return { level: "high", text: "⚠️ 临近春节/春运：交通、酒店紧张，尽早预订" };
  }
  if (m === 5 && day >= 1 && day <= 5) {
    return { level: "high", text: "🔥 五一假期：热门景点人多票紧，提前预订" };
  }
  return null;
}

// 美食地图（人均参考，实际以店内为准）
const FOODS = [
  { name: "四季民福烤鸭店（故宫店）", cat: "烤鸭", area: "故宫/景山旁", addr: "东城区 · 故宫景山附近（故宫店）", budget: "¥120/人", sign: "酥香烤鸭（比全聚德性价比高）", tip: "排队 1 小时+，先取号；酥皮鸭子必点", map: "四季民福烤鸭店(故宫店)" },
  { name: "全聚德（前门总店）", cat: "烤鸭", area: "前门", addr: "东城区前门大街（老字号总店）", budget: "¥150+/人", sign: "挂炉烤鸭 · 荷叶饼卷饼", tip: "1864 年老字号，游客多，建议午餐或错峰", map: "全聚德(前门总店)" },
  { name: "大董烤鸭（鼓楼店）", cat: "烤鸭", area: "鼓楼", addr: "东城区 · 鼓楼（鼓楼店）", budget: "¥130+/人", sign: "酥皮鸭 + 现场片鸭", tip: "可看片鸭表演，口味偏精致，适合带老人小孩", map: "大董烤鸭(鼓楼店)" },
  { name: "聚宝源涮肉（牛街店）", cat: "老北京涮肉", area: "牛街", addr: "西城区牛街 51 号", budget: "¥130/人", sign: "铜锅涮羊肉 · 手切鲜羊肉", tip: "全北京最排队的涮肉，提前线上取号或下午 3 点后来", map: "聚宝源(牛街店)" },
  { name: "同和居", cat: "清真菜", area: "西四", addr: "西城区西四北大街 130 号", budget: "¥100/人", sign: "它似蜜（拔丝番薯）", tip: "1863 年老店，「它似蜜」是招牌糖艺菜", map: "同和居" },
  { name: "烤肉季", cat: "烤羊肉", area: "前门", addr: "东城区前门东大街（大栅栏/琉璃厂旁）", budget: "¥90/人", sign: "烤羊肉（鲜切现烤）", tip: "鲜切羊肉现烤配烧饼，老北京清真名店", map: "烤肉季" },
  { name: "护国寺小吃", cat: "小吃", area: "护国寺", addr: "西城区护国寺大街（护国寺店）", budget: "¥25/人", sign: "豆汁焦圈 · 豌豆黄 · 炒肝", tip: "一站式吃齐老北京早点，豆汁有「勇气挑战」属性", map: "护国寺小吃(护国寺店)" },
  { name: "姚记炒肝", cat: "小吃", area: "鼓楼", addr: "东城区鼓楼东大街（鼓楼/南锣鼓巷旁）", budget: "¥20/人", sign: "炒肝 + 豆汁 + 焦圈", tip: "传统吃法：先不搅、转着圈喝一口，再就着焦圈吃", map: "姚记炒肝" },
  { name: "文宇奶酪", cat: "甜品", area: "南锣鼓巷", addr: "东城区南锣鼓巷（巷口附近）", budget: "¥20/人", sign: "老北京奶酪 · 炒米酸奶", tip: "逛南锣的标配甜品，别去巷内被推荐的高价店", map: "文宇奶酪" }
];

// 城市坐标（实时天气用，Open-Meteo 免费无 key）
const CITY_COORDS = {
  beijing: { lat: 39.9042, lng: 116.4074 }
};

// 地铁速查（基于 2026 年线路数据；乘车用「亿通行」App 或乘车码）
const METRO = [
  { line: "8 号线", color: "#009A6D", tag: "⭐ 游客黄金线", stations: [
    { name: "前门", spot: "故宫（步行 10 分钟至午门）" },
    { name: "什刹海", spot: "什刹海 / 后海湖畔" },
    { name: "南锣鼓巷", spot: "南锣鼓巷" },
    { name: "鼓楼大街", spot: "钟鼓楼（步行 15 分钟）" }
  ]},
  { line: "2 号线", color: "#356094", tag: "老城环线", stations: [
    { name: "前门", spot: "故宫 / 前门大街" },
    { name: "崇文门", spot: "前门大街（步行 10 分钟）" },
    { name: "雍和宫", spot: "雍和宫（出站即达）" },
    { name: "鼓楼大街", spot: "钟鼓楼（步行 15 分钟）" },
    { name: "北京站", spot: "火车站（出发/到达）" }
  ]},
  { line: "1 号线", color: "#A73C34", tag: "市中心东西向", stations: [
    { name: "天安门西 / 天安门东", spot: "天安门广场" },
    { name: "王府井", spot: "王府井大街（逛街/小吃）" },
    { name: "西单", spot: "西单商圈" }
  ]},
  { line: "4 号线", color: "#328D9A", tag: "南北大动脉", stations: [
    { name: "北宫门", spot: "颐和园北门（出站即达）" },
    { name: "宣武门", spot: "先农坛一带" }
  ]},
  { line: "5 号线", color: "#8E267C", tag: "东城线", stations: [
    { name: "雍和宫", spot: "雍和宫（出站即达）" },
    { name: "天坛东门", spot: "天坛东门（步行 10 分钟）" }
  ]},
  { line: "6 号线", color: "#C29622", tag: "北部线", stations: [
    { name: "北海北", spot: "北海公园（步行 10 分钟）" },
    { name: "南锣鼓巷", spot: "南锣鼓巷" }
  ]},
  { line: "14 号线", color: "#C8A5A0", tag: "东北方向", stations: [
    { name: "望京东 / 阜通", spot: "798 艺术区（步行 1-1.5 公里，建议打车）" }
  ]}
];

const METRO_TIPS = [
  "乘车用「亿通行」App 或支付宝/微信乘车码，扫码进站，不用买纸票",
  "10 月中旬非高峰，工作日早晚高峰人稍多，景点周边建议错峰出行",
  "八达岭无地铁直达：市区乘旅游专线/包车（约 1-1.5 小时）最省心；市郊铁路（北京北站方向）以当期运营为准",
  "打车在机场/火车站用正规网约车或排队出租车，别坐黑车"
];
