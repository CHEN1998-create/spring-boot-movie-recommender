import type { Movie } from '../types'

/**
 * 海报图：使用平台文生图服务按主题生成，骨架阶段无需本地素材。
 * 后续接接口时替换为后端返回的 poster_url 即可。
 */
const poster = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt + ', cinematic movie poster, portrait composition, dramatic lighting, film grain',
  )}&image_size=portrait_4_3`

/** 首页主视觉背景 */
export const heroBackdrop =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'dark cinematic film festival backdrop, moody theater with projector light beam and floating dust, deep navy and amber tones, wide',
  ) +
  '&image_size=landscape_16_9'

export const ALL_TAGS = [
  '科幻', '悬疑', '剧情', '动画', '喜剧', '爱情', '犯罪', '冒险', '奇幻', '动作', '灾难', '传记', '文艺', '惊悚', '历史',
]

export const movies: Movie[] = [
  {
    id: 1,
    title: '星际穿越',
    originalTitle: 'Interstellar',
    year: 2014,
    duration: 169,
    director: '克里斯托弗·诺兰',
    cast: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦'],
    region: '美国 / 英国',
    summary:
      '在不远的未来，地球粮食危机蔓延，前宇航员库珀受命穿越虫洞，为人类寻找新的家园。爱与引力，是唯一能跨越维度的语言。',
    tags: ['科幻', '冒险', '剧情'],
    rating: 9.4,
    ratingCount: 12846,
    posterUrl: poster('epic sci-fi movie poster, astronaut standing before a giant black hole with glowing accretion disk, vast space'),
    createdAt: '2026-03-02 10:24',
  },
  {
    id: 2,
    title: '盗梦空间',
    originalTitle: 'Inception',
    year: 2010,
    duration: 148,
    director: '克里斯托弗·诺兰',
    cast: ['莱昂纳多·迪卡普里奥', '约瑟夫·高登-莱维特', '艾伦·佩吉'],
    region: '美国 / 英国',
    summary:
      '造梦师柯布率领团队潜入层层梦境执行"植入"任务，梦境越深，时间越慢，而他的内心秘密也步步逼近。',
    tags: ['科幻', '悬疑', '动作'],
    rating: 9.3,
    ratingCount: 15602,
    posterUrl: poster('surreal movie poster, city skyline folding like paper above mirror street, dream layers, deep blue tones'),
    createdAt: '2026-03-02 10:31',
  },
  {
    id: 3,
    title: '千与千寻',
    originalTitle: '千と千尋の神隠し',
    year: 2001,
    duration: 125,
    director: '宫崎骏',
    cast: ['柊瑠美', '入野自由', '夏木真理'],
    region: '日本',
    summary:
      '少女千寻误入神灵世界的汤屋，为了拯救变成猪的父母，她在光怪陆离的世界里打工、成长，记住了自己的名字。',
    tags: ['动画', '奇幻', '冒险'],
    rating: 9.4,
    ratingCount: 18234,
    posterUrl: poster('whimsical anime movie poster, little girl on a lantern-lit boat crossing a night sea, floating spirits, warm glow'),
    createdAt: '2026-03-02 11:02',
  },
  {
    id: 4,
    title: '寄生虫',
    originalTitle: '기생충',
    year: 2019,
    duration: 132,
    director: '奉俊昊',
    cast: ['宋康昊', '李善均', '曹如晶'],
    region: '韩国',
    summary:
      '底层的金家四口一步步"寄生"进富豪朴家，一场暴雨之夜，两个家庭、两个阶层的裂痕轰然崩塌。',
    tags: ['剧情', '悬疑', '惊悚'],
    rating: 8.8,
    ratingCount: 11987,
    posterUrl: poster('dark satire movie poster, modern glass house on a hill half sunk into ground, moody rainy night'),
    createdAt: '2026-03-05 09:12',
  },
  {
    id: 5,
    title: '流浪地球',
    originalTitle: 'The Wandering Earth',
    year: 2019,
    duration: 125,
    director: '郭帆',
    cast: ['屈楚萧', '吴京', '李光洁'],
    region: '中国大陆',
    summary:
      '太阳急速膨胀，人类在地球表面建造万座行星发动机，推动地球踏上流浪之旅。饱和式救援，是刻进骨子里的浪漫。',
    tags: ['科幻', '灾难', '剧情'],
    rating: 8.0,
    ratingCount: 9876,
    posterUrl: poster('sci-fi disaster movie poster, colossal planetary engines pushing planet earth, frozen city skyline, epic scale'),
    createdAt: '2026-03-05 09:20',
  },
  {
    id: 6,
    title: '肖申克的救赎',
    originalTitle: 'The Shawshank Redemption',
    year: 1994,
    duration: 142,
    director: '弗兰克·德拉邦特',
    cast: ['蒂姆·罗宾斯', '摩根·弗里曼'],
    region: '美国',
    summary:
      '银行家安迪蒙冤入狱，用二十年凿开一条通往自由的隧道。有些鸟儿注定关不住，因为它们的每一片羽毛都闪着自由的光辉。',
    tags: ['剧情', '犯罪'],
    rating: 9.7,
    ratingCount: 23150,
    posterUrl: poster('hopeful drama movie poster, man in prison uniform raising arms in rain under stone walls, dramatic breaking storm sky'),
    createdAt: '2026-03-08 14:45',
  },
  {
    id: 7,
    title: '让子弹飞',
    originalTitle: 'Let the Bullets Fly',
    year: 2010,
    duration: 132,
    director: '姜文',
    cast: ['姜文', '葛优', '周润发'],
    region: '中国大陆 / 香港',
    summary:
      '土匪张麻子摇身变县长，与恶霸黄四郎在鹅城斗智斗勇。让子弹飞一会儿——站着，也能把钱挣了。',
    tags: ['剧情', '喜剧', '历史'],
    rating: 9.0,
    ratingCount: 13421,
    posterUrl: poster('stylized vintage movie poster, steam train and horses racing along mountain railway at sunset, bold graphic colors'),
    createdAt: '2026-03-10 16:08',
  },
  {
    id: 8,
    title: '疯狂动物城',
    originalTitle: 'Zootopia',
    year: 2016,
    duration: 108,
    director: '拜伦·霍华德',
    cast: ['金妮弗·古德温', '杰森·贝特曼'],
    region: '美国',
    summary:
      '兔子朱迪成为动物城第一位警官，与狐狸尼克联手侦破失踪案。在这里，任何动物都有无限可能。',
    tags: ['动画', '喜剧', '冒险'],
    rating: 9.2,
    ratingCount: 15023,
    posterUrl: poster('colorful animation movie poster, cheerful rabbit police officer in a vibrant animal metropolis, sunny sky'),
    createdAt: '2026-03-12 10:55',
  },
  {
    id: 9,
    title: '头号玩家',
    originalTitle: 'Ready Player One',
    year: 2018,
    duration: 140,
    director: '史蒂文·斯皮尔伯格',
    cast: ['泰尔·谢里丹', '奥利维亚·库克'],
    region: '美国',
    summary:
      '2045 年，人们沉溺于虚拟世界"绿洲"。少年韦德解开创始人留下的三把钥匙之谜，在彩蛋与危机之间拯救现实。',
    tags: ['科幻', '冒险', '动作'],
    rating: 8.5,
    ratingCount: 8764,
    posterUrl: poster('neon cyberpunk movie poster, avatar with VR goggles racing futuristic cars through digital city, pop culture montage'),
    createdAt: '2026-03-15 11:30',
  },
  {
    id: 10,
    title: '隐入尘烟',
    originalTitle: 'Return to Dust',
    year: 2022,
    duration: 133,
    director: '李睿珺',
    cast: ['武仁林', '海清'],
    region: '中国大陆',
    summary:
      '西北农村，两个被各自家庭抛弃的孤独个体，在日复一日的劳作中相濡以沫。土地长出粮食，也长出笨拙而深沉的爱。',
    tags: ['剧情', '文艺'],
    rating: 8.4,
    ratingCount: 5432,
    posterUrl: poster('minimal arthouse movie poster, two farmers standing in a golden wheat field at dusk, muted earth tones, quiet'),
    createdAt: '2026-03-18 15:40',
  },
  {
    id: 11,
    title: '沙丘',
    originalTitle: 'Dune',
    year: 2021,
    duration: 155,
    director: '丹尼斯·维伦纽瓦',
    cast: ['提莫西·查拉梅', '丽贝卡·弗格森', '赞达亚'],
    region: '美国',
    summary:
      '厄崔迪家族接管沙漠星球厄拉科斯，少年保罗在香料、沙虫与阴谋之间，逐步走向命运预见的未来。',
    tags: ['科幻', '冒险'],
    rating: 8.2,
    ratingCount: 9210,
    posterUrl: poster('desert epic movie poster, cloaked figure standing on vast sand dune, giant worm shadow beneath, orange sun'),
    createdAt: '2026-03-20 09:05',
  },
  {
    id: 12,
    title: '白日梦想家',
    originalTitle: 'The Secret Life of Walter Mitty',
    year: 2013,
    duration: 114,
    director: '本·斯蒂勒',
    cast: ['本·斯蒂勒', '克里斯汀·韦格'],
    region: '美国',
    summary:
      '爱做白日梦的底片管理员为寻找"第 25 号底片"踏上环球之旅，从格陵兰到喜马拉雅，把幻想活成了现实。',
    tags: ['剧情', '喜剧', '冒险'],
    rating: 8.6,
    ratingCount: 7654,
    posterUrl: poster('adventure movie poster, man longboarding down an empty mountain road, paper plane flying overhead, bright clean light'),
    createdAt: '2026-03-22 13:18',
  },
  {
    id: 13,
    title: '看不见的客人',
    originalTitle: 'Contratiempo',
    year: 2016,
    duration: 106,
    director: '奥里奥尔·保罗',
    cast: ['马里奥·卡萨斯', '阿娜·瓦格纳'],
    region: '西班牙',
    summary:
      '企业家艾德里安被控杀人，金牌女律师连夜赶来梳理证词。每一次陈述都是一次反转，直到最后一张牌翻开。',
    tags: ['悬疑', '惊悚', '犯罪'],
    rating: 8.8,
    ratingCount: 10234,
    posterUrl: poster('dark thriller movie poster, silhouetted lawyer behind rainy window with reflections, scattered photographs, cold light'),
    createdAt: '2026-03-25 17:26',
  },
  {
    id: 14,
    title: '怦然心动',
    originalTitle: 'Flipped',
    year: 2010,
    duration: 90,
    director: '罗伯·莱纳',
    cast: ['玛德琳·卡罗尔', '卡兰·麦克奥利菲'],
    region: '美国',
    summary:
      '朱莉从梧桐树上看见整片风景，也看见了布莱斯眼中的怯懦。斯人若彩虹，遇上方知有。',
    tags: ['剧情', '喜剧', '爱情'],
    rating: 9.1,
    ratingCount: 14520,
    posterUrl: poster('warm romantic movie poster, giant sycamore tree over small town rooftops at golden hour, young couple, pastel tones'),
    createdAt: '2026-04-01 10:10',
  },
  {
    id: 15,
    title: '信条',
    originalTitle: 'Tenet',
    year: 2020,
    duration: 150,
    director: '克里斯托弗·诺兰',
    cast: ['约翰·大卫·华盛顿', '罗伯特·帕丁森'],
    region: '美国 / 英国',
    summary:
      '一项关乎时间逆转的绝密任务，子弹倒飞、汽车复原，主角必须在正向与逆向世界里同时阻止第三次世界大战。',
    tags: ['科幻', '动作', '悬疑'],
    rating: 7.8,
    ratingCount: 6543,
    posterUrl: poster('inverted time movie poster, mirrored bullet trails and shattering glass, architectural symmetry, teal and orange'),
    createdAt: '2026-04-03 14:52',
  },
  {
    id: 16,
    title: '完美的日子',
    originalTitle: 'Perfect Days',
    year: 2023,
    duration: 123,
    director: '维姆·文德斯',
    cast: ['役所广司'],
    region: '日本 / 德国',
    summary:
      '东京公厕清洁工平山过着秩序井然的日子：工作、拍树影、听磁带、读小说。木漏れ日の下，日常本身即是圆满。',
    tags: ['剧情', '文艺'],
    rating: 8.5,
    ratingCount: 4321,
    posterUrl: poster('quiet slice of life movie poster, tokyo alley in morning light, hanging laundry and an old cassette tape, soft film look'),
    createdAt: '2026-04-08 11:44',
  },
  {
    id: 17,
    title: '蜘蛛侠：纵横宇宙',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    duration: 140,
    director: '华金·多斯·桑托斯',
    cast: ['沙梅克·摩尔', '海莉·斯坦菲尔德'],
    region: '美国',
    summary:
      '迈尔斯闯入蜘蛛联盟总部，面对整个多元宇宙的"既定剧本"，他偏要撕开命运的裂缝，走出自己的那一格。',
    tags: ['动画', '动作', '科幻'],
    rating: 8.9,
    ratingCount: 8877,
    posterUrl: poster('dynamic animation movie poster, spider hero swinging across a glitch-art multiverse cityscape, vivid graffiti colors'),
    createdAt: '2026-04-12 16:36',
  },
  {
    id: 18,
    title: '奥本海默',
    originalTitle: 'Oppenheimer',
    year: 2023,
    duration: 180,
    director: '克里斯托弗·诺兰',
    cast: ['基里安·墨菲', '艾米莉·布朗特', '小罗伯特·唐尼'],
    region: '美国 / 英国',
    summary:
      '"原子弹之父"奥本海默的崛起与审判。当他点燃那团火，世界从此不同，而普罗米修斯也终将被缚。',
    tags: ['传记', '剧情', '历史'],
    rating: 8.9,
    ratingCount: 9655,
    posterUrl: poster('historical biopic movie poster, silhouette of a man before a colossal fiery explosion, smoke and embers, black and white portraits'),
    createdAt: '2026-04-15 10:02',
  },
]

/** 按 id 取电影 */
export const getMovie = (id: number) => movies.find((m) => m.id === id)

/** 首页热门榜：按评分取前 8 */
export const hotMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8)

/** 首页最新入库：按创建时间取前 6 */
export const recentMovies = [...movies]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice(0, 6)
