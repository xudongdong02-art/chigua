'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user, loading, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-d flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-white text-lg"
            style={{ background: 'var(--accent)' }}
          >
            瓜
          </div>
          <span
            className="font-display text-2xl tracking-wide"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
          >
            吃瓜
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200"
            style={{ color: 'var(--text-2)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--surface-2)'
              el.style.color = 'var(--text)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = 'var(--text-2)'
            }}
          >
            热点
          </Link>
          {['娱乐', '科技', '财经', '社会', '国际'].map((tag) => (
            <Link
              key={tag}
              href={`/#tag-${tag}`}
              className="px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200"
              style={{ color: 'var(--text-2)' }}
              onClick={() => {
                // Scroll to top and let the home page handle tag filtering
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--surface-2)'
                el.style.color = 'var(--text)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.color = 'var(--text-2)'
              }}
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              <Link
                href={user ? "/upload" : "/auth/login?redirect=/upload"}
                className="btn-accent text-sm text-center"
                style={{ fontFamily: 'var(--font-nunito-sans)', minWidth: 64 }}
              >
                发布
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {user.user_metadata?.username?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
                  </button>
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div
                        className="absolute right-0 top-12 w-48 rounded-2xl p-2 z-50"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                      >
                        <div className="px-3 py-2 mb-1">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                            {user.user_metadata?.username ?? '用户'}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-mut)' }}>
                            {user.email}
                          </p>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)' }}>
                          <Link
                            href="/profile"
                            className="block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors"
                            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'var(--surface-2)'
                              el.style.color = 'var(--accent)'
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'transparent'
                              el.style.color = 'var(--text-2)'
                            }}
                            onClick={() => setMenuOpen(false)}
                          >
                            我的内容
                          </Link>
                          <Link
                            href="/settings"
                            className="block w-full text-left px-3 py-2 text-sm rounded-xl transition-colors"
                            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'var(--surface-2)'
                              el.style.color = 'var(--accent)'
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'transparent'
                              el.style.color = 'var(--text-2)'
                            }}
                            onClick={() => setMenuOpen(false)}
                          >
                            个人设置
                          </Link>
                          <button
                            onClick={() => { signOut(); setMenuOpen(false) }}
                            className="w-full text-left px-3 py-2 text-sm rounded-xl transition-colors"
                            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'var(--surface-2)'
                              el.style.color = 'var(--accent)'
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'transparent'
                              el.style.color = 'var(--text-2)'
                            }}
                          >
                            退出登录
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="btn-ghost text-sm"
                    style={{ fontFamily: 'var(--font-nunito-sans)' }}
                  >
                    登录
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-accent text-sm"
                    style={{ fontFamily: 'var(--font-nunito-sans)' }}
                  >
                    免费注册
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}