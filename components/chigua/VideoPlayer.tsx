'use client'
import { useState } from 'react'

interface VideoItem {
  id: string
  title: string
  duration: string
  description: string
  thumbnail: string
  videoUrl: string
}

export default function VideoPlayer({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState(videos[0])

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => setActiveVideo(video)}
          className="doc-card cursor-pointer"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div className="flex gap-0">
            {/* Thumbnail */}
            <div className="relative w-36 h-24 flex-shrink-0 overflow-hidden rounded-l-2xl">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <span
                className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-xs font-mono"
                style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
              >
                {video.duration}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 p-4 min-w-0">
              <h4
                className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-nunito-sans)' }}
              >
                {video.title}
              </h4>
              <p className="text-xs line-clamp-2" style={{ color: 'var(--text-2)' }}>
                {video.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Player */}
      {activeVideo && (
        <div
          className="fade-up rounded-2xl overflow-hidden"
          style={{
            background: '#000',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <video
            key={activeVideo.id}
            src={activeVideo.videoUrl}
            className="w-full"
            style={{ maxHeight: 400, objectFit: 'contain' }}
            controls
            autoPlay={false}
          />
        </div>
      )}
    </div>
  )
}
