'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/chigua/Navbar'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type ContentItem = {
  id: string
  title: string
  doc_type?: string
  video_url?: string
  file_url?: string
  thumbnail?: string
  content_text?: string
  status: string
  created_at: string
  event_id: string
}

type EventMap = Record<string, string>

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [videos, setVideos] = useState<ContentItem[]>([])
  const [docs, setDocs] = useState<ContentItem[]>([])
  const [events, setEvents] = useState<EventMap>({})
  const [fetching, setFetching] = useState(true)
  const [tab, setTab] = useState<'video' | 'doc'>('video')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchMyContent() {
      if (!user) return
      setFetching(true)

      // 并行拿视频、文档、事件名
      const [vRes, dRes, eRes] = await Promise.all([
        supabase.from('event_videos').select('*').eq('created_by', user.id).order('created_at', { ascending: false }),
        supabase.from('event_documents').select('*').eq('created_by', user.id).order('created_at', { ascending: false }),
        supabase.from('events').select('id, title').eq('status', 'published'),
      ])

      if (vRes.data) setVideos(vRes.data as ContentItem[])
      if (dRes.data) setDocs(dRes.data as ContentItem[])
      if (eRes.data) {
        const map: EventMap = {}
        eRes.data.forEach((e: { id: string; title: string }) => { map[e.id] = e.title })
        setEvents(map)
      }

      setFetching(false)
    }
    fetchMyContent()
  }, [user])

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending:  { label: '审核中', color: '#F5A623' },
    approved: { label: '已展示', color: '#16A34A' },
    rejected: { label: '未通过', color: '#D63031' },
  }

  const myItems = tab === 'video' ? videos : docs
  const total = videos.length + docs.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="container-d" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="max-w-3xl mx-auto py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="accent-line" />
              <span className="section-label">个人中心</span>
            </div>
            <h1
              className="text-4xl font-display mb-2"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
            >
              我的内容
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              共 {total} 条内容
            </p>
          </div>

          {/* Tab */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('video')}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                fontFamily: 'var(--font-nunito-sans)',
                background: tab === 'video' ? 'var(--accent)' : 'var(--surface)',
                color: tab === 'video' ? '#fff' : 'var(--text-2)',
                border: tab === 'video' ? 'none' : '1.5px solid var(--border)',
              }}
            >
              视频 ({videos.length})
            </button>
            <button
              onClick={() => setTab('doc')}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                fontFamily: 'var(--font-nunito-sans)',
                background: tab === 'doc' ? 'var(--accent)' : 'var(--surface)',
                color: tab === 'doc' ? '#fff' : 'var(--text-2)',
                border: tab === 'doc' ? 'none' : '1.5px solid var(--border)',
              }}
            >
              文档 / 图片 / 文字 ({docs.length})
            </button>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-16" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1.5rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--text-mut)" className="mx-auto mb-4 opacity-25">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <p className="text-sm font-mono mb-4" style={{ color: 'var(--text-mut)' }}>
                还没有{tab === 'video' ? '视频' : '文档/图片/文字'}内容
              </p>
              <Link href="/upload" className="btn-accent text-sm px-6 py-2.5">
                去发布
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myItems.map((item) => {
                const statusInfo = STATUS_LABELS[item.status] ?? { label: item.status, color: 'var(--text-mut)' }
                const eventName = events[item.event_id]
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border transition-all duration-200"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--accent)'
                      el.style.boxShadow = 'var(--shadow-md)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--border)'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* 类型图标 */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'var(--accent-bg)',
                          border: '1px solid rgba(255,71,87,0.1)',
                        }}
                      >
                        <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
                          {tab === 'video' ? '视频' : (item.doc_type ?? '文档')}
                        </span>
                      </div>
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                            {item.title}
                          </h4>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: `${statusInfo.color}15`, color: statusInfo.color, fontFamily: 'var(--font-jetbrains)' }}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        {eventName && (
                          <p className="text-xs mb-1" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-nunito-sans)' }}>
                            关联事件：{eventName}
                          </p>
                        )}
                        <p className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
                          {new Date(item.created_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      {/* 查看 */}
                      <Link
                        href={`/event/${item.event_id}`}
                        className="text-xs px-3 py-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: 'var(--accent-bg)',
                          color: 'var(--accent)',
                          fontFamily: 'var(--font-nunito-sans)',
                          border: '1px solid rgba(255,71,87,0.15)',
                        }}
                      >
                        查看
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}