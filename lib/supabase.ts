import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  profiles: {
    id: string
    username: string
    avatar_url: string | null
    bio: string | null
    created_at: string
  }
  events: {
    id: string
    title: string
    subtitle: string | null
    cover_image: string | null
    heat: number
    tag: string
    publish_date: string
    read_time: string
    summary: string | null
    status: string
    created_by: string | null
    created_at: string
    updated_at: string
  }
  event_videos: {
    id: string
    event_id: string
    title: string
    duration: string | null
    description: string | null
    thumbnail: string | null
    video_url: string
    sort_order: number
    created_at: string
  }
  event_documents: {
    id: string
    event_id: string
    title: string
    doc_type: string
    size: string | null
    description: string | null
    file_url: string
    sort_order: number
    created_at: string
  }
  event_timelines: {
    id: string
    event_id: string
    event_time: string
    title: string
    description: string | null
    source: string | null
    sort_order: number
    created_at: string
  }
  comments: {
    id: string
    event_id: string
    user_id: string | null
    content: string
    parent_id: string | null
    created_at: string
  }
}
