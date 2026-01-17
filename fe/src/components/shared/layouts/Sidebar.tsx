'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useAuthStore } from '@/store/auth.store'
import { PERMISSIONS } from '@/utils/permission'

const menus = [
  { key: 'materials', label: 'Vật tư', path: '/materials', icon: '📦' },
  { key: 'warehouses', label: 'Kho', path: '/warehouses', icon: '🏬' },
  { key: 'suppliers', label: 'Nhà cung cấp', path: '/suppliers', icon: '🤝' },
  { key: 'imports', label: 'Nhập kho', path: '/imports', icon: '⬇️' },
  { key: 'exports', label: 'Xuất kho', path: '/exports', icon: '⬆️' },
  { key: 'stocktakes', label: 'Kiểm kê', path: '/stocktakes', icon: '📝' },
  { key: 'reports', label: 'Báo cáo', path: '/reports', icon: '📊' },
  { key: 'users', label: 'Người dùng', path: '/users', icon: '👤' },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const pathname = usePathname()

  if (!user) return null

  const allowed = PERMISSIONS[user.role]

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="text-sm text-gray-400">Hệ thống</div>
        <div className="font-bold">{user.name}</div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {menus.map((menu) => {
          const canAccess = allowed.includes(menu.key)
          const isActive = pathname === menu.path

          return (
            <Link
              key={menu.key}
              href={canAccess ? menu.path : '#'}
              onClick={(e) => {
                if (!canAccess) e.preventDefault()
              }}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded transition-all',
                isActive && canAccess && 'bg-blue-600 text-white',
                canAccess &&
                  !isActive &&
                  'text-gray-300 hover:bg-gray-800 hover:text-white',
                !canAccess &&
                  'bg-gray-800 text-gray-500 cursor-not-allowed'
              )}
            >
              <span className="text-lg">{menu.icon}</span>
              <span className="flex-1">{menu.label}</span>

              {!canAccess && (
                <span className="text-sm text-gray-400">🔒</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 text-xs text-gray-400">
        VNPT Yên Bái
      </div>
    </aside>
  )
}
