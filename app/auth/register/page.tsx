'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !username) {
      setError('请填写所有字段')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入正确的邮箱地址')
      return
    }
    if (password.length < 6) {
      setError('密码至少6位')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await signUp(email, password, username)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2
          className="text-2xl font-display mb-2"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
        >
          验证邮件已发送
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-2)' }}>
          我们已向 <strong style={{ color: 'var(--text)' }}>{email}</strong> 发送了验证链接，请查收邮件并点击链接完成注册。
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--text-mut)' }}>
          如果没收到，请检查垃圾邮件文件夹。
        </p>
        <Link href="/auth/login" className="btn-accent text-sm">
          返回登录
        </Link>
      </div>
    )
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
        创建账号
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        免费加入吃瓜社区
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
            用户名
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="选择一个用户名"
            className="auth-input"
          />
        </div>

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
            placeholder="至少6位"
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
          {loading ? '注册中...' : '免费注册'}
        </button>
      </form>

      <p className="text-xs text-center mt-4" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-nunito-sans)' }}>
        注册即表示同意我们的用户协议和隐私政策
      </p>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
        已有账号？{' '}
        <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
          立即登录
        </Link>
      </p>
    </div>
  )
}
