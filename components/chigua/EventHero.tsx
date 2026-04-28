'use client'
import Link from 'next/link'

// Accepts both Supabase (snake_case) and mockData (camelCase) formats
interface EventBase {
  id: string
  title: string
  heat: number
  tag: string
}

interface SupabaseEvent extends EventBase {
  subtitle: string | null
  cover_image: string | null
  publish_date: string
  read_time: string
  videos?: unknown[]
  documents?: unknown[]
}

interface MockEvent extends EventBase {
  subtitle: string
  coverImage: string
  publishDate: string
  readTime: string
  videos: unknown[]
  documents: unknown[]
}

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

export default function EventHero({ event }: { event: SupabaseEvent | MockEvent }) {
  const isSupabase = 'cover_image' in event
  const coverImage = isSupabase ? (event as SupabaseEvent).cover_image : (event as MockEvent).coverImage
  const subtitle = isSupabase ? (event as SupabaseEvent).subtitle : (event as MockEvent).subtitle
  const publishDate = isSupabase ? (event as SupabaseEvent).publish_date : (event as MockEvent).publishDate
  const readTime = isSupabase ? (event as SupabaseEvent).read_time : (event as MockEvent).readTime
  const videos = isSupabase ? ((event as SupabaseEvent).videos ?? []) : (event as MockEvent).videos
  const documents = isSupabase ? ((event as SupabaseEvent).documents ?? []) : (event as MockEvent).documents

  return (
    <Link href={`/event/${event.id}`} className="fade-up group block">
      <div
        className="relative overflow-hidden rounded-3xl transition-all duration-300"
        style={{
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Background Image */}
        <div className="relative" style={{ height: 460 }}>
          <img
            src={coverImage ?? ''}
            alt={event.title}
            className="card-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(28,28,30,0.92) 0%, rgba(28,28,30,0.5) 40%, rgba(28,28,30,0.1) 100%)',
            }}
          />

          {/* Top badges */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white"
              style={{
                background: 'var(--accent)',
                letterSpacing: '0.08em',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-white"
                style={{ animation: 'bounceIn 1s ease infinite alternate' }}
              />
              热门
            </div>
            <span className={TAG_COLORS[event.tag] || 'tag'}>{event.tag}</span>
          </div>

          {/* Heat badge */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z"/>
            </svg>
            <span
              className="text-sm font-mono font-bold"
              style={{ color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            >
              {formatHeat(event.heat)}
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="accent-line" />
              <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
                今日最热
              </span>
            </div>

            <h2
              className="font-display text-4xl md:text-5xl leading-tight mb-3 transition-colors duration-200"
              style={{
                color: 'white',
                fontFamily: 'var(--font-dm-serif)',
                letterSpacing: '0.01em',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              {event.title}
            </h2>
            <p
              className="text-base mb-6 max-w-2xl leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {subtitle}
            </p>

            <div className="flex items-center gap-6">
              <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {publishDate}
              </span>
              <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {readTime}
              </span>

              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-xs font-mono">{videos.length} 视频</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
                  </svg>
                  <span className="text-xs font-mono">{documents.length} 文档</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                  </svg>
                  <span className="text-xs font-mono">时间线</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
