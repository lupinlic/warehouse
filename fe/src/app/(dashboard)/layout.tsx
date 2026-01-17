'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { getUserFromCookie } from '@/utils/get-user-from-cookie'
import Sidebar from '@/components/shared/layouts/Sidebar'
import Header from '@/components/shared/layouts/Header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      const cookieUser = getUserFromCookie()
      if (cookieUser) {
        useAuthStore.setState({ user: cookieUser })
      } else {
        router.push('/login')
      }
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
