'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  tag: string
  heat: number
  status: string
  publish_date: string
  content_count: number
  cover_image: string | null
}

const TAGS = ['全部', '娱乐', '科技', '财经', '社会', '国际']
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: '已发布', color: '#16A34A', bg: '#DCFCE7' },
  draft:     { label: '草稿',   color: '#8B5CF6', bg: '#EDE9FE' },
  archived:  { label: '已归档', color: '#8A8A9A', bg: '#F3F4F6' },
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState('全部')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editHeat, setEditHeat] = useState<Record<string, number>>({})
  const [showCreate, setShowCreate] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', tag: '娱乐', subtitle: '', summary: '', cover_image: '' })

  const fetchEvents = async () => {
    setLoading(true)
    let query = supabase.from('events').select('*').order('created_at', { ascending: false })
    if (activeTag !== '全部') query = query.eq('tag', activeTag)
    const { data } = await query

    const items = (data ?? []).map((e: Record<string, unknown>) => {
      const vCount = 0 // placeholder, would need subquery
      const dCount = 0
      return { ...e, id: e.id as string, title: e.title as string, tag: e.tag as string, heat: e.heat as number, status: e.status as string, publish_date: e.publish_date as string, cover_image: e.cover_image as string | null, content_count: vCount + dCount } as Event
    })
    setEvents(items)
    const heatMap: Record<string, number> = {}
    items.forEach(e => { heatMap[e.id] = e.heat })
    setEditHeat(heatMap)
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [activeTag])

  const handleHeatSave = async (id: string) => {
    const heat = editHeat[id] ?? 0
    await supabase.from('events').update({ heat }).eq('id', id)
    setEditingId(null)
    fetchEvents()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除该事件？')) return
    await supabase.from('events').update({ status: 'archived' }).eq('id', id)
    fetchEvents()
  }

  const handleCreate = async () => {
    if (!newEvent.title.trim()) return
    await supabase.from('events').insert({
      title: newEvent.title,
      tag: newEvent.tag,
      subtitle: newEvent.subtitle,
      summary: newEvent.summary,
      cover_image: newEvent.cover_image || null,
      status: 'draft',
      heat: 0,
      publish_date: new Date().toISOString().slice(0, 10),
      read_time: '5分钟',
    })
    setShowCreate(false)
    setNewEvent({ title: '', tag: '娱乐', subtitle: '', summary: '', cover_image: '' })
    fetchEvents()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>事件管理</h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>共 {events.length} 个事件</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all"
          style={{ background: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}
        >
          + 新建事件
        </button>
      </div>

      {/* Tag filter */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className="px-3 py-1.5 rounded-full text-xs font-mono transition-all"
            style={{
              fontFamily: 'var(--font-jetbrains)',
              background: activeTag === tag ? 'var(--accent)' : 'var(--surface)',
              color: activeTag === tag ? '#fff' : 'var(--text-2)',
              border: activeTag === tag ? 'none' : '1.5px solid var(--border)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-display mb-5" style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-serif)' }}>新建事件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>事件标题 *</label>
                <input
                  value={newEvent.title}
                  onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                  placeholder="输入事件标题"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>分类</label>
                  <select
                    value={newEvent.tag}
                    onChange={e => setNewEvent(n => ({ ...n, tag: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                  >
                    {['娱乐', '科技', '财经', '社会', '国际'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>封面图URL</label>
                  <input
                    value={newEvent.cover_image}
                    onChange={e => setNewEvent(n => ({ ...n, cover_image: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>副标题</label>
                <input
                  value={newEvent.subtitle}
                  onChange={e => setNewEvent(n => ({ ...n, subtitle: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                  placeholder="简短描述"
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>事件概要</label>
                <textarea
                  value={newEvent.summary}
                  onChange={e => setNewEvent(n => ({ ...n, summary: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
                  placeholder="详细描述事件背景..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: 'var(--accent)', fontFamily: 'var(--font-nunito-sans)' }}>
                创建
              </button>
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-nunito-sans)' }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: 'var(--text-2)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['事件', '分类', '热度', '状态', '发布日期', '操作'].map(h => (
                  <th key={h} className="text-left pb-3 font-medium text-xs" style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(e => {
                const statusInfo = STATUS_MAP[e.status] ?? STATUS_MAP.draft
                return (
                  <tr key={e.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {e.cover_image && (
                          <img src={e.cover_image} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" alt="" />
                        )}
                        <span className="font-medium text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)', maxWidth: 200 }}>{e.title}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-xs">{e.tag}</td>
                    <td className="py-4">
                      {editingId === e.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editHeat[e.id] ?? 0}
                            onChange={ev => setEditHeat(prev => ({ ...prev, [e.id]: Number(ev.target.value) }))}
                            className="w-20 px-2 py-1 rounded-lg text-xs text-center outline-none"
                            style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-jetbrains)' }}
                          />
                          <button onClick={() => handleHeatSave(e.id)} className="text-xs px-2 py-1 rounded-lg text-white" style={{ background: '#16A34A', fontFamily: 'var(--font-jetbrains)' }}>保存</button>
                          <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>取消</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditingId(e.id)} className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-mut)' }}>
                          {e.heat.toLocaleString()} ✎
                        </button>
                      )}
                    </td>
                    <td className="py-4">
                      <span className="text-xs px-2 py-1 rounded-full font-mono" style={{ background: statusInfo.bg, color: statusInfo.color }}>{statusInfo.label}</span>
                    </td>
                    <td className="py-4 font-mono text-xs">{e.publish_date}</td>
                    <td className="py-4">
                      <button onClick={() => handleDelete(e.id)} className="text-xs px-3 py-1.5 rounded-full" style={{ background: '#FFF3ED', color: '#D63031', fontFamily: 'var(--font-nunito-sans)' }}>
                        删除
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {events.length === 0 && (
            <p className="text-center py-12 text-sm font-mono" style={{ color: 'var(--text-mut)' }}>暂无事件</p>
          )}
        </div>
      )}
    </div>
  )
}