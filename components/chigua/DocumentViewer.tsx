'use client'

import { useState } from 'react'

interface DocumentItem {
  id: string
  title: string
  type: string
  size: string
  description: string
  contentText?: string
  fileUrl?: string
  thumbnail?: string
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  PDF:   { bg: '#FFF0F0', text: '#D63031' },
  Word:  { bg: '#EEF4FF', text: '#2563EB' },
  Excel: { bg: '#EDFAF3', text: '#16A34A' },
  截图:  { bg: '#F5F3F0', text: '#6B6B70' },
  文字:  { bg: '#FFF9E6', text: '#B8860B' },
}

function ImageLightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        className="rounded-xl overflow-hidden cursor-zoom-in relative"
        style={{ height: 160 }}
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={() => setOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default function DocumentViewer({ documents }: { documents: DocumentItem[] }) {
  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const colors = TYPE_COLORS[doc.type] || TYPE_COLORS['截图']

        // 文字类型：渲染文字内容块
        if (doc.type === '文字') {
          return (
            <div key={doc.id} className="doc-card">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: colors.bg, border: `1px solid ${colors.text}20` }}
              >
                <span className="text-xs font-mono font-bold" style={{ color: colors.text, fontFamily: 'var(--font-jetbrains)' }}>
                  文字
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 leading-snug" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>
                  {doc.title}
                </h4>
                {doc.contentText && (
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed mt-2"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                      fontFamily: 'var(--font-nunito-sans)',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {doc.contentText}
                  </div>
                )}
                <span className="text-xs font-mono mt-2 inline-block" style={{ color: 'var(--text-mut)' }}>
                  {doc.size}
                </span>
              </div>
            </div>
          )
        }

        // 截图类型：渲染图片预览
        if (doc.type === '截图') {
          const imageSrc = doc.thumbnail || doc.fileUrl || ''
          return (
            <div key={doc.id} className="doc-card">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-2 leading-snug" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>
                  {doc.title}
                </h4>
                {imageSrc ? (
                  <ImageLightbox src={imageSrc} alt={doc.title} />
                ) : (
                  <div
                    className="rounded-xl flex items-center justify-center"
                    style={{ height: 120, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-mut)' }}
                  >
                    <span className="text-xs font-mono">无图片</span>
                  </div>
                )}
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-2)' }}>
                  {doc.description}
                </p>
                <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
                  {doc.size}
                </span>
              </div>
            </div>
          )
        }

        // PDF / Word / Excel：默认下载/查看卡片
        return (
          <div key={doc.id} className="doc-card">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: colors.bg, border: `1px solid ${colors.text}20` }}
            >
              <span className="text-xs font-mono font-bold" style={{ color: colors.text, fontFamily: 'var(--font-jetbrains)' }}>
                {doc.type}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 leading-snug" style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}>
                {doc.title}
              </h4>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-2)' }}>
                {doc.description}
              </p>
              <span className="text-xs font-mono" style={{ color: 'var(--text-mut)' }}>
                {doc.size}
              </span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent text-xs px-4 py-2"
              >
                查看文档
              </a>
              <a
                href={doc.fileUrl}
                download
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: 'var(--text-mut)', fontFamily: 'var(--font-jetbrains)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                下载
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
