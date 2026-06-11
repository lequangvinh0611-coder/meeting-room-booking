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
      {/* Flex ngang, khóa cuộn tổng thể (h-screen overflow-hidden), dùng màu xám cực nhạt để làm nổi bật content */}
      <body className="font-sans antialiased flex h-screen overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Component này sẽ tự động biến đổi tùy theo PC hay Mobile */}
        <Navigation /> 
        
        {/* Khu vực nội dung được cuộn độc lập. 
            pb-24: Tạo khoảng trống dưới cùng trên Mobile để không bị Bottom Nav che mất nội dung
            md:pb-0: Bỏ khoảng trống này đi khi lên màn hình Desktop */}
        <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative pb-24 md:pb-0">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
