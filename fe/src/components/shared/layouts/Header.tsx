'use client'

import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

export default function Header() {
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
      <span className="font-semibold">Kế toán vật tư VNPT Yên Bái</span>

      <button
        className="text-sm text-red-600"
        onClick={handleLogout}
      >
        Đăng xuất
      </button>
    </header>
  )
}
