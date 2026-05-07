'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import Navbar from '@/components/chigua/Navbar'
import ContentTabs from '@/components/chigua/ContentTabs'
import VideoPlayer from '@/components/chigua/VideoPlayer'
import DocumentViewer from '@/components/chigua/DocumentViewer'
import Timeline from '@/components/chigua/Timeline'
import CommentSection from '@/components/chigua/CommentSection'
import { supabase } from '@/lib/supabase'
import type { VideoItem, DocumentItem, TimelineItem } from '@/lib/types'

function formatHeat(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  return n.toString()
}

const TAG_COLORS: Record<string, string> = {
  娱乐: 'tag',
  科技: 'tag-blue',
  财经: 'tag',
  社会: 'tag-orange',
  国际: 'tag-green',
}

export default function EventDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()

  const [event, setEvent] = useState<Record<string, unknown> | null>(null)
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [timelines, setTimelines] = useState<TimelineItem[]>([])
  const [allEvents, setAllEvents] = useState<Array<{ id: string; title: string; cover_image: string | null; heat: number; tag: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.05 }
    )
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [id, event])

  useEffect(() => {
    async function fetchData() {
      // Fetch event details
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      // Fetch related content（只显示已审核的）
      const [videosRes, docsRes, timelineRes, allEventsRes] = await Promise.all([
        supabase.from('event_videos').select('*').eq('event_id', id).eq('status', 'approved').order('sort_order'),
        supabase.from('event_documents').select('*').eq('event_id', id).eq('status', 'approved').order('sort_order'),
        supabase.from('event_timelines').select('*').eq('event_id', id).order('sort_order'),
        supabase.from('events').select('id, title, cover_image, heat, tag').eq('status', 'published').order('heat', { ascending: false }),
      ])

      setEvent(eventData)
      setVideos((videosRes.data ?? []) as VideoItem[])
      setDocuments((docsRes.data ?? []) as DocumentItem[])
      setTimelines((timelineRes.data ?? []) as TimelineItem[])
      setAllEvents(allEventsRes.data ?? [])
      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent mx-auto mb-4 animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-mono" style={{ color: 'var(--text-mut)' }}>加载中...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div className="text-center">
          <h2
            className="font-display text-5xl mb-4"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
          >
            404
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-2)' }}>
            这个瓜不存在或已被删除
          </p>
          <Link href="/" className="btn-accent">返回首页</Link>
        </div>
      </div>
    )
  }

  const title = (event.title as string) ?? ''
  const subtitle = (event.subtitle as string | null) ?? ''
  const coverImage = (event.cover_image as string | null) ?? ''
  const heat = (event.heat as number) ?? 0
  const tag = (event.tag as string) ?? ''
  const publishDate = (event.publish_date as string) ?? ''
  const readTime = (event.read_time as string) ?? ''
  const summary = (event.summary as string | null) ?? ''

  const relatedEvents = allEvents
    .filter((e) => e.id !== id)
    .slice(0, 2) as Array<{ id: string; title: string; cover_image: string | null; tag: string; heat: number }>

  const tabs = [
    { id: 'video',    label: '视频',    count: videos.length },
    { id: 'doc',     label: '文档',    count: documents.length },
    { id: 'timeline', label: '时间线', count: timelines.length },
  ]

  // Format data for VideoPlayer (camelCase)
  const formattedVideos = videos.map((v) => ({
    id: v.id,
    title: v.title,
    duration: v.duration ?? '',
    description: v.description ?? '',
    thumbnail: v.thumbnail ?? '',
    videoUrl: v.video_url,
  }))

  // Format data for DocumentViewer (camelCase)
  const formattedDocs = documents.map((d) => ({
    id: d.id,
    title: d.title,
    type: d.doc_type as 'PDF' | 'Word' | 'Excel' | '截图' | '文字',
    size: d.size ?? '',
    description: d.description ?? '',
    contentText: d.content_text ?? '',
    fileUrl: d.file_url ?? '',
    thumbnail: d.thumbnail ?? '',
  }))

  // Format data for Timeline (camelCase)
  const formattedTimelines = timelines.map((t) => ({
    time: t.event_time,
    title: t.title,
    description: t.description ?? '',
    source: t.source ?? '',
  }))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* ─── Hero Cover ─── */}
      <div className="relative" style={{ height: 400 }}>
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(250,250,248,0.85) 80%, var(--bg) 100%)',
          }}
        />
      </div>

      <main className="container-d relative" style={{ marginTop: -100 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Main Content ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Event Header */}
            <div className="fade-up">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={TAG_COLORS[tag] || 'tag'}>{tag}</span>
                <div className="flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z"/>
                  </svg>
                  <span className="text-xs font-mono font-semibold">{formatHeat(heat)}</span>
                </div>
              </div>

              <h1
                className="font-display text-4xl md:text-5xl leading-tight mb-3"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
              >
                {title}
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>
                {subtitle}
              </p>

              {/* Meta bar */}
              <div
                className="flex items-center gap-6 pb-6 flex-wrap"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2" style={{ color: 'var(--text-mut)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                  </svg>
                  <span className="text-sm font-mono">{publishDate}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--text-mut)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  </svg>
                  <span className="text-sm font-mono">{readTime}</span>
                </div>
                <div className="ml-auto">
                  <button className="btn-share">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                    </svg>
                    分享
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              className="fade-up p-6 rounded-2xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="section-label">事件概要</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {summary}
              </p>
            </div>

            {/* Content Tabs */}
            <div className="fade-up">
              <ContentTabs tabs={tabs}>
                <div>
                  {formattedVideos.length > 0
                    ? <VideoPlayer videos={formattedVideos} />
                    : <EmptyState icon="video" />
                  }
                </div>
                <div>
                  {formattedDocs.length > 0
                    ? <DocumentViewer documents={formattedDocs} />
                    : <EmptyState icon="doc" />
                  }
                </div>
                <div>
                  {formattedTimelines.length > 0
                    ? <Timeline events={formattedTimelines} />
                    : <EmptyState icon="timeline" />
                  }
                </div>
              </ContentTabs>
            </div>

            {/* Comments */}
            <div className="fade-up">
              <CommentSection eventId={id} />
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-6">

            {/* Back */}
            <div className="fade-up">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-nunito-sans)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                返回事件列表
              </Link>
            </div>

            {/* Add Content CTA */}
            {user ? (
              <div className="fade-up">
                <Link
                  href="/upload"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    fontFamily: 'var(--font-nunito-sans)',
                    boxShadow: 'var(--shadow-accent)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  为此事件添加内容
                </Link>
              </div>
            ) : (
              <div className="fade-up">
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                  style={{
                    background: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(230,48,48,0.2)',
                    fontFamily: 'var(--font-nunito-sans)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  登录后添加内容
                </Link>
              </div>
            )}

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="accent-line" />
                  <span className="section-label">相关事件</span>
                </div>
                <div className="space-y-3">
                  {relatedEvents.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/event/${rel.id}`}
                      className="group block rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div className="relative overflow-hidden" style={{ height: 110 }}>
                        <img
                          src={rel.cover_image ?? ''}
                          alt={rel.title as string}
                          className="card-img w-full h-full object-cover transition-transform duration-300"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
                        />
                        <span
                          className={TAG_COLORS[rel.tag as string] || 'tag'}
                          style={{ position: 'absolute', top: 8, left: 8 }}
                        >
                          {rel.tag}
                        </span>
                      </div>
                      <div className="p-3">
                        <h4
                          className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors"
                          style={{ fontFamily: 'var(--font-nunito-sans)', color: 'var(--text)' }}
                        >
                          {rel.title as string}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hot Ranking */}
            <div className="fade-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-line" />
                <span className="section-label">实时热度</span>
              </div>
              <div className="space-y-3">
                {allEvents.slice(0, 5).map((e, i) => (
                  <Link
                    key={e.id}
                    href={`/event/${e.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <span
                      className="font-display text-2xl leading-none w-7 flex-shrink-0"
                      style={{
                        fontFamily: 'var(--font-dm-serif)',
                        color: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-2)' : 'var(--text-mut)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm leading-snug line-clamp-2 mb-0.5 group-hover:text-accent transition-colors"
                        style={{ fontFamily: 'var(--font-nunito-sans)', color: 'var(--text-2)' }}
                      >
                        {e.title as string}
                      </h4>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
                        {formatHeat(e.heat as number)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function EmptyState({ icon }: { icon: string }) {
  const icons: Record<string, string> = {
    video: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
    doc: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',
    timeline: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z',
  }
  const labels: Record<string, string> = {
    video: '视频',
    doc: '文档',
    timeline: '时间线',
  }
  return (
    <div className="text-center py-16" style={{ color: 'var(--text-mut)' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-4 opacity-25">
        <path d={icons[icon]} />
      </svg>
      <p className="text-sm font-mono">暂无{labels[icon]}内容</p>
    </div>
  )
}
