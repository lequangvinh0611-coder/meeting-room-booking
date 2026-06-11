import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header' // <-- IMPORT MENU VÀO ĐÂY

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Hệ thống Đặt phòng họp',
  description: 'Quản lý lịch đặt phòng họp Cybozu',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* Sửa lại class của body để có hình nền xám nhạt và bọc bố cục */}
      <body className="font-sans antialiased min-h-screen bg-muted/20 flex flex-col">
        
        {/* ĐẶT THANH MENU Ở ĐÂY ĐỂ NÓ HIỆN Ở MỌI TRANG */}
        <SiteHeader /> 
        
        {/* PHẦN NỘI DUNG CÁC TRANG SẼ HIỂN THỊ BÊN TRONG THẺ MAIN NÀY */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
