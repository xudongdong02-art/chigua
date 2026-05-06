import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth'

export const metadata: Metadata = {
  title: '吃瓜 - 热点事件内容聚合平台',
  description: '一站式找到热点事件的视频、文档、时间线。完整、真实、不用拼凑。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.cn" />
        <link rel="preconnect" href="https://fonts.gstatic.cn" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.cn/css2?family=DM+Serif+Display&family=Nunito+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
