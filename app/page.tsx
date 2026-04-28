'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/chigua/Navbar'
import EventHero from '@/components/chigua/EventHero'
import EventCard from '@/components/chigua/EventCard'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  subtitle: string | null
  cover_image: string | null
  heat: number
  tag: string
  publish_date: string
  read_time: string
  summary: string | null
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
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
  }, [events])

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, subtitle, cover_image, heat, tag, publish_date, read_time, summary')
        .eq('status', 'published')
        .order('heat', { ascending: false })

      if (!error && data) {
        setEvents(data)
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const featured = events.reduce((a, b) => (a.heat > b.heat ? a : b), events[0])
  const rest = events.filter((e) => e.id !== featured?.id)

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main>
        {/* ─── Hero Section ─── */}
        <section className="hero-gradient pt-28 pb-12">
          <div className="container-d">
            {/* Header */}
            <div className="mb-8 fade-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="accent-line" />
                <span className="section-label">真实 · 完整 · 持久</span>
              </div>
              <h1
                className="font-display text-7xl md:text-8xl leading-none mb-3"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
              >
                吃瓜
              </h1>
              <p className="text-base max-w-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
                一个地方，找到热点事件的全部。视频 · 文档 · 时间线。真实内容，不被消失。
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mb-10 fade-up" style={{ animationDelay: '100ms' }}>
              <div
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
                style={{
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-mut)">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  placeholder="搜索热点事件..."
                  className="flex-1 bg-transparent text-sm placeholder:text-text-mut outline-none"
                  style={{ fontFamily: 'var(--font-nunito-sans)', color: 'var(--text)' }}
                />
                <button className="btn-accent text-xs px-4 py-1.5">搜索</button>
              </div>
            </div>

            {/* Featured Event */}
            {featured && (
              <div className="mb-12">
                <EventHero event={featured} />
              </div>
            )}
          </div>
        </section>

        {/* ─── Events Grid ─── */}
        <section className="page-section-sm">
          <div className="container-d">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 fade-up">
              <div className="flex items-center gap-3">
                <div className="accent-line" />
                <span className="section-label">更多热点</span>
              </div>
              <div className="flex items-center gap-1.5">
                {['全部', '娱乐', '科技', '财经', '社会', '国际'].map((filter, i) => (
                  <button
                    key={filter}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      background: i === 0 ? 'var(--accent)' : 'transparent',
                      color: i === 0 ? '#fff' : 'var(--text-2)',
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {rest.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rest.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-sm font-mono" style={{ color: 'var(--text-mut)' }}>
                  暂无更多事件
                </p>
              </div>
            )}

            {/* Load More */}
            <div className="flex justify-center mt-12 fade-up">
              <button
                className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-2)',
                  fontFamily: 'var(--font-nunito-sans)',
                }}
              >
                加载更多
              </button>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer
          className="py-10 mt-8"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <div className="container-d flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-display text-white text-sm"
                style={{ background: 'var(--accent)' }}
              >
                瓜
              </div>
              <span
                className="font-display text-lg"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
              >
                吃瓜
              </span>
            </div>
            <p className="text-xs font-mono text-text-mut text-center">
              内容来源于用户上传与编辑整理，仅供吃瓜参考。请勿传播违规内容。
            </p>
            <div className="flex items-center gap-4 text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
              <span>关于我们</span>
              <span>·</span>
              <span>用户协议</span>
              <span>·</span>
              <span>联系删除</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
