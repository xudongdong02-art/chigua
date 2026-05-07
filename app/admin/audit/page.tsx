'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type PendingItem = {
  id: string
  type: 'video' | 'doc'
  title: string
  description: string | null
  created_at: string
  user_email?: string
  event_title?: string
  event_id: string
  content?: Record<string, unknown>
}

export default function AuditPage() {
  const [pending, setPending] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'video' | 'doc'>('all')
  const [actioning, setActioning] = useState<string | null>(null)

  const fetchPending = async () => {
    setLoading(true)
    const [vRes, dRes] = await Promise.all([
      supabase.from('event_videos').select('*, profiles(email)').eq('status', 'pending').order('created_at', { ascending: true }),
      supabase.from('event_documents').select('*, profiles(email)').eq('status', 'pending').order('created_at', { ascending: true }),
    ])

    const events = await supabase.from('events').select('id, title')
    const eventMap: Record<string, string> = {}
    events.data?.forEach((e) => { eventMap[e.id] = e.title })

    const items: PendingItem[] = []
    vRes.data?.forEach((v: Record<string, unknown>) => {
      items.push({
        id: v.id as string, type: 'video', title: v.title as string,
        description: v.description as string | null, created_at: v.created_at as string,
        user_email: (v.profiles as Record<string, unknown> | null)?.email as string | undefined,
        event_id: v.event_id as string,
        event_title: eventMap[v.event_id as string],
        content: v,
      })
    })
    dRes.data?.forEach((d: Record<string, unknown>) => {
      items.push({
        id: d.id as string, type: 'doc', title: d.title as string,
        description: d.description as string | null, created_at: d.created_at as string,
        user_email: (d.profiles as Record<string, unknown> | null)?.email as string | undefined,
        event_id: d.event_id as string,
        event_title: eventMap[d.event_id as string],
        content: d,
      })
    })
    setPending(items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()))
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  const handleAction = async (item: PendingItem, action: 'approve' | 'reject') => {
    setActioning(item.id)
    if (item.type === 'video') {
      await supabase.from('event_videos').update({ status: action === 'approve' ? 'approved' : 'rejected' }).eq('id', item.id)
    } else {
      await supabase.from('event_documents').update({ status: action === 'approve' ? 'approved' : 'rejected' }).eq('id', item.id)
    }
    setActioning(null)
    fetchPending()
  }

  const filtered = filter === 'all' ? pending : pending.filter((p) => p.type === filter)
  const pendingCount = pending.length
  const videoCount = pending.filter(p => p.type === 'video').length
  const docCount = pending.filter(p => p.type === 'doc').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>内容审核</h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            共 {pendingCount} 条待审核
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all',   label: `全部 (${pendingCount})` },
            { key: 'video', label: `视频 (${videoCount})` },
            { key: 'doc',   label: `文档/图文 (${docCount})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className="px-4 py-2 rounded-full text-xs font-medium transition-all"
              style={{
                fontFamily: 'var(--font-nunito-sans)',
                background: filter === f.key ? 'var(--accent)' : 'var(--surface)',
                color: filter === f.key ? '#fff' : 'var(--text-2)',
                border: filter === f.key ? 'none' : '1.5px solid var(--border)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--text-mut)" className="mx-auto mb-4 opacity-25">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <p className="text-sm font-mono" style={{ color: 'var(--text-mut)' }}>暂无待审核内容</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border transition-all"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-bg)', border: '1px solid rgba(255,71,87,0.1)' }}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {item.type === 'video' ? '视频' : (item.content?.doc_type as string ?? '文档')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-base" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>
                      {item.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#FFF3ED', color: '#C75B00', fontFamily: 'var(--font-jetbrains)' }}>待审核</span>
                  </div>
                  {item.description && (
                    <p className="text-sm mb-2" style={{ color: 'var(--text-2)' }}>{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>
                    {item.event_title && <span>关联事件：{item.event_title}</span>}
                    {item.user_email && <span>上传者：{item.user_email}</span>}
                    <span>{new Date(item.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                  {/* 内容预览 */}
                  {(() => {
                    const c = item.content as Record<string, unknown> | null
                    if (item.type === 'video' && c?.video_url) {
                      return <div className="mt-3 rounded-xl overflow-hidden" style={{ maxWidth: 300, height: 160 }}>
                        <video src={c.video_url as string} className="w-full h-full object-cover" />
                      </div>
                    }
                    if (item.type === 'doc' && c?.content_text) {
                      return <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', maxHeight: 100, overflow: 'hidden' }}>
                        {String(c.content_text).slice(0, 200)}...
                      </div>
                    }
                    if (item.type === 'doc' && c?.file_url) {
                      return <div className="mt-3">
                        <img src={c.file_url as string} alt={item.title} className="rounded-xl" style={{ maxHeight: 160, maxWidth: 300, objectFit: 'cover' }} />
                      </div>
                    }
                    return null
                  })()}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAction(item, 'approve')}
                    disabled={actioning === item.id}
                    className="px-5 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: '#16A34A', color: '#fff', fontFamily: 'var(--font-nunito-sans)' }}
                  >
                    {actioning === item.id ? '处理中...' : '通过'}
                  </button>
                  <button
                    onClick={() => handleAction(item, 'reject')}
                    disabled={actioning === item.id}
                    className="px-5 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: 'var(--surface)', color: '#D63031', border: '1.5px solid var(--border)', fontFamily: 'var(--font-nunito-sans)' }}
                  >
                    拒绝
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}