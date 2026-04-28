'use client'
import Link from 'next/link'

// Accepts both Supabase (snake_case) and mockData (camelCase) formats
interface EventBase {
  id: string
  title: string
  summary: string | null
  heat: number
  tag: string
}

interface SupabaseEvent extends EventBase {
  cover_image: string | null
  publish_date: string
  read_time: string
}

interface MockEvent extends EventBase {
  coverImage: string
  publishDate: string
  readTime: string
}

type EventCardProps = {
  event: SupabaseEvent | MockEvent
  index?: number
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

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const isSupabase = 'cover_image' in event
  const coverImage = isSupabase ? (event as SupabaseEvent).cover_image : (event as MockEvent).coverImage
  const publishDate = isSupabase ? (event as SupabaseEvent).publish_date : (event as MockEvent).publishDate
  const readTime = isSupabase ? (event as SupabaseEvent).read_time : (event as MockEvent).readTime

  return (
    <Link
      href={`/event/${event.id}`}
      className="card-event fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden" style={{ height: 210 }}>
        <img
          src={coverImage ?? ''}
          alt={event.title}
          className="card-img w-full h-full object-cover transition-transform duration-500"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
          }}
        />

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={TAG_COLORS[event.tag] || 'tag'}>{event.tag}</span>
        </div>

        {/* Heat */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z"/>
          </svg>
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {formatHeat(event.heat)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="font-display text-lg leading-snug mb-2 transition-colors duration-200"
          style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-dm-serif)',
            fontSize: '1.05rem',
          }}
        >
          {event.title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'var(--text-2)' }}
        >
          {event.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
            {publishDate}
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
            {readTime}
          </span>
        </div>
      </div>
    </Link>
  )
}
