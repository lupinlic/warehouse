import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Phần mềm kế toán vật tư - VNPT Yên Bái',
  description: 'Hệ thống quản lý kế toán vật tư tại VNPT Yên Bái',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Toaster position="top-right" richColors closeButton />
        {children}
      </body>
    </html>
  )
}
