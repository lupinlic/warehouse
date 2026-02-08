'use client'

import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Clipboard,
  Users,
  Database,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { PERMISSIONS } from '@/utils/permission'

const FEATURES = [
  {
    key: 'imports',
    label: 'Nhập kho',
    link: '/imports',
    icon: <ArrowDownToLine size={24} />,
  },
  {
    key: 'exports',
    label: 'Xuất kho',
    link: '/exports',
    icon: <ArrowUpFromLine size={24} />,
  },
  {
    key: 'stocktakes',
    label: 'Kiểm kê',
    link: '/stocktakes',
    icon: <Clipboard size={24} />,
  },
  {
    key: 'reports',
    label: 'Báo cáo',
    link: '/reports',
    icon: <FileText size={24} />,
  },
  {
    key: 'materials',
    label: 'Vật tư',
    link: '/materials',
    icon: <Package size={24} />,
  },
  {
    key: 'warehouses',
    label: 'Kho',
    link: '/warehouses',
    icon: <Database size={24} />,
  },
  {
    key: 'suppliers',
    label: 'Nhà cung cấp',
    link: '/suppliers',
    icon: <Users size={24} />,
  },
  {
    key: 'users',
    label: 'Người dùng',
    link: '/users',
    icon: <Users size={24} />,
  },
  {
    key: 'stocks',
    label: 'Tồn kho',
    link: '/stocks',
    icon: <Package size={24} />,
  },
  {
    key: 'journalEntries',
    label: 'Sổ nhật ký',
    link: '/journalEntries',
    icon: <Clipboard size={24} />,
  },
  {
    key: 'systemLogs',
    label: 'Nhật ký hệ thống',
    link: '/notifications',
    icon: <Clipboard size={24} />,
  },
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const userPermissions = user?.role ? PERMISSIONS[user.role] || [] : []

  const allowedFeatures = FEATURES.filter((feature) =>
    userPermissions.includes(feature.key)
  )

  const deniedFeatures = FEATURES.filter((feature) =>
    !userPermissions.includes(feature.key)
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Tổng quan nhanh hệ thống quản lý vật tư
        </p>
      </div>

      {/* Quick actions */}
      {allowedFeatures.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-6 text-slate-800">
            🚀 Phương tiện nhanh
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {allowedFeatures.map((feature) => (
              <ActionButton
                key={feature.key}
                label={feature.label}
                link={feature.link}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4 text-slate-800">
          ℹ️ Thông tin hệ thống
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <p>Hệ thống quản lý vật tư toàn diện cho VNPT Yên Bái</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <p>Quản lý nhập/xuất, kiểm kê và báo cáo tồn kho</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <p>Theo dõi nhật ký hệ thống từ menu bên trái</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <p>Kiểm tra thông báo mới từ icon chuông trên thanh header</p>
          </div>
        </div>
      </div>

      {/* Restricted features info */}
      {deniedFeatures.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm border border-orange-100">
          <h2 className="font-semibold text-lg mb-4 text-slate-800 flex items-center gap-2">
            <Lock size={20} className="text-orange-600" />
            Tính năng bị giới hạn
          </h2>

          <p className="text-slate-600 text-sm mb-4">
            Bạn không có quyền truy cập các tính năng sau:
          </p>

          <div className="flex flex-wrap gap-2">
            {deniedFeatures.map((feature) => (
              <span
                key={feature.key}
                className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
              >
                <Lock size={14} />
                {feature.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- Components ---------------- */

function ActionButton({
  label,
  link,
  icon,
}: {
  label: string
  link: string
  icon?: React.ReactNode
}) {
  return (
    <Link
      href={link}
      className="rounded-xl flex flex-col items-center justify-center gap-3 bg-blue-50 p-4 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
    >
      {icon && <div className="text-blue-600">{icon}</div>}
      <span className="text-center">{label}</span>
    </Link>
  )
}
