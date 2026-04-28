'use client'
import { useState, useRef, useEffect } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
}

export default function ContentTabs({ tabs, children }: { tabs: Tab[]; children: React.ReactNode[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const track = trackRef.current
      if (!track) return
      const btn = track.querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`)
      if (!btn) return
      const trackRect = track.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      setIndicatorStyle({
        left: btnRect.left - trackRect.left,
        width: btnRect.width,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [activeTab])

  return (
    <div>
      <div ref={trackRef} className="tab-track mb-8">
        <div
          className="tab-indicator"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-mono"
                style={{
                  background: activeTab === tab.id ? 'var(--accent-bg)' : 'var(--surface)',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-mut)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div>
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
          >
            {children[i]}
          </div>
        ))}
      </div>
    </div>
  )
}
