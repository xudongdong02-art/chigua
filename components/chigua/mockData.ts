export interface TimelineEvent {
  time: string
  title: string
  description: string
  source?: string
}

export interface VideoItem {
  id: string
  title: string
  duration: string
  description: string
  thumbnail: string
  videoUrl: string
}

export interface DocumentItem {
  id: string
  title: string
  type: 'PDF' | 'Word' | 'Excel' | '截图'
  size: string
  description: string
  previewUrl?: string
}

export interface HotEvent {
  id: string
  title: string
  subtitle: string
  coverImage: string
  heat: number // 热度值
  tag: '娱乐' | '科技' | '财经' | '社会' | '国际'
  tagColor?: 'red' | 'amber'
  publishDate: string
  readTime: string
  summary: string
  videos: VideoItem[]
  documents: DocumentItem[]
  timeline: TimelineEvent[]
  relatedEvents: string[] // event ids
}

export const hotEvents: HotEvent[] = [
  {
    id: 'event-001',
    title: '顶流明星塌房始末',
    subtitle: '一段录音引发的舆论海啸',
    coverImage: 'https://picsum.photos/seed/event001/1200/600',
    heat: 9820000,
    tag: '娱乐',
    tagColor: 'red',
    publishDate: '2026-04-25',
    readTime: '约需 12 分钟',
    summary: '某顶流男星被曝私生活丑闻，一段长达47分钟的录音在各大平台疯传。事件在48小时内持续发酵，多个品牌连夜解约，粉丝与路人展开激烈对抗。',
    videos: [
      {
        id: 'v1',
        title: '完整录音曝光（47分钟）',
        duration: '47:23',
        description: '完整版录音，包含当事人对多个敏感话题的言论。该录音由匿名信源提供给某自媒体，后经多方核实确认为原始音频。',
        thumbnail: 'https://picsum.photos/seed/v001a/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      {
        id: 'v2',
        title: '品牌解约发布会现场',
        duration: '08:15',
        description: '涉事明星代言的多家品牌连夜召开紧急发布会，宣布即日起解除所有合作关系。现场画面显示工作人员连夜更换物料。',
        thumbnail: 'https://picsum.photos/seed/v001b/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      },
    ],
    documents: [
      {
        id: 'd1',
        title: '录音文字转录全文.pdf',
        type: 'PDF',
        size: '2.3 MB',
        description: '47分钟录音的完整文字转录，由专业机构逐字校对，标注了时间戳。',
        previewUrl: '#',
      },
      {
        id: 'd2',
        title: '涉事品牌清单与合同条款.pdf',
        type: 'PDF',
        size: '1.1 MB',
        description: '该明星全部代言品牌一览，含合同违约金估算。',
        previewUrl: '#',
      },
      {
        id: 'd3',
        title: '粉丝社群传播路径分析.png',
        type: '截图',
        size: '856 KB',
        description: '事件在不同粉丝群体中的传播时间线和关键节点。',
        previewUrl: '#',
      },
    ],
    timeline: [
      {
        time: '4月24日 19:30',
        title: '录音片段首次流出',
        description: '某微博小号首次发布录音片段，约3分钟，引发第一波关注。',
        source: '微博',
      },
      {
        time: '4月24日 21:00',
        title: '录音完整版全网扩散',
        description: '完整47分钟录音在微博、抖音、小红书同时出现，多个相关话题冲上热搜。',
        source: '全网',
      },
      {
        time: '4月24日 23:45',
        title: '首位品牌宣布解约',
        description: '某国际美妆品牌率先发布声明，终止与该明星一切合作关系。',
        source: '品牌官方声明',
      },
      {
        time: '4月25日 02:00',
        title: '明星工作室发律师函',
        description: '工作室发布律师函，称录音系"恶意剪辑拼接"，已委托律师起诉首发账号。',
        source: '工作室声明',
      },
      {
        time: '4月25日 08:00',
        title: '网友曝出更多疑似当事人聊天记录',
        description: '多位自称知情人的网友在微博发布更多截图，多个爆料仍在核实中。',
        source: '微博/抖音',
      },
      {
        time: '4月25日 14:00',
        title: '第二、第三品牌跟进解约',
        description: '累计三家品牌宣布解约。据估算，违约金总额或超亿元。',
        source: '官方声明',
      },
      {
        time: '4月25日 19:00',
        title: '官方媒体发表评论',
        description: '多家官媒转发相关报道，评论措辞严厉，事件进一步升级。',
        source: '官方媒体',
      },
    ],
    relatedEvents: ['event-002', 'event-003'],
  },
  {
    id: 'event-002',
    title: '某科技公司数据泄露风暴',
    subtitle: '5亿用户数据在暗网流通',
    coverImage: 'https://picsum.photos/seed/event002/1200/600',
    heat: 8760000,
    tag: '科技',
    tagColor: 'amber',
    publishDate: '2026-04-24',
    readTime: '约需 8 分钟',
    summary: '某知名科技公司被曝发生大规模数据泄露，约5亿用户信息在暗网流通，其中包括邮箱、手机号、甚至部分支付信息。公司随后发表声明称"已启动调查"。',
    videos: [
      {
        id: 'v3',
        title: '数据泄露技术分析（安全专家解读）',
        duration: '15:42',
        description: '独立安全研究员对泄露数据的技术分析，包括数据结构、加密方式推测。',
        thumbnail: 'https://picsum.photos/seed/v002a/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
    ],
    documents: [
      {
        id: 'd4',
        title: '泄露数据样本分析.pdf',
        type: 'PDF',
        size: '3.8 MB',
        description: '安全社区对泄露数据的结构化分析，含字段说明和数据样本。',
        previewUrl: '#',
      },
      {
        id: 'd5',
        title: '受影响用户地区分布.png',
        type: '截图',
        size: '420 KB',
        description: '泄露数据中用户地区分布热力图。',
        previewUrl: '#',
      },
    ],
    timeline: [
      {
        time: '4月23日 03:17',
        title: '黑客在暗网论坛发布数据',
        description: '昵称为"DarkVault"的黑客在暗网论坛发帖，声称手握某科技公司5亿用户数据。',
        source: '暗网',
      },
      {
        time: '4月23日 09:00',
        title: '国内安全社区发现并转发',
        description: '国内白帽黑客在朋友圈和技术社群转发该消息，开始核实真伪。',
        source: '安全社区',
      },
      {
        time: '4月23日 15:30',
        title: '公司回应"已启动紧急调查"',
        description: '公司公关部发布声明，称"已第一时间启动应急响应"，但未正面承认数据泄露。',
        source: '官方声明',
      },
      {
        time: '4月24日 10:00',
        title: '多名用户反映收到钓鱼短信',
        description: '大量用户开始在社交平台反映收到疑似钓鱼短信，内容与泄露数据吻合。',
        source: '用户反馈',
      },
    ],
    relatedEvents: ['event-001'],
  },
  {
    id: 'event-003',
    title: '上市公司财务造假内幕',
    subtitle: '一份审计报告撕开的遮羞布',
    coverImage: 'https://picsum.photos/seed/event003/1200/600',
    heat: 6540000,
    tag: '财经',
    tagColor: 'red',
    publishDate: '2026-04-23',
    readTime: '约需 15 分钟',
    summary: '某A股上市公司被知名做空机构发布长达80页的做空报告，指控其连续三年财务造假，虚增收入数十亿。股价当日跌停，证监会宣布介入调查。',
    videos: [
      {
        id: 'v4',
        title: '做空报告核心指控3分钟速览',
        duration: '03:22',
        description: '80页做空报告的精华提炼，三分钟了解核心指控要点。',
        thumbnail: 'https://picsum.photos/seed/v003a/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      },
      {
        id: 'v5',
        title: '股价闪崩现场画面',
        duration: '02:47',
        description: '做空报告发布次日，涉事股票开盘即跌停，全天封死跌停板。',
        thumbnail: 'https://picsum.photos/seed/v003b/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
    ],
    documents: [
      {
        id: 'd6',
        title: '做空报告全文（中文翻译版）.pdf',
        type: 'PDF',
        size: '12.4 MB',
        description: '80页做空报告完整中文翻译，附关键数据截图。',
        previewUrl: '#',
      },
      {
        id: 'd7',
        title: '涉事公司历年财报对比.xlsx',
        type: 'Excel',
        size: '1.6 MB',
        description: '将做空报告指控数据与公司历年财报进行对比标注。',
        previewUrl: '#',
      },
      {
        id: 'd8',
        title: '涉事高管关系图谱.png',
        type: '截图',
        size: '2.1 MB',
        description: '公司实控人、高管与上下游客户之间的股权与关联交易关系图。',
        previewUrl: '#',
      },
    ],
    timeline: [
      {
        time: '4月22日 16:00',
        title: '做空机构发布报告',
        description: '某知名做空机构在官网发布80页做空报告，同步在Twitter和微博发布摘要。',
        source: '做空机构',
      },
      {
        time: '4月22日 16:30',
        title: '公司申请临时停牌',
        description: '涉事公司向交易所申请临时停牌，理由为"待披露重大事项"。',
        source: '交易所公告',
      },
      {
        time: '4月23日 09:00',
        title: '证监会宣布介入调查',
        description: '证监会发布简短公告，称"已关注到相关报道，正在核查"。',
        source: '证监会',
      },
      {
        time: '4月23日 11:00',
        title: '网友扒出公司官网已删除的旧页面',
        description: '网友通过Wayback Machine发现公司官网曾删除了大量客户案例，与做空报告指控吻合。',
        source: '网友',
      },
    ],
    relatedEvents: [],
  },
  {
    id: 'event-004',
    title: '某地突现大规模群体事件',
    subtitle: '一条热搜引发的连锁反应',
    coverImage: 'https://picsum.photos/seed/event004/1200/600',
    heat: 12000000,
    tag: '社会',
    tagColor: 'red',
    publishDate: '2026-04-27',
    readTime: '约需 6 分钟',
    summary: '某地区因一起普通纠纷引发大规模群体聚集，事件在微博热搜被短暂压制后，因微信群的传播而在数小时内全国皆知。多个现场视频在各个平台被删除，但在本平台完整保留。',
    videos: [
      {
        id: 'v6',
        title: '现场完整视频（未被删节版）',
        duration: '22:18',
        description: '网友在现场拍摄的多角度完整记录。该视频在其他平台均已被删除。',
        thumbnail: 'https://picsum.photos/seed/v004a/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      },
    ],
    documents: [
      {
        id: 'd9',
        title: '事件完整时间线梳理.pdf',
        type: 'PDF',
        size: '890 KB',
        description: '由多名现场亲历者口述整理的事件完整经过，含多个信源交叉验证。',
        previewUrl: '#',
      },
    ],
    timeline: [
      {
        time: '4月27日 08:30',
        title: '起因：一起普通纠纷',
        description: '某商业区因一起消费者与商户的纠纷，引发肢体冲突。',
        source: '目击者',
      },
      {
        time: '4月27日 09:15',
        title: '事态升级',
        description: '冲突升级，商户员工与消费者双方均有人受伤，大批路人围观拍摄。',
        source: '现场视频',
      },
      {
        time: '4月27日 10:00',
        title: '微博热搜被撤',
        description: '#某地事件# 冲上热搜第3位，约20分钟后消失。相关话题被限制。',
        source: '网友记录',
      },
      {
        time: '4月27日 11:00',
        title: '微信群大规模传播',
        description: '大量现场视频、图片通过微信群在全国范围传播，多个现场视频被删除。',
        source: '微信',
      },
      {
        time: '4月27日 14:00',
        title: '官方发布情况通报',
        description: '当地政府召开新闻发布会，发布事件情况通报，定性为"群体性聚集事件"。',
        source: '官方',
      },
    ],
    relatedEvents: [],
  },
  {
    id: 'event-005',
    title: '某国大选"黑客干预"疑云',
    subtitle: '投票结果公布前的72小时',
    coverImage: 'https://picsum.photos/seed/event005/1200/600',
    heat: 5430000,
    tag: '国际',
    tagColor: 'amber',
    publishDate: '2026-04-22',
    readTime: '约需 20 分钟',
    summary: '某大国临近大选投票日，多国情报机构发布联合声明，称有"高度可信证据"显示某外国政府正在对该国选举基础设施发动网络攻击。事件搅动全球资本市场，大选结果悬而未决。',
    videos: [
      {
        id: 'v7',
        title: '情报机构联合声明发布会',
        duration: '34:05',
        description: '五眼联盟情报机构联合发布会完整录像，公布关键证据片段。',
        thumbnail: 'https://picsum.photos/seed/v005a/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      },
      {
        id: 'v8',
        title: '专家解读：攻击路径还原',
        duration: '18:33',
        description: '网络安全专家基于泄露的技术指标，重建攻击路径。',
        thumbnail: 'https://picsum.photos/seed/v005b/800/450',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      },
    ],
    documents: [
      {
        id: 'd10',
        title: '联合声明原文（英文）.pdf',
        type: 'PDF',
        size: '540 KB',
        description: '五眼联盟情报机构联合声明英文原版。',
        previewUrl: '#',
      },
      {
        id: 'd11',
        title: '历史黑客干预事件时间线.pdf',
        type: 'PDF',
        size: '2.8 MB',
        description: '2016年至今全球主要选举干预事件汇编报告。',
        previewUrl: '#',
      },
    ],
    timeline: [
      {
        time: '4月20日 08:00',
        title: '投票日前三天：警报响起',
        description: '某国选举安全部门截获异常网络流量警报，发现针对选举注册系统的探测行为。',
        source: '情报来源',
      },
      {
        time: '4月21日 20:00',
        title: '五眼联盟发布联合声明',
        description: '美、英、加、澳、新五国情报机构联合召开发布会，公布干预证据。',
        source: '联合声明',
      },
      {
        time: '4月22日 06:00',
        title: '涉事国否认并反指',
        description: '被指控国召开新闻发布会，否认所有指控，反指对方"贼喊捉贼"。',
        source: '涉事国',
      },
      {
        time: '4月22日 14:00',
        title: '市场剧震',
        description: '全球资本市场大幅波动，该国货币汇率单日跌幅创近年新高。',
        source: '金融数据',
      },
    ],
    relatedEvents: [],
  },
]
