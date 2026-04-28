'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-96"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-white text-lg"
            style={{ background: 'var(--accent)' }}
          >
            瓜
          </div>
          <span
            className="font-display text-2xl"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
          >
            吃瓜
          </span>
        </Link>

        <div>
          <h2
            className="text-4xl font-display leading-tight mb-4"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
          >
            真实内容<br />不被消失
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            吃瓜是热点事件内容聚合平台，汇集视频、文档、时间线，帮你一个地方看清事件全貌。
          </p>
        </div>

        <p className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
          内容来源于用户上传与编辑整理
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}
