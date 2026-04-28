'use client'

interface TimelineEvent {
  time: string
  title: string
  description: string
  source?: string
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((item, i) => (
        <div
          key={i}
          className="timeline-item fade-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="timeline-dot" />
          {i < events.length - 1 && <div className="timeline-line" />}

          <div>
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                {item.time}
              </span>
              {item.source && (
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--accent-bg)',
                    color: 'var(--accent)',
                  }}
                >
                  {item.source}
                </span>
              )}
            </div>
            <h4
              className="font-display text-base mb-1.5 leading-snug"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
            >
              {item.title}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
