import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export const journalEntryColumns = [
  {
    key: 'code',
    label: 'Mã phiếu',
    sortable: true,
  },
  {
    key: 'date',
    label: 'Ngày',
    sortable: true,
    render: (row: any) => format(new Date(row.date), 'dd/MM/yyyy', { locale: vi }),
  },
  {
    key: 'description',
    label: 'Mô tả',
    sortable: true,
    // allow wrapping and constrain width so table doesn't overflow
    className: 'max-w-[40ch] break-words',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    sortable: true,
    render: (row: any) => {
      const statusMap: Record<string, { label: string; color: string }> = {
        POSTED: { label: 'Đã ghi', color: 'bg-green-100 text-green-800' },
        DRAFT: { label: 'Nháp', color: 'bg-yellow-100 text-yellow-800' },
        CANCELLED: { label: 'Hủy bỏ', color: 'bg-red-100 text-red-800' },
      }
      const status = statusMap[row.status] || { label: row.status, color: 'bg-gray-100 text-gray-800' }
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}>
          {status.label}
        </span>
      )
    },
  },
  {
    key: 'accountCount',
    label: 'Số TK',
    sortable: false,
    render: (row: any) => `${row.accountCount} TK`,
  },
  {
    key: 'debitTotal',
    label: 'Nợ',
    sortable: true,
    render: (row: any) => row.debitTotal.toLocaleString('vi-VN'),
  },
  {
    key: 'creditTotal',
    label: 'Có',
    sortable: true,
    render: (row: any) => row.creditTotal.toLocaleString('vi-VN'),
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true,
    render: (row: any) => format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi }),
  },
  {
    key: 'details',
    label: 'Chi tiết',
    sortable: false,
    // ensure button cell can wrap/fit
    className: 'whitespace-normal',
    render: (row: any) => (
      <button
        className="px-2 py-1 text-xs cursor-pointer bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition font-medium"
      >
        Chi tiết
      </button>
    ),
  },
]
