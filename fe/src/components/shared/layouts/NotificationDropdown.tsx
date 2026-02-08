'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Loader2 } from 'lucide-react'
import { auditLogsService } from '@/services/auditLogs'
import type { AuditLog } from '@/types/auditLog'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  onCountChange?: (count: number) => void
}

export function NotificationDropdown({ isOpen, onClose, onCountChange }: NotificationDropdownProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<AuditLog[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications()
    }
  }, [isOpen])

  const fetchRecentNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await auditLogsService.getRecentAuditLogsWithCount(5)
      setNotifications(result.data)
      setTotalCount(result.total)
      onCountChange?.(result.total)
    } catch (err) {
      setError('Không thể tải thông báo')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewAll = () => {
    onClose()
    router.push('/notifications')
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Panel */}
      <div className="absolute right-0 top-[calc(100%+8px)] w-96 bg-white border border-[var(--color-border)] rounded shadow-lg z-50">
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">Thông báo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={20} />
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-sm text-red-600">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Không có thông báo nào
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          {getActionLabel(notification.action)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.entityName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {notification.oldValue && notification.newValue
                          ? `Đã thay đổi từ ${JSON.stringify(notification.oldValue)} thành ${JSON.stringify(notification.newValue)}`
                          : notification.newValue
                            ? `Dữ liệu: ${JSON.stringify(notification.newValue).substring(0, 100)}...`
                            : `ID: ${notification.entityId}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - View All Button */}
        {!isLoading && !error && notifications.length > 0 && (
          <div className="border-t px-4 py-3">
            <button
              onClick={handleViewAll}
              className="w-auto px-2 rounded-md flex cursor-pointer hover:bg-blue-100 items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Xem tất cả
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
