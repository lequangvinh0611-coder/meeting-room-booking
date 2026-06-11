import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Hệ thống Đặt phòng họp',
  description: 'Quản lý lịch đặt phòng họp Cybozu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased flex h-screen overflow-hidden bg-slate-50 text-slate-900">
        
        <Navigation /> 
        
        {/* Đã thêm no-scrollbar, bỏ max-w-7xl và thay bằng w-full để tràn viền */}
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative pb-24 md:pb-0 w-full">
          <div className="w-full mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
