// Shared types used across components
// Avoids importing from mockData

export interface EventSummary {
  id: string
  title: string
  subtitle: string | null
  cover_image: string | null
  heat: number
  tag: string
  publish_date: string
  read_time: string
  summary: string | null
}

export interface VideoItem {
  id: string
  title: string
  duration: string | null
  description: string | null
  thumbnail: string | null
  video_url: string
}

export interface DocumentItem {
  id: string
  title: string
  doc_type: string
  size: string | null
  description: string | null
  file_url: string
}

export interface TimelineItem {
  id: string
  event_time: string
  title: string
  description: string | null
  source: string | null
}
