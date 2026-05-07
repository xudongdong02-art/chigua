'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import Navbar from '@/components/chigua/Navbar'

const ADMIN_EMAILS = ['admin@chigua.com', '593581585@qq.com']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login?redirect=/admin/audit')
      } else if (!ADMIN_EMAILS.includes(user.email ?? '')) {
        // 非管理员 -> 首页
        router.push('/')
      } else {
        setChecking(false)
      }
    }
  }, [user, loading, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="container-d" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        {/* Admin Nav */}
        <div className="flex items-center gap-1 mb-8 pt-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs mr-2" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>管理后台</span>
          {[
            { href: '/admin/audit', label: '内容审核' },
            { href: '/admin/events', label: '事件管理' },
            { href: '/admin/dashboard', label: '数据看板' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{ fontFamily: 'var(--font-nunito-sans)', color: 'var(--text-2)' }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </main>
    </div>
  )
}