'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/chigua/Navbar'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  tag: string
}

type ContentType = 'video' | 'document' | 'image' | 'text'

type SubmittedItem = {
  type: ContentType
  title: string
  id?: string
}

const CONTENT_OPTIONS: Array<{ key: ContentType; label: string; icon: string }> = [
  { key: 'video',    label: '视频',   icon: '📹' },
  { key: 'document', label: '文档',   icon: '📄' },
  { key: 'image',    label: '图片',   icon: '🖼' },
  { key: 'text',     label: '文字',   icon: '✏️' },
]

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const multiFileRef = useRef<HTMLInputElement>(null)

  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<Set<ContentType>>(new Set())
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [textContent, setTextContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedItems, setSubmittedItems] = useState<SubmittedItem[]>([])
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/upload')
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

  const toggleType = (type: ContentType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
    setFile(null)
    setFiles([])
  }

  // 拖拽上传（单文件）
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
    }
  }

  // 多文件选择（图片）
  const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? [])
    if (fs.length) {
      setFiles(fs)
      if (!title) setTitle(fs[0].name.replace(/\.[^.]+$/, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !title) {
      setError('请填写完整信息')
      return
    }
    if (selectedTypes.size === 0) {
      setError('请至少选择一种内容类型')
      return
    }

    setUploading(true)
    setError('')
    setProgress(5)

    const submitted: SubmittedItem[] = []

    try {
      for (const type of Array.from(selectedTypes)) {
        let fileUrl = ''
        let thumbnail = ''
        let docType = ''
        let contentText = ''

        if (type === 'text') {
          contentText = textContent
        } else if (type === 'image' && files.length > 0) {
          // 多图：逐一上传
          for (let i = 0; i < files.length; i++) {
            const f = files[i]
            const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
            const filename = `${selectedEvent}/${Date.now()}-${i}-${Math.random().toString(36).slice(2)}.${ext}`
            const { error: storageError } = await supabase.storage.from('gua').upload(filename, f, { cacheControl: '3600', upsert: false })
            if (storageError) throw new Error(`上传失败: ${storageError.message}`)
            const { data: urlData } = supabase.storage.from('gua').getPublicUrl(filename)
            const imgUrl = urlData.publicUrl
            const { error: dbError } = await supabase.from('event_documents').insert({
              event_id: selectedEvent,
              title: i === 0 ? title : `${title} (${i + 1})`,
              doc_type: '截图',
              description: description || null,
              file_url: imgUrl,
              thumbnail: imgUrl,
              size: formatSize(f.size),
              status: 'pending',
              created_by: user!.id,
              sort_order: i,
            })
            if (dbError) throw new Error(`保存失败: ${dbError.message}`)
            submitted.push({ type: 'image', title: i === 0 ? title : `${title} (${i + 1})` })
          }
          setProgress(60 + Math.round((type === 'image' ? 1 : 0) / selectedTypes.size * 40))
          continue
        } else if (!file) {
          setError('请选择文件')
          setUploading(false)
          return
        } else {
          const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
          const filename = `${selectedEvent}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { error: storageError } = await supabase.storage.from('gua').upload(filename, file, { cacheControl: '3600', upsert: false })
          if (storageError) throw new Error(`上传失败: ${storageError.message}`)
          const { data: urlData } = supabase.storage.from('gua').getPublicUrl(filename)
          fileUrl = urlData.publicUrl
          if (type === 'image') thumbnail = fileUrl
          if (type === 'document') {
            docType = ext === 'pdf' ? 'PDF' : ['doc', 'docx'].includes(ext) ? 'Word' : ['xls', 'xlsx'].includes(ext) ? 'Excel' : '截图'
          }
        }

        setProgress(60)

        if (type === 'text') {
          const { error: dbError } = await supabase.from('event_documents').insert({
            event_id: selectedEvent,
            title,
            doc_type: '文字',
            description: description || null,
            content_text: contentText,
            file_url: '',
            size: `${contentText.length} 字`,
            status: 'pending',
            created_by: user!.id,
            sort_order: 0,
          })
          if (dbError) throw new Error(`保存失败: ${dbError.message}`)
          submitted.push({ type: 'text', title })
        } else if (type === 'video') {
          const { error: dbError } = await supabase.from('event_videos').insert({
            event_id: selectedEvent,
            title,
            description: description || null,
            duration: duration || null,
            video_url: fileUrl,
            thumbnail: thumbnail || null,
            status: 'pending',
            created_by: user!.id,
            sort_order: 0,
          })
          if (dbError) throw new Error(`保存失败: ${dbError.message}`)
          submitted.push({ type: 'video', title })
        } else if (type === 'image') {
          const { error: dbError } = await supabase.from('event_documents').insert({
            event_id: selectedEvent,
            title,
            doc_type: '截图',
            description: description || null,
            file_url: fileUrl,
            size: file ? formatSize(file.size) : '',
            thumbnail: thumbnail || null,
            status: 'pending',
            created_by: user!.id,
            sort_order: 0,
          })
          if (dbError) throw new Error(`保存失败: ${dbError.message}`)
          submitted.push({ type: 'image', title })
        } else {
          const { error: dbError } = await supabase.from('event_documents').insert({
            event_id: selectedEvent,
            title,
            doc_type: docType,
            description: description || null,
            file_url: fileUrl,
            size: file ? formatSize(file.size) : '',
            status: 'pending',
            created_by: user!.id,
            sort_order: 0,
          })
          if (dbError) throw new Error(`保存失败: ${dbError.message}`)
          submitted.push({ type: 'document', title })
        }
      }

      setProgress(100)
      setSubmittedItems(submitted)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="container-d flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent-bg)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--accent)">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-display mb-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>
              登录后发布内容
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
              注册免费账号，发布视频、文档、图片、文字内容
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth/login" className="btn-accent px-8 py-3">登录</Link>
              <Link href="/auth/register" className="btn-outline px-8 py-3">注册</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    const eventName = events.find(e => e.id === selectedEvent)?.title ?? ''
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="container-d flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-2xl font-display mb-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>
              提交成功！
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
              已提交 {submittedItems.length} 条内容，将在审核后展示
            </p>
            {/* 内容摘要 */}
            <div className="text-left rounded-2xl p-4 mb-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>已提交内容</p>
              {submittedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5" style={{ borderBottom: i < submittedItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span className="text-xs" style={{ color: 'var(--accent)' }}>
                    {item.type === 'video' ? '📹' : item.type === 'document' ? '📄' : item.type === 'image' ? '🖼' : '✏️'}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>{item.title}</span>
                </div>
              ))}
              {eventName && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-nunito-sans)' }}>
                  关联事件：{eventName}
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => {
                  setSuccess(false)
                  setFile(null)
                  setFiles([])
                  setTitle('')
                  setDescription('')
                  setTextContent('')
                  setSelectedTypes(new Set())
                  setSelectedEvent('')
                }}
                className="btn-outline px-6 py-2.5"
              >
                继续上传
              </button>
              <Link href="/profile" className="btn-accent px-6 py-2.5">查看我的内容</Link>
              <Link href="/" className="btn-ghost px-6 py-2.5">返回首页</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 当前选中的单选类型（用于显示对应的表单）
  const currentType = selectedTypes.size === 1 ? Array.from(selectedTypes)[0] : null
  const needsFile = currentType !== null && currentType !== 'text'
  const needsMultiFile = currentType === 'image' && files.length > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="container-d" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
        <div className="max-w-2xl mx-auto py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-display mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>
              发布内容
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              选择内容类型和关联事件，提交后由管理员审核展示
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* 内容类型（多选） */}
            <div>
              <label className="block text-sm mb-3" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                内容类型 <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_OPTIONS.map(({ key, label, icon }) => {
                  const active = selectedTypes.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleType(key)}
                      className="px-3 py-3 rounded-2xl text-sm font-medium transition-all text-center flex flex-col items-center gap-1"
                      style={{
                        background: active ? 'var(--accent)' : 'var(--surface)',
                        color: active ? '#fff' : 'var(--text-2)',
                        border: active ? 'none' : '1.5px solid var(--border)',
                        fontFamily: 'var(--font-nunito-sans)',
                      }}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  )
                })}
              </div>
              {selectedTypes.size > 1 && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-mut)' }}>
                  已选择 {selectedTypes.size} 种类型，将分别提交 {selectedTypes.size} 条内容
                </p>
              )}
            </div>

            {/* 关联事件 */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                关联事件 <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required className="auth-input">
                <option value="">选择要关联的事件...</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>[{ev.tag}] {ev.title}</option>
                ))}
              </select>
            </div>

            {/* 标题 */}
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                标题 <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="给内容起个标题" required className="auth-input" />
            </div>

            {/* 视频专属：时长 */}
            {currentType === 'video' && (
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                  时长
                </label>
                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="例如：12:34" className="auth-input" />
              </div>
            )}

            {/* 文字内容 */}
            {(currentType === 'text' || selectedTypes.has('text')) && (
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                  文字内容 <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="输入文字内容..."
                  rows={6}
                  required={selectedTypes.has('text')}
                  className="auth-input resize-none"
                  style={{ fontFamily: 'var(--font-nunito-sans)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>
                  {textContent.length} 字
                </p>
              </div>
            )}

            {/* 文件选择：图片（多选） */}
            {currentType === 'image' && (
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                  选择图片（可多选） <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input
                  ref={multiFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => multiFileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all"
                  style={{
                    borderColor: dragging ? 'var(--accent)' : files.length > 0 ? 'var(--accent)' : 'var(--border)',
                    background: dragging ? 'var(--accent-bg)' : files.length > 0 ? 'var(--accent-bg)' : 'var(--surface)',
                  }}
                >
                  {files.length > 0 ? (
                    <div>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)" className="mx-auto mb-2">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                        已选择 {files.length} 张图片
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>
                        点击可重新选择
                      </p>
                      <div className="flex gap-2 justify-center mt-3 flex-wrap">
                        {files.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--accent)', color: '#fff' }}>
                            {f.name.length > 15 ? f.name.slice(0, 12) + '...' : f.name}
                          </span>
                        ))}
                        {files.length > 4 && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-mut)' }}>
                            +{files.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--text-mut)" className="mx-auto mb-2">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                      </svg>
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                        {dragging ? '松开以上传' : '点击选择多张图片，或拖拽到此处'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>支持 PNG、JPG、GIF、WebP</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 文件选择（视频/文档，单选） */}
            {needsFile && !needsMultiFile && (
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
                  选择文件 <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept={
                    currentType === 'video' ? 'video/*'
                    : currentType === 'image' ? 'image/*'
                    : '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp'
                  }
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
                  style={{
                    borderColor: dragging ? 'var(--accent)' : file ? 'var(--accent)' : 'var(--border)',
                    background: dragging ? 'var(--accent-bg)' : file ? 'var(--accent-bg)' : 'var(--surface)',
                  }}
                >
                  {file ? (
                    <div>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--accent)" className="mx-auto mb-2">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{file.name}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>{formatSize(file.size)}</p>
                    </div>
                  ) : (
                    <div>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--text-mut)" className="mx-auto mb-2">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                      </svg>
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                        {dragging ? '松开以上传' : '点击选择文件，或拖拽文件到此处'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-mut)' }}>
                        {currentType === 'video' && '支持 MP4、MOV、AVI 等'}
                        {currentType === 'image' && '支持 PNG、JPG、GIF、WebP'}
                        {currentType === 'document' && '支持 PDF、Word、Excel、图片'}
                      </p>
                    </div>
                  )}
                </div>
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
                placeholder="简单描述内容来源或背景..."
                rows={3}
                className="auth-input resize-none"
                style={{ fontFamily: 'var(--font-nunito-sans)' }}
              />
            </div>

            {/* 进度条 */}
            {uploading && (
              <div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: 'var(--accent)' }}
                  />
                </div>
                <p className="text-xs text-center mt-1" style={{ color: 'var(--text-mut)' }}>
                  {progress < 40 ? '上传文件中...' : progress < 70 ? '保存数据...' : '完成！'}
                </p>
              </div>
            )}

            {/* 错误 */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(230,48,48,0.08)', color: 'var(--accent)', border: '1px solid rgba(230,48,48,0.2)' }}>
                {error}
              </div>
            )}

            {/* 提交 */}
            <button
              type="submit"
              disabled={uploading || !selectedEvent || !title || selectedTypes.size === 0 || (needsFile ? !file : false) || (currentType === 'image' ? files.length === 0 : false)}
              className="btn-accent w-full py-3.5 text-sm disabled:opacity-40"
            >
              {uploading ? '提交中...' : `提交审核${selectedTypes.size > 1 ? ` (${selectedTypes.size}条)` : ''}`}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}