'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

type Comment = {
  id: string
  user_id: string
  content: string
  parent_id: string | null
  created_at: string
  profiles: { nickname: string | null; avatar_url: string | null; email: string } | null
  replies?: Comment[]
}

type Props = {
  eventId: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

function CommentItem({
  comment,
  onDelete,
  currentUserId,
  onReply,
  isReply = false,
}: {
  comment: Comment
  onDelete: (id: string) => void
  currentUserId: string | undefined
  onReply: (id: string, content: string) => void
  isReply?: boolean
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  const handleReply = () => {
    if (!replyText.trim()) return
    onReply(comment.id, replyText.trim())
    setReplyText('')
    setReplyOpen(false)
  }

  const avatar = comment.profiles?.avatar_url
  const initial = (comment.profiles?.nickname || comment.profiles?.email || '?')[0].toUpperCase()
  const canDelete = currentUserId === comment.user_id

  return (
    <div className={isReply ? 'pl-8 border-l-2' : ''} style={{ borderColor: 'var(--border)' }}>
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
        >
          {avatar ? (
            <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
            >
              {comment.profiles?.nickname || comment.profiles?.email || '匿名用户'}
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
            {comment.content}
          </p>
          <div className="flex items-center gap-3">
            {!isReply && (
              <button
                onClick={() => setReplyOpen(!replyOpen)}
                className="text-xs font-mono transition-colors"
                style={{ color: 'var(--text-mut)' }}
              >
                回复
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs font-mono transition-colors"
                style={{ color: '#D63031' }}
              >
                删除
              </button>
            )}
          </div>

          {/* Reply input */}
          {replyOpen && (
            <div className="mt-2 flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleReply() }}
                placeholder={`回复 @${comment.profiles?.nickname || comment.profiles?.email || '匿名'}`}
                className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                style={{
                  background: 'var(--surface-2)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-nunito-sans)',
                }}
              />
              <button
                onClick={handleReply}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}
              >
                发送
              </button>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-1">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({ eventId }: Props) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = async () => {
    const { data } = await supabase
      .from('event_comments')
      .select('*, profiles(nickname, avatar_url, email)')
      .eq('event_id', eventId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    // Fetch replies for each top-level comment
    const withReplies = await Promise.all(
      (data ?? []).map(async (c: Record<string, unknown>) => {
        const { data: replies } = await supabase
          .from('event_comments')
          .select('*, profiles(nickname, avatar_url, email)')
          .eq('parent_id', c.id)
          .order('created_at', { ascending: true })
        return { ...c, replies: replies ?? [] } as Comment
      })
    )
    setComments(withReplies)
    setLoading(false)
  }

  useEffect(() => { fetchComments() }, [eventId])

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return
    setSubmitting(true)
    await supabase.from('event_comments').insert({
      event_id: eventId,
      user_id: user.id,
      content: newComment.trim(),
      parent_id: null,
    })
    setNewComment('')
    setSubmitting(false)
    fetchComments()
  }

  const handleReply = async (parentId: string, content: string) => {
    if (!user) return
    await supabase.from('event_comments').insert({
      event_id: eventId,
      user_id: user.id,
      content,
      parent_id: parentId,
    })
    fetchComments()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除这条评论？')) return
    await supabase.from('event_comments').delete().eq('id', id)
    fetchComments()
  }

  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="section-label">评论 ({totalComments})</span>
      </div>

      {/* Comment Input */}
      {user ? (
        <div className="flex gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {user.email?.[0].toUpperCase() ?? '?'}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="写下你的评论... (最多500字)"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
                fontFamily: 'var(--font-nunito-sans)',
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>{newComment.length}/500</span>
              <button
                onClick={handleSubmit}
                disabled={submitting || !newComment.trim()}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}
              >
                {submitting ? '发送中...' : '发表评论'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="text-center py-5 mb-6 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm mb-3" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-nunito-sans)' }}>
            登录后参与评论
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-5 py-2 rounded-full text-xs font-semibold text-white"
            style={{ background: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}
          >
            登录 / 注册
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: 'var(--text-mut)' }}>暂无评论，快来抢沙发</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              currentUserId={user?.id}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}