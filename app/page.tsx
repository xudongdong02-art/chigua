'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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

const TAGS = ['全部', '娱乐', '科技', '财经', '社会', '国际']
const SORTS = [
  { key: 'heat',   label: '最热' },
  { key: 'latest', label: '最新' },
  { key: 'synth',  label: '综合' },
]
const PAGE_SIZE = 12

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState('全部')
  const [activeSort, setActiveSort] = useState('heat')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const pageRef = useRef(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 初始化加载
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

  // 重置时重新拉数据
  const fetchEvents = useCallback(async (reset = false) => {
    if (reset) {
      pageRef.current = 1
      setEvents([])
      setHasMore(true)
    }

    const isInitial = reset || events.length === 0
    if (isInitial) setLoading(true)
    else setLoadingMore(true)

    let query = supabase
      .from('events')
      .select('id, title, subtitle, cover_image, heat, tag, publish_date, read_time, summary')
      .eq('status', 'published')
      .limit(PAGE_SIZE)
      .range((pageRef.current - 1) * PAGE_SIZE, pageRef.current * PAGE_SIZE - 1)

    if (activeTag !== '全部') {
      query = query.eq('tag', activeTag)
    }

    if (searchQuery.trim()) {
      query = query.ilike('title', `%${searchQuery.trim()}%`)
    }

    if (activeSort === 'heat') {
      query = query.order('heat', { ascending: false })
    } else if (activeSort === 'latest') {
      query = query.order('publish_date', { ascending: false })
    } else {
      query = query.order('heat', { ascending: false })
    }

    const { data, error } = await query

    if (!error && data) {
      const newEvents = pageRef.current === 1 ? data : [...events, ...data]

      // 综合排序
      if (activeSort === 'synth') {
        const sorted = [...newEvents].sort((a, b) => {
          const scoreA = a.heat * 0.7 + new Date(a.publish_date).getTime() * 0.0000001
          const scoreB = b.heat * 0.7 + new Date(b.publish_date).getTime() * 0.0000001
          return scoreB - scoreA
        })
        setEvents(sorted)
      } else {
        setEvents(newEvents)
      }

      if (data.length < PAGE_SIZE) {
        setHasMore(false)
      }
    }

    if (isInitial) setLoading(false)
    else setLoadingMore(false)
  }, [activeTag, activeSort, searchQuery, events.length])

  // 初始加载
  useEffect(() => {
    fetchEvents(true)
  }, [activeTag, activeSort])

  // 搜索防抖
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 400)
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
    }
  }, [searchInput])

  // 搜索变化时重置
  useEffect(() => {
    pageRef.current = 1
    setHasMore(true)
    fetchEvents(true)
  }, [searchQuery])

  // 无限滚动
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && events.length > 0) {
          pageRef.current += 1
          fetchEvents(false)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, events.length, fetchEvents])

  const featured = events.reduce((a, b) => (a.heat > b.heat ? a : b), events[0])
  const rest = events.filter((e) => e.id !== featured?.id)

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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜索热点事件..."
                  className="flex-1 bg-transparent text-sm placeholder:text-text-mut outline-none"
                  style={{ fontFamily: 'var(--font-nunito-sans)', color: 'var(--text)' }}
                />
                {searchInput && (
                  <button
                    onClick={() => { setSearchInput(''); setSearchQuery('') }}
                    className="text-text-mut hover:text-text transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-mut)' }}>
                  搜索：&ldquo;{searchQuery}&rdquo;
                </p>
              )}
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
            <div className="flex flex-col gap-4 mb-8 fade-up">
              {/* 分类标签 */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setActiveTag(tag); setSearchInput(''); setSearchQuery('') }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      background: activeTag === tag ? 'var(--accent)' : 'var(--surface)',
                      color: activeTag === tag ? '#fff' : 'var(--text-2)',
                      border: activeTag === tag ? 'none' : '1.5px solid var(--border)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {/* 排序 */}
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>排序：</span>
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSort(s.key)}
                    className="text-xs px-3 py-1 rounded-full transition-all"
                    style={{
                      fontFamily: 'var(--font-nunito-sans)',
                      background: activeSort === s.key ? 'var(--accent-bg)' : 'transparent',
                      color: activeSort === s.key ? 'var(--accent)' : 'var(--text-mut)',
                      border: activeSort === s.key ? '1px solid rgba(255,71,87,0.2)' : '1px solid transparent',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
                <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
                  {loading ? '加载中...' : `${events.length} 个事件`}
                </span>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                />
              </div>
            ) : rest.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rest.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex items-center justify-center py-8 mt-4">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                    />
                    <span className="ml-3 text-sm" style={{ color: 'var(--text-mut)' }}>加载更多...</span>
                  </div>
                )}

                {!hasMore && events.length > 0 && (
                  <p className="text-center text-sm font-mono py-8" style={{ color: 'var(--text-mut)' }}>
                    — 已加载全部 {events.length} 个事件 —
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-sm font-mono mb-3" style={{ color: 'var(--text-mut)' }}>
                  未找到{searchQuery ? `搜索"${searchQuery}"` : activeTag === '全部' ? '' : activeTag}相关事件
                </p>
                {(searchQuery || activeTag !== '全部') && (
                  <button
                    onClick={() => { setActiveTag('全部'); setSearchInput(''); setSearchQuery('') }}
                    className="text-sm px-5 py-2 rounded-full transition-all"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}
                  >
                    清除筛选
                  </button>
                )}
              </div>
            )}
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