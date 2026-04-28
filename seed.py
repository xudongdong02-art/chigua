#!/usr/bin/env python3
import urllib.request
import json
import time

SUPABASE_URL = "https://kkbavftspaaiwlrzulzh.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrYmF2ZnRzcGFhaXdscnp1bHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODg2NDAsImV4cCI6MjA5MDA2NDY0MH0.AQCJhBVISxfnxyOPMRAAQakJLUOc2YvNhxmRpUUkbvE"
HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def post(table, data):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{table}",
        data=json.dumps(data).encode(),
        headers=HEADERS,
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

events = [
    {
        "title": "顶流明星塌房始末",
        "subtitle": "一段录音引发的舆论海啸",
        "cover_image": "https://picsum.photos/seed/event001/1200/600",
        "heat": 9820000,
        "tag": "娱乐",
        "publish_date": "2026-04-25",
        "read_time": "约需 12 分钟",
        "summary": "某顶流男星被曝私生活丑闻，一段长达47分钟的录音在各大平台疯传。事件在48小时内持续发酵，多个品牌连夜解约，粉丝与路人展开激烈对抗。",
        "status": "published"
    },
    {
        "title": "某科技公司数据泄露风暴",
        "subtitle": "5亿用户数据在暗网流通",
        "cover_image": "https://picsum.photos/seed/event002/1200/600",
        "heat": 8760000,
        "tag": "科技",
        "publish_date": "2026-04-24",
        "read_time": "约需 8 分钟",
        "summary": "某知名科技公司被曝发生大规模数据泄露，约5亿用户信息在暗网流通，其中包括邮箱、手机号、甚至部分支付信息。公司随后发表声明称已启动调查。",
        "status": "published"
    },
    {
        "title": "上市公司财务造假内幕",
        "subtitle": "一份审计报告撕开的遮羞布",
        "cover_image": "https://picsum.photos/seed/event003/1200/600",
        "heat": 6540000,
        "tag": "财经",
        "publish_date": "2026-04-23",
        "read_time": "约需 15 分钟",
        "summary": "某A股上市公司被知名做空机构发布长达80页的做空报告，指控其连续三年财务造假，虚增收入数十亿。股价当日跌停，证监会宣布介入调查。",
        "status": "published"
    },
    {
        "title": "某地突现大规模群体事件",
        "subtitle": "一条热搜引发的连锁反应",
        "cover_image": "https://picsum.photos/seed/event004/1200/600",
        "heat": 12000000,
        "tag": "社会",
        "publish_date": "2026-04-27",
        "read_time": "约需 6 分钟",
        "summary": "某地区因一起普通纠纷引发大规模群体聚集，事件在微博热搜被短暂压制后，因微信群的传播而在数小时内全国皆知。多个现场视频在各个平台被删除，但在本平台完整保留。",
        "status": "published"
    },
    {
        "title": "某国大选黑客干预疑云",
        "subtitle": "投票结果公布前的72小时",
        "cover_image": "https://picsum.photos/seed/event005/1200/600",
        "heat": 5430000,
        "tag": "国际",
        "publish_date": "2026-04-22",
        "read_time": "约需 20 分钟",
        "summary": "某大国临近大选投票日，多国情报机构发布联合声明，称有高度可信证据显示某外国政府正在对该国选举基础设施发动网络攻击。事件搅动全球资本市场。",
        "status": "published"
    },
]

# Insert events
event_ids = []
for ev in events:
    result = post("events", ev)
    eid = result[0]["id"]
    event_ids.append(eid)
    print(f"✓ Event: {ev['title'][:20]} → {eid[:8]}")

# Videos
videos_data = [
    # Event 0: 顶流明星
    (0, "完整录音曝光（47分钟）", "47:23", "完整版录音，包含当事人对多个敏感话题的言论。", "https://picsum.photos/seed/v001a/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"),
    (0, "品牌解约发布会现场", "08:15", "涉事明星代言的多家品牌连夜召开紧急发布会现场画面。", "https://picsum.photos/seed/v001b/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"),
    # Event 1: 科技公司
    (1, "数据泄露技术分析（安全专家解读）", "15:42", "独立安全研究员对泄露数据的技术分析。", "https://picsum.photos/seed/v002a/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
    # Event 2: 财务造假
    (2, "做空报告核心指控3分钟速览", "03:22", "80页做空报告精华提炼。", "https://picsum.photos/seed/v003a/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"),
    (2, "股价闪崩现场画面", "02:47", "做空报告发布次日，股价开盘即跌停。", "https://picsum.photos/seed/v003b/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"),
    # Event 3: 群体事件
    (3, "现场完整视频（未被删节版）", "22:18", "网友在现场拍摄的多角度完整记录，其他平台均已被删除。", "https://picsum.photos/seed/v004a/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"),
    # Event 4: 大选
    (4, "情报机构联合声明发布会", "34:05", "五眼联盟情报机构联合发布会完整录像。", "https://picsum.photos/seed/v005a/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"),
    (4, "专家解读：攻击路径还原", "18:33", "网络安全专家基于泄露技术指标重建攻击路径。", "https://picsum.photos/seed/v005b/800/450", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"),
]

for (eidx, title, duration, desc, thumb, url) in videos_data:
    post("event_videos", {
        "event_id": event_ids[eidx],
        "title": title,
        "duration": duration,
        "description": desc,
        "thumbnail": thumb,
        "video_url": url,
        "sort_order": 0
    })
    print(f"  ✓ Video: {title[:20]}")

# Documents
docs_data = [
    (0, "录音文字转录全文.pdf", "PDF", "2.3 MB", "47分钟录音完整文字转录，逐字校对标注时间戳。"),
    (0, "涉事品牌清单与合同条款.pdf", "PDF", "1.1 MB", "该明星全部代言品牌一览，含合同违约金估算。"),
    (1, "泄露数据样本分析.pdf", "PDF", "3.8 MB", "安全社区对泄露数据的结构化分析。"),
    (1, "受影响用户地区分布.png", "截图", "420 KB", "泄露数据中用户地区分布热力图。"),
    (2, "做空报告全文（中文翻译版）.pdf", "PDF", "12.4 MB", "80页做空报告完整中文翻译。"),
    (2, "涉事公司历年财报对比.xlsx", "Excel", "1.6 MB", "做空报告指控数据与公司历年财报对比标注。"),
    (3, "事件完整时间线梳理.pdf", "PDF", "890 KB", "多名现场亲历者口述整理的事件完整经过。"),
    (4, "联合声明原文（英文）.pdf", "PDF", "540 KB", "五眼联盟情报机构联合声明英文原版。"),
    (4, "历史黑客干预事件时间线.pdf", "PDF", "2.8 MB", "2016年至今全球主要选举干预事件汇编。"),
]

for (eidx, title, dtype, size, desc) in docs_data:
    post("event_documents", {
        "event_id": event_ids[eidx],
        "title": title,
        "doc_type": dtype,
        "size": size,
        "description": desc,
        "file_url": "https://example.com/files/" + title,
        "sort_order": 0
    })
    print(f"  ✓ Doc: {title[:25]}")

# Timelines
timeline_data = [
    (0, "4月24日 19:30", "录音片段首次流出", "某微博小号首次发布录音片段，约3分钟，引发第一波关注。", "微博"),
    (0, "4月24日 21:00", "录音完整版全网扩散", "完整47分钟录音在微博、抖音、小红书同时出现，多个话题冲上热搜。", "全网"),
    (0, "4月24日 23:45", "首位品牌宣布解约", "某国际美妆品牌率先发布声明，终止与该明星一切合作关系。", "品牌官方声明"),
    (0, "4月25日 08:00", "网友曝出更多疑似当事人聊天记录", "多位自称知情人的网友发布截图，多个爆料仍在核实中。", "微博/抖音"),
    (1, "4月23日 03:17", "黑客在暗网论坛发布数据", "昵称为DarkVault的黑客在暗网论坛发帖，声称手握某科技公司5亿用户数据。", "暗网"),
    (1, "4月23日 09:00", "国内安全社区发现并转发", "国内白帽黑客在朋友圈和技术社群转发该消息，开始核实真伪。", "安全社区"),
    (1, "4月23日 15:30", "公司回应已启动紧急调查", "公关部发布声明称已第一时间启动应急响应，但未正面承认泄露。", "官方声明"),
    (2, "4月22日 16:00", "做空机构发布报告", "某知名做空机构发布80页做空报告，同步在Twitter和微博发布摘要。", "做空机构"),
    (2, "4月22日 16:30", "公司申请临时停牌", "涉事公司向交易所申请临时停牌，理由为待披露重大事项。", "交易所公告"),
    (2, "4月23日 09:00", "证监会宣布介入调查", "证监会发布简短公告，称正在核查。", "证监会"),
    (3, "4月27日 08:30", "起因：一起普通纠纷", "某商业区因消费者与商户的纠纷，引发肢体冲突。", "目击者"),
    (3, "4月27日 10:00", "微博热搜被撤", "#某地事件# 冲上热搜第3位，约20分钟后消失。", "网友记录"),
    (3, "4月27日 11:00", "微信群大规模传播", "大量现场视频通过微信群在全国范围传播，多个视频被平台删除。", "微信"),
    (4, "4月20日 08:00", "投票日前三天：警报响起", "某国选举安全部门截获异常网络流量警报。", "情报来源"),
    (4, "4月21日 20:00", "五眼联盟发布联合声明", "美、英、加、澳、新五国情报机构联合召开发布会，公布干预证据。", "联合声明"),
    (4, "4月22日 06:00", "涉事国否认并反指", "被指控国召开新闻发布会，否认所有指控。", "涉事国"),
]

for (eidx, etime, title, desc, source) in timeline_data:
    post("event_timelines", {
        "event_id": event_ids[eidx],
        "event_time": etime,
        "title": title,
        "description": desc,
        "source": source,
        "sort_order": 0
    })
    print(f"  ✓ Timeline: {title[:20]}")

print("\n✅ 所有数据插入完成！")
print(f"事件 IDs: {[eid[:8] for eid in event_ids]}")
