'use client'

interface DocumentItem {
  id: string
  title: string
  type: string
  size: string
  description: string
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  PDF:   { bg: '#FFF0F0', text: '#D63031' },
  Word:  { bg: '#EEF4FF', text: '#2563EB' },
  Excel: { bg: '#EDFAF3', text: '#16A34A' },
  截图:  { bg: '#F5F3F0', text: '#6B6B70' },
}

export default function DocumentViewer({ documents }: { documents: DocumentItem[] }) {
  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const colors = TYPE_COLORS[doc.type] || TYPE_COLORS['截图']
        return (
          <div key={doc.id} className="doc-card">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.text}20`,
              }}
            >
              <span
                className="text-xs font-mono font-bold"
                style={{ color: colors.text, fontFamily: 'var(--font-jetbrains)' }}
              >
                {doc.type}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4
                className="font-semibold text-sm mb-1 leading-snug"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
              >
                {doc.title}
              </h4>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-2)' }}>
                {doc.description}
              </p>
              <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
                {doc.size}
              </span>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <button
                className="btn-accent text-xs px-4 py-2"
              >
                查看文档
              </button>
              <button
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--text-mut)'
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                下载
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
