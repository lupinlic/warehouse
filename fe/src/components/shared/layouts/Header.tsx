'use client'

import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { Bell, HelpCircle, ChevronDown, LogOut, User, Settings } from 'lucide-react'

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-[var(--color-border)] px-6 flex items-center justify-between">
      {/* Left */}
      <div className="font-semibold text-sm">KẾ TOÁN VẬT TƯ – VNPT YÊN BÁI</div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">
        {/* Help */}
        <button className="text-gray-500 hover:text-gray-700">
          <HelpCircle size={18} />
        </button>

        {/* Notification */}
        <button className="text-gray-500 hover:text-gray-700">
          <Bell size={18} />
        </button>

        {/* User Hover Area */}
        {/* User Hover Area */}
        <div className="relative group">
          {/* Trigger */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center font-semibold text-sm">
              {user?.name.charAt(0)}
            </div>

            <div className="text-sm">{user?.name}</div>

            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {/* Hover Bridge */}
          <div className="absolute left-0 right-0 h-3 top-full"></div>

          {/* Dropdown */}
          <div
            className="
      absolute right-0 top-[calc(100%+12px)]
      w-48 bg-white border border-[var(--color-border)]
      rounded shadow-md text-sm z-50
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition
    "
          >
            <div className="px-3 py-2 border-b text-xs text-gray-500">Quyền: {user?.role}</div>

            <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100">
              <User size={16} />
              Thông tin cá nhân
            </button>

            <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100">
              <Settings size={16} />
              Cài đặt
            </button>

            <button
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
