'use client'

type Props = {
  open: boolean
  title?: string
  message?: string
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({
  open,
  title = 'Xác nhận xóa?',
  message = 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}
