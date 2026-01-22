'use client'

import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng vật tư"
          value="128"
          icon={<Package size={48} />}
        />
        <StatCard
          title="Nhập kho hôm nay"
          value="15"
          icon={<ArrowDownToLine size={48} />}
        />
        <StatCard
          title="Xuất kho hôm nay"
          value="9"
          icon={<ArrowUpFromLine size={48} />}
        />
        <StatCard
          title="Sắp hết hàng"
          value="6"
          icon={<AlertTriangle size={48} />}
          danger
        />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-slate-800">
            ⚠️ Cảnh báo tồn kho
          </h2>

          <ul className="space-y-3 text-slate-600">
            <li>• Modem GPON dưới mức tồn an toàn</li>
            <li>• Cáp quang kho trung tâm sắp hết</li>
            <li>• Router Wifi chưa nhập bổ sung</li>
          </ul>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-slate-800">
            🚀 Thao tác nhanh
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <ActionButton label="Nhập kho" link="/imports" />
            <ActionButton label="Xuất kho" link="/exports" />
            <ActionButton label="Kiểm kê"  link="/stocktakes"/>
            <ActionButton label="Báo cáo"  link="/reports"/>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Components ---------------- */

function StatCard({
  title,
  value,
  icon,
  danger = false,
}: {
  title: string
  value: string
  icon: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
      {/* Icon background */}
      <div
        className={`absolute -top-2 -right-2 opacity-10 ${
          danger ? 'text-red-500' : 'text-blue-500'
        }`}
      >
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>
      <p
        className={`text-3xl font-bold mt-2 ${
          danger ? 'text-red-500' : 'text-slate-800'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function ActionButton({ label , link }: { label: string ; link: string }) {
  return (
    <Link href={link} className="rounded-xl flex items-center justify-center bg-blue-50 py-3 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
    >
      {label}
    </Link>
  )
}
