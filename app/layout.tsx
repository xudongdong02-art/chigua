import './globals.css'
import type { Metadata } from 'next'
import { DM_Serif_Display, Nunito_Sans, JetBrains_Mono, Noto_Serif_SC } from 'next/font/google'
import { AuthProvider } from '@/lib/auth'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '吃瓜 - 热点事件内容聚合平台',
  description: '一站式找到热点事件的视频、文档、时间线。完整、真实、不用拼凑。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${dmSerif.variable} ${nunitoSans.variable} ${jetbrainsMono.variable} ${notoSerifSC.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
