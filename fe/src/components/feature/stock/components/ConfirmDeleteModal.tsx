import Modal from '@/components/shared/form/Modal'

interface ConfirmDeleteModalProps {
  open: boolean
  title?: string
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({
  open,
  title = 'Xác nhận xóa',
  itemName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p>
          Bạn có chắc chắn muốn xóa <strong>{itemName}</strong> này không?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  )
}
