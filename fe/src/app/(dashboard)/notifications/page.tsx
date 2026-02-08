'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { auditLogsService } from '@/services/auditLogs'
import type { AuditLog } from '@/types/auditLog'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(20)

  useEffect(() => {
    fetchNotifications()
  }, [page])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await auditLogsService.getAllAuditLogs(page, pageSize)
      setNotifications(data.data)
      setTotal(data.total || 0)
    } catch (err) {
      setError('Không thể tải thông báo')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: 'Tạo mới',
      UPDATE: 'Cập nhật',
      DELETE: 'Xóa',
      EXPORT: 'Xuất',
      IMPORT: 'Nhập',
    }
    return labels[action] || action
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-700',
      UPDATE: 'bg-blue-100 text-blue-700',
      DELETE: 'bg-red-100 text-red-700',
      EXPORT: 'bg-purple-100 text-purple-700',
      IMPORT: 'bg-orange-100 text-orange-700',
    }
    return colors[action] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded transition"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-semibold">Tất cả thông báo</h1>
          </div>
          <p className="text-gray-600">Xem lịch sử hoạt động của hệ thống</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-[var(--color-border)] p-8 text-center">
            <p className="text-gray-600">Không có thông báo nào</p>
          </div>
        ) : (
          <>
            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-lg border border-[var(--color-border)] p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActionColor(notification.action)}`}
                        >
                          {getActionLabel(notification.action)}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          {notification.entityName}
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {notification.entityId}
                        </span>
                      </div>

                      {/* Changes info */}
                      {notification.oldValue && notification.newValue && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <p className="text-gray-600 mb-2">
                            <strong>Thay đổi:</strong>
                          </p>
                          <div className="space-y-1">
                            <p className="text-gray-700">
                              <strong className="text-red-600">Cũ:</strong>{' '}
                              <code className="bg-white px-2 py-1 rounded text-xs">
                                {JSON.stringify(notification.oldValue)}
                              </code>
                            </p>
                            <p className="text-gray-700">
                              <strong className="text-green-600">Mới:</strong>{' '}
                              <code className="bg-white px-2 py-1 rounded text-xs">
                                {JSON.stringify(notification.newValue)}
                              </code>
                            </p>
                          </div>
                        </div>
                      )}

                      {notification.newValue && !notification.oldValue && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <p className="text-gray-600 mb-2">
                            <strong>Dữ liệu:</strong>
                          </p>
                          <code className="bg-white px-2 py-1 rounded text-xs block overflow-auto max-h-32">
                            {JSON.stringify(notification.newValue, null, 2)}
                          </code>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="mt-3 text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-[var(--color-border)] rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Trước
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) =>
                      (p === 1 ||
                        p === totalPages ||
                        Math.abs(p - page) <= 1) && (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-2 rounded transition ${
                            p === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-[var(--color-border)] hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ),
                  )}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-[var(--color-border)] rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Sau
                </button>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Hiển thị {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} của {total} thông báo
            </div>
          </>
        )}
      </div>
    </div>
  )
}
