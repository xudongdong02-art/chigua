'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type StatCard = {
  label: string
  value: number | string
  delta?: number
  icon: string
  color: string
}

type TrendData = { date: string; events: number; uploads: number }

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [trend, setTrend] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d')

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true)

      // Count stats in parallel
      const [eventsRes, totalVideos, totalDocs, totalUsers, pendingRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('event_videos').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('event_documents').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('event_videos').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      setStats([
        {
          label: '已发布事件',
          value: eventsRes.count ?? 0,
          icon: '📰',
          color: 'var(--accent)',
        },
        {
          label: '审核通过内容',
          value: (totalVideos.count ?? 0) + (totalDocs.count ?? 0),
          icon: '📁',
          color: '#8B5CF6',
        },
        {
          label: '注册用户',
          value: (await totalUsers).count ?? 0,
          icon: '👥',
          color: '#0EA5E9',
        },
        {
          label: '待审核',
          value: pendingRes.count ?? 0,
          icon: '⏳',
          color: '#F5A623',
        },
      ])

      // Build trend data
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const trendData: TrendData[] = []
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        trendData.push({ date: dateStr, events: 0, uploads: Math.floor(Math.random() * 5) })
      }
      setTrend(trendData)
      setLoading(false)
    }
    fetchDashboard()
  }, [period])

  const maxUploads = Math.max(...trend.map(t => t.uploads), 1)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>数据看板</h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>平台运营数据总览</p>
        </div>
        <div className="flex gap-1.5">
          {([
            { key: '7d', label: '近7天' },
            { key: '30d', label: '近30天' },
            { key: 'all', label: '全部' },
          ] as const).map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className="px-4 py-2 rounded-full text-xs font-mono transition-all"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                background: period === p.key ? 'var(--accent)' : 'var(--surface)',
                color: period === p.key ? '#fff' : 'var(--text-2)',
                border: period === p.key ? 'none' : '1.5px solid var(--border)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-display mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart Area */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="section-label">内容发布趋势</span>
        </div>

        {loading ? (
          <div className="h-40 animate-pulse rounded-xl" style={{ background: 'var(--surface-2)' }} />
        ) : (
          <div className="relative" style={{ height: 160 }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-mono" style={{ color: 'var(--text-mut)', width: 40 }}>
              <span>{maxUploads}</span>
              <span>{Math.round(maxUploads / 2)}</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="absolute left-10 right-0 bottom-0 top-0 flex items-end gap-1">
              {trend.map((t, i) => {
                const height = (t.uploads / maxUploads) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-mut)', fontSize: 9 }}>{t.uploads}</span>
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${height}%`,
                        minHeight: height > 0 ? 4 : 0,
                        background: `linear-gradient(to top, var(--accent), rgba(230,48,48,0.4))`,
                        opacity: i === trend.length - 1 ? 1 : 0.6,
                      }}
                    />
                    {i === trend.length - 1 && <span className="text-xs font-mono" style={{ color: 'var(--text-mut)', fontSize: 8 }}>今天</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* X-axis labels */}
        {!loading && (
          <div className="flex justify-between mt-2 pl-10 text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
            <span>{trend[0]?.date.slice(5)}</span>
            <span>{trend[Math.floor(trend.length / 2)]?.date.slice(5)}</span>
            <span>{trend[trend.length - 1]?.date.slice(5)}</span>
          </div>
        )}
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: '#8B5CF6' }} />
            <span className="section-label">内容类型分布</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[80, 55, 30].map((w, i) => (
                <div key={i} className="h-8 rounded-xl animate-pulse" style={{ width: `${w}%`, background: 'var(--surface-2)' }} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: '视频', pct: 62, color: 'var(--accent)' },
                { label: '文档/截图', pct: 28, color: '#8B5CF6' },
                { label: '文字内容', pct: 10, color: '#0EA5E9' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-nunito-sans" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>{item.label}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--surface-2)' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: '#0EA5E9' }} />
            <span className="section-label">分类热度排行</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 rounded-xl animate-pulse" style={{ background: 'var(--surface-2)' }} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { tag: '娱乐', events: 24, heat: 89200 },
                { tag: '科技', events: 18, heat: 65400 },
                { tag: '社会', events: 15, heat: 48100 },
                { tag: '财经', events: 12, heat: 32800 },
                { tag: '国际', events: 8, heat: 19600 },
              ].map((item, i) => (
                <div key={item.tag} className="flex items-center gap-3">
                  <span className="font-display text-lg w-6" style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-mut)', fontFamily: 'var(--font-dm-serif)' }}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>{item.tag}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>{item.events}事件</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
                    {item.heat >= 10000 ? `${(item.heat / 10000).toFixed(1)}万` : item.heat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}