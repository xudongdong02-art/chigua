'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/chigua/Navbar'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Form state
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      setFetching(true)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        const p = data as unknown as Profile
        setProfile(p)
        setNickname(p.nickname ?? '')
        setBio(p.bio ?? '')
        setAvatarUrl(p.avatar_url ?? '')
      }
      setFetching(false)
    }
    fetchProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({
      nickname: nickname || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingAvatar(true)
    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
    }
    setUploadingAvatar(false)
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="container-d" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="max-w-2xl mx-auto py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="accent-line" />
              <span className="section-label">个人中心</span>
            </div>
            <h1
              className="text-4xl font-display"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
            >
              个人设置
            </h1>
          </div>

          {/* Avatar */}
          <div className="mb-8">
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-5">
                {/* Avatar preview */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display overflow-hidden"
                    style={{ background: 'var(--accent-bg)', border: '2px solid rgba(230,48,48,0.2)' }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ color: 'var(--accent)' }}>
                        {(nickname || user?.email || '?')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>头像</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-nunito-sans)' }}>建议正方形图片，最大 2MB</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-all"
                      style={{ background: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}
                    >
                      {uploadingAvatar ? '上传中...' : '上传头像'}
                    </button>
                    {avatarUrl && (
                      <button
                        onClick={() => setAvatarUrl('')}
                        className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                        style={{ background: 'var(--surface)', color: '#D63031', border: '1.5px solid var(--border)', fontFamily: 'var(--font-nunito-sans)' }}
                      >
                        移除
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="section-label">基本信息</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>邮箱</label>
                  <input
                    value={user?.email ?? ''}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none cursor-not-allowed"
                    style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text-mut)', fontFamily: 'var(--font-nunito-sans)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>昵称</label>
                  <input
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                    placeholder="设置一个昵称"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>个人简介</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                    placeholder="介绍一下自己..."
                    maxLength={200}
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-mut)' }}>{bio.length}/200</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: saving ? 'var(--surface-2)' : 'var(--accent)', color: saving ? 'var(--text-mut)' : '#fff', fontFamily: 'var(--font-nunito-sans)' }}
              >
                {saving ? '保存中...' : '保存设置'}
              </button>
              {saved && (
                <span className="text-sm font-mono" style={{ color: '#16A34A' }}>
                  ✓ 保存成功
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}