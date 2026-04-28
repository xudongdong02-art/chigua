-- ============================================================
-- 吃瓜平台种子数据
-- 粘贴到 Supabase SQL Editor → Run
-- ============================================================

-- 插入事件
INSERT INTO events (title, subtitle, cover_image, heat, tag, publish_date, read_time, summary, status) VALUES
('顶流明星塌房始末', '一段录音引发的舆论海啸', 'https://picsum.photos/seed/event001/1200/600', 9820000, '娱乐', '2026-04-25', '约需 12 分钟', '某顶流男星被曝私生活丑闻，一段长达47分钟的录音在各大平台疯传。事件在48小时内持续发酵，多个品牌连夜解约，粉丝与路人展开激烈对抗。', 'published'),
('某科技公司数据泄露风暴', '5亿用户数据在暗网流通', 'https://picsum.photos/seed/event002/1200/600', 8760000, '科技', '2026-04-24', '约需 8 分钟', '某知名科技公司被曝发生大规模数据泄露，约5亿用户信息在暗网流通，其中包括邮箱、手机号、甚至部分支付信息。公司随后发表声明称已启动调查。', 'published'),
('上市公司财务造假内幕', '一份审计报告撕开的遮羞布', 'https://picsum.photos/seed/event003/1200/600', 6540000, '财经', '2026-04-23', '约需 15 分钟', '某A股上市公司被知名做空机构发布长达80页的做空报告，指控其连续三年财务造假，虚增收入数十亿。股价当日跌停，证监会宣布介入调查。', 'published'),
('某地突现大规模群体事件', '一条热搜引发的连锁反应', 'https://picsum.photos/seed/event004/1200/600', 12000000, '社会', '2026-04-27', '约需 6 分钟', '某地区因一起普通纠纷引发大规模群体聚集，事件在微博热搜被短暂压制后，因微信群的传播而在数小时内全国皆知。多个现场视频在各个平台被删除，但在本平台完整保留。', 'published'),
('某国大选黑客干预疑云', '投票结果公布前的72小时', 'https://picsum.photos/seed/event005/1200/600', 5430000, '国际', '2026-04-22', '约需 20 分钟', '某大国临近大选投票日，多国情报机构发布联合声明，称有高度可信证据显示某外国政府正在对该国选举基础设施发动网络攻击。事件搅动全球资本市场。', 'published');

-- 获取刚插入的事件ID（按顺序）
DO $$
DECLARE
  e1 UUID;
  e2 UUID;
  e3 UUID;
  e4 UUID;
  e5 UUID;
BEGIN
  SELECT id INTO e1 FROM events WHERE title = '顶流明星塌房始末' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO e2 FROM events WHERE title = '某科技公司数据泄露风暴' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO e3 FROM events WHERE title = '上市公司财务造假内幕' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO e4 FROM events WHERE title = '某地突现大规模群体事件' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO e5 FROM events WHERE title = '某国大选黑客干预疑云' ORDER BY created_at DESC LIMIT 1;

  -- 顶流明星视频
  INSERT INTO event_videos (event_id, title, duration, description, thumbnail, video_url) VALUES
  (e1, '完整录音曝光（47分钟）', '47:23', '完整版录音，包含当事人对多个敏感话题的言论。', 'https://picsum.photos/seed/v001a/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
  (e1, '品牌解约发布会现场', '08:15', '涉事明星代言的多家品牌连夜召开紧急发布会现场画面。', 'https://picsum.photos/seed/v001b/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4');

  -- 科技公司视频
  INSERT INTO event_videos (event_id, title, duration, description, thumbnail, video_url) VALUES
  (e2, '数据泄露技术分析（安全专家解读）', '15:42', '独立安全研究员对泄露数据的技术分析。', 'https://picsum.photos/seed/v002a/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  -- 财务造假视频
  INSERT INTO event_videos (event_id, title, duration, description, thumbnail, video_url) VALUES
  (e3, '做空报告核心指控3分钟速览', '03:22', '80页做空报告精华提炼。', 'https://picsum.photos/seed/v003a/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'),
  (e3, '股价闪崩现场画面', '02:47', '做空报告发布次日，股价开盘即跌停。', 'https://picsum.photos/seed/v003b/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4');

  -- 群体事件视频
  INSERT INTO event_videos (event_id, title, duration, description, thumbnail, video_url) VALUES
  (e4, '现场完整视频（未被删节版）', '22:18', '网友在现场拍摄的多角度完整记录，其他平台均已被删除。', 'https://picsum.photos/seed/v004a/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4');

  -- 大选视频
  INSERT INTO event_videos (event_id, title, duration, description, thumbnail, video_url) VALUES
  (e5, '情报机构联合声明发布会', '34:05', '五眼联盟情报机构联合发布会完整录像。', 'https://picsum.photos/seed/v005a/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'),
  (e5, '专家解读：攻击路径还原', '18:33', '网络安全专家基于泄露技术指标重建攻击路径。', 'https://picsum.photos/seed/v005b/800/450', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4');

  -- 顶流明星文档
  INSERT INTO event_documents (event_id, title, doc_type, size, description) VALUES
  (e1, '录音文字转录全文.pdf', 'PDF', '2.3 MB', '47分钟录音完整文字转录，逐字校对标注时间戳。'),
  (e1, '涉事品牌清单与合同条款.pdf', 'PDF', '1.1 MB', '该明星全部代言品牌一览，含合同违约金估算。');

  -- 科技公司文档
  INSERT INTO event_documents (event_id, title, doc_type, size, description) VALUES
  (e2, '泄露数据样本分析.pdf', 'PDF', '3.8 MB', '安全社区对泄露数据的结构化分析，含字段说明。'),
  (e2, '受影响用户地区分布.png', '截图', '420 KB', '泄露数据中用户地区分布热力图。');

  -- 财务造假文档
  INSERT INTO event_documents (event_id, title, doc_type, size, description) VALUES
  (e3, '做空报告全文（中文翻译版）.pdf', 'PDF', '12.4 MB', '80页做空报告完整中文翻译，附关键数据截图。'),
  (e3, '涉事公司历年财报对比.xlsx', 'Excel', '1.6 MB', '做空报告指控数据与公司历年财报进行对比标注。');

  -- 群体事件文档
  INSERT INTO event_documents (event_id, title, doc_type, size, description) VALUES
  (e4, '事件完整时间线梳理.pdf', 'PDF', '890 KB', '多名现场亲历者口述整理的事件完整经过，含多信源交叉验证。');

  -- 大选文档
  INSERT INTO event_documents (event_id, title, doc_type, size, description) VALUES
  (e5, '联合声明原文（英文）.pdf', 'PDF', '540 KB', '五眼联盟情报机构联合声明英文原版。'),
  (e5, '历史黑客干预事件时间线.pdf', 'PDF', '2.8 MB', '2016年至今全球主要选举干预事件汇编报告。');

  -- 顶流明星时间线
  INSERT INTO event_timelines (event_id, event_time, title, description, source) VALUES
  (e1, '4月24日 19:30', '录音片段首次流出', '某微博小号首次发布录音片段，约3分钟，引发第一波关注。', '微博'),
  (e1, '4月24日 21:00', '录音完整版全网扩散', '完整47分钟录音在微博、抖音、小红书同时出现，多个相关话题冲上热搜。', '全网'),
  (e1, '4月24日 23:45', '首位品牌宣布解约', '某国际美妆品牌率先发布声明，终止与该明星一切合作关系。', '品牌官方声明'),
  (e1, '4月25日 02:00', '明星工作室发律师函', '工作室发布律师函，称录音系恶意剪辑拼接，已委托律师起诉首发账号。', '工作室声明'),
  (e1, '4月25日 08:00', '网友曝出更多疑似当事人聊天记录', '多位自称知情人的网友在微博发布截图，多个爆料仍在核实中。', '微博/抖音'),
  (e1, '4月25日 14:00', '第二、第三品牌跟进解约', '累计三家品牌宣布解约。据估算，违约金总额或超亿元。', '官方声明'),
  (e1, '4月25日 19:00', '官方媒体发表评论', '多家官媒转发相关报道，评论措辞严厉，事件进一步升级。', '官方媒体');

  -- 科技公司时间线
  INSERT INTO event_timelines (event_id, event_time, title, description, source) VALUES
  (e2, '4月23日 03:17', '黑客在暗网论坛发布数据', '昵称为DarkVault的黑客在暗网论坛发帖，声称手握某科技公司5亿用户数据。', '暗网'),
  (e2, '4月23日 09:00', '国内安全社区发现并转发', '国内白帽黑客在朋友圈和技术社群转发该消息，开始核实真伪。', '安全社区'),
  (e2, '4月23日 15:30', '公司回应已启动紧急调查', '公关部发布声明，称已第一时间启动应急响应，但未正面承认数据泄露。', '官方声明'),
  (e2, '4月24日 10:00', '多名用户反映收到钓鱼短信', '大量用户开始在社交平台反映收到疑似钓鱼短信，内容与泄露数据吻合。', '用户反馈');

  -- 财务造假时间线
  INSERT INTO event_timelines (event_id, event_time, title, description, source) VALUES
  (e3, '4月22日 16:00', '做空机构发布报告', '某知名做空机构在官网发布80页做空报告，同步在Twitter和微博发布摘要。', '做空机构'),
  (e3, '4月22日 16:30', '公司申请临时停牌', '涉事公司向交易所申请临时停牌，理由为待披露重大事项。', '交易所公告'),
  (e3, '4月23日 09:00', '证监会宣布介入调查', '证监会发布简短公告，称正在核查。', '证监会'),
  (e3, '4月23日 11:00', '网友扒出公司官网已删除的旧页面', '网友通过Wayback Machine发现公司官网曾删除了大量客户案例，与做空报告指控吻合。', '网友');

  -- 群体事件时间线
  INSERT INTO event_timelines (event_id, event_time, title, description, source) VALUES
  (e4, '4月27日 08:30', '起因：一起普通纠纷', '某商业区因消费者与商户的纠纷，引发肢体冲突。', '目击者'),
  (e4, '4月27日 09:15', '事态升级', '冲突升级，双方均有人受伤，大批路人围观拍摄。', '现场视频'),
  (e4, '4月27日 10:00', '微博热搜被撤', '#某地事件# 冲上热搜第3位，约20分钟后消失。相关话题被限制。', '网友记录'),
  (e4, '4月27日 11:00', '微信群大规模传播', '大量现场视频、图片通过微信群在全国范围传播，多个视频被删除。', '微信'),
  (e4, '4月27日 14:00', '官方发布情况通报', '当地政府召开新闻发布会，发布事件情况通报，定性为群体性聚集事件。', '官方');

  -- 大选时间线
  INSERT INTO event_timelines (event_id, event_time, title, description, source) VALUES
  (e5, '4月20日 08:00', '投票日前三天：警报响起', '某国选举安全部门截获异常网络流量警报，发现针对选举注册系统的探测行为。', '情报来源'),
  (e5, '4月21日 20:00', '五眼联盟发布联合声明', '美、英、加、澳、新五国情报机构联合召开发布会，公布干预证据。', '联合声明'),
  (e5, '4月22日 06:00', '涉事国否认并反指', '被指控国召开新闻发布会，否认所有指控，反指对方贼喊捉贼。', '涉事国'),
  (e5, '4月22日 14:00', '市场剧震', '全球资本市场大幅波动，该国货币汇率单日跌幅创近年新高。', '金融数据');

  RAISE NOTICE '✅ 种子数据插入完成！';
END $$;
