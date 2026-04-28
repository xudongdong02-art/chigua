'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('请填写邮箱和密码')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2.5 mb-10 lg:hidden">
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
      </div>

      <h1
        className="text-3xl font-display mb-2"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
      >
        欢迎回来
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        登录你的吃瓜账号
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
            邮箱
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="auth-input"
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
            密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="auth-input"
          />
        </div>

        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(230,48,48,0.08)', color: 'var(--accent)', border: '1px solid rgba(230,48,48,0.2)' }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-accent w-full py-3 text-sm disabled:opacity-50"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
        还没有账号？{' '}
        <Link href="/auth/register" className="font-semibold" style={{ color: 'var(--accent)' }}>
          免费注册
        </Link>
      </p>
    </div>
  )
}
