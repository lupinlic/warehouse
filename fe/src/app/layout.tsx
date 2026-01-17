import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phần mềm kế toán vật tư - VNPT Yên Bái',
  description: 'Hệ thống quản lý kế toán vật tư tại VNPT Yên Bái',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
