'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useAuthStore } from '@/store/auth.store'
import { PERMISSIONS } from '@/utils/permission'

const menus = [
  { key: 'materials', label: 'Vật tư', path: '/materials' },
  { key: 'warehouses', label: 'Kho', path: '/warehouses' },
  { key: 'suppliers', label: 'Nhà cung cấp', path: '/suppliers' },
  { key: 'stocks', label: 'Tồn kho', path: '/stocks' },
  { key: 'imports', label: 'Nhập kho', path: '/imports' },
  { key: 'exports', label: 'Xuất kho', path: '/exports' },
  { key: 'stocktakes', label: 'Kiểm kê', path: '/stocktakes' },
  { key: 'reports', label: 'Báo cáo', path: '/reports' },
  { key: 'users', label: 'Người dùng', path: '/users' },
  { key: 'journalEntries', label: 'Sổ nhật ký', path: '/journalEntries' },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const pathname = usePathname()

  if (!user || !user.role) return null

  const allowed = PERMISSIONS[user.role] || []

  return (
    <aside className="sidebar w-64 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <div className="text-xs text-text-muted uppercase">
          Kế toán vật tư
        </div>

        <div className="font-semibold mt-1">
          {user.name}
        </div>

        <div className="text-xs text-text-muted">
          Quyền: {user.role}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-3 space-y-1">
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
                'sidebar-item flex items-center justify-between',
                isActive && canAccess && 'active',
                !canAccess && 'disabled'
              )}
            >
              <span>{menu.label}</span>

              {!canAccess && (
                <span className="text-xs">🔒</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border text-xs text-text-muted">
        © VNPT Yên Bái
      </div>
    </aside>
  )
}
