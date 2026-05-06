'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/chigua/Navbar'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  tag: string
}

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [contentType, setContentType] = useState<'video' | 'document'>('video')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('id, title, tag')
        .eq('status', 'published')
        .order('heat', { ascending: false })
      if (data) setEvents(data)
    }
    if (user) fetchEvents()
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      if (!title) {
        setTitle(f.name.replace(/\.[^.]+$/, ''))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !file || !title) {
      setError('请填写完整信息')
      return
    }

    setUploading(true)
    setError('')
    setUploadProgress(10)

    try {
      // 1. 生成唯一文件名
      const ext = file.name.split('.').pop()
      const filename = `${selectedEvent}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      // 2. 上传到 Storage
      const { error: storageError } = await supabase.storage
        .from('gua')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (storageError) throw new Error(`上传失败: ${storageError.message}`)

      setUploadProgress(60)

      // 3. 获取公开URL
      const { data: urlData } = supabase.storage
        .from('gua')
        .getPublicUrl(filename)

      const fileUrl = urlData.publicUrl

      // 4. 保存到数据库
      if (contentType === 'video') {
        const { error: dbError } = await supabase.from('event_videos').insert({
          event_id: selectedEvent,
          title,
          description: description || null,
          duration: duration || null,
          video_url: fileUrl,
          thumbnail: null,
          sort_order: 0,
        })
        if (dbError) throw new Error(`保存失败: ${dbError.message}`)
      } else {
        const docType = ext === 'pdf' ? 'PDF'
          : ext === 'doc' || ext === 'docx' ? 'Word'
          : ext === 'xls' || ext === 'xlsx' ? 'Excel'
          : '其他'

        const { error: dbError } = await supabase.from('event_documents').insert({
          event_id: selectedEvent,
          title,
          doc_type: docType,
          description: description || null,
          size: formatSize(file.size),
          file_url: fileUrl,
          sort_order: 0,
        })
        if (dbError) throw new Error(`保存失败: ${dbError.message}`)
      }

      setUploadProgress(100)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '上传出错')
    } finally {
      setUploading(false)
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="container-d py-20 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2
            className="text-3xl font-display mb-3"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
          >
            上传成功！
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
            内容已提交，将在审核后展示
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSuccess(false); setFile(null); setTitle(''); setDescription('') }}
              className="btn-outline text-sm"
            >
              继续上传
            </button>
            <a href="/" className="btn-accent text-sm">返回首页</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="container-d py-12 max-w-2xl">
        <div className="mb-8">
          <h1
            className="text-4xl font-display mb-2"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}
          >
            上传内容
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            上传视频或文档到已有事件，管理员审核后展示
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 内容类型 */}
          <div>
            <label className="block text-sm mb-3" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
              内容类型
            </label>
            <div className="flex gap-3">
              {(['video', 'document'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className="px-6 py-3 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    background: contentType === type ? 'var(--accent)' : 'var(--surface)',
                    color: contentType === type ? '#fff' : 'var(--text-2)',
                    border: contentType === type ? 'none' : '1.5px solid var(--border)',
                    fontFamily: 'var(--font-nunito-sans)',
                  }}
                >
                  {type === 'video' ? '📹 视频' : '📄 文档'}
                </button>
              ))}
            </div>
          </div>

          {/* 关联事件 */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
              关联事件 <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              required
              className="auth-input"
            >
              <option value="">选择要关联的事件...</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  [{ev.tag}] {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
              标题 <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给内容起个标题"
              required
              className="auth-input"
            />
          </div>

          {/* 视频专属：时长 */}
          {contentType === 'video' && (
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                时长
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="例如：12:34"
                className="auth-input"
              />
            </div>
          )}

          {/* 描述 */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
              内容描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述内容..."
              rows={3}
              className="auth-input resize-none"
            />
          </div>

          {/* 文件选择 */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
              选择文件 <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept={contentType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg'}
              onChange={handleFileChange}
              required
              className="hidden"
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
              style={{
                borderColor: file ? 'var(--accent)' : 'var(--border)',
                background: file ? 'var(--accent-bg)' : 'var(--surface)',
              }}
            >
              {file ? (
                <div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)" className="mx-auto mb-2">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                    {file.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>
                    {formatSize(file.size)}
                  </p>
                </div>
              ) : (
                <div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--text-mut)" className="mx-auto mb-2">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                  <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                    点击选择文件
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>
                    {contentType === 'video'
                      ? '支持 MP4、MOV、AVI 等视频格式'
                      : '支持 PDF、Word、Excel、图片等'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 进度条 */}
          {uploading && (
            <div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                    background: 'var(--accent)',
                  }}
                />
              </div>
              <p className="text-xs text-center mt-1" style={{ color: 'var(--text-mut)' }}>
                上传中... {uploadProgress}%
              </p>
            </div>
          )}

          {/* 错误 */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(230,48,48,0.08)', color: 'var(--accent)', border: '1px solid rgba(230,48,48,0.2)' }}
            >
              {error}
            </div>
          )}

          {/* 提交 */}
          <button
            type="submit"
            disabled={uploading || !selectedEvent || !file || !title}
            className="btn-accent w-full py-3.5 text-sm disabled:opacity-40"
          >
            {uploading ? '上传中...' : '提交审核'}
          </button>
        </form>
      </main>
    </div>
  )
}
