'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Modal from '@/components/shared/form/Modal'
import type { JournalEntry } from '@/types/journalEntry'

interface JournalEntryDetailProps {
  open: boolean
  entry: JournalEntry | null
  onClose: () => void
}

export default function JournalEntryDetail({ open, entry, onClose }: JournalEntryDetailProps) {
  if (!entry) return null

  const debitTotal = entry.lines.reduce((sum, line) => sum + parseFloat(line.debit || '0'), 0)
  const creditTotal = entry.lines.reduce((sum, line) => sum + parseFloat(line.credit || '0'), 0)

  return (
    <Modal
      open={open}
      title={`Phiếu: ${entry.code}`}
      onClose={onClose}
      size="large"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Mã phiếu</p>
            <p className="font-semibold text-lg">{entry.code}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Trạng thái</p>
            <p className="font-semibold">
              {entry.status === 'POSTED' && <span className="text-green-600">Đã ghi</span>}
              {entry.status === 'DRAFT' && <span className="text-yellow-600">Nháp</span>}
              {entry.status === 'CANCELLED' && <span className="text-red-600">Hủy bỏ</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Ngày</p>
            <p className="font-semibold">
              {format(new Date(entry.date), 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Mô tả</p>
            <p className="text-sm">{entry.description}</p>
          </div>
        </div>

        {/* Lines Table */}
        <div>
          <h3 className="font-semibold mb-3">Chi tiết các bút toán</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left">Tài khoản</th>
                  <th className="px-3 py-2 text-left">Tên tài khoản</th>
                  <th className="px-3 py-2 text-left">Loại</th>
                  <th className="px-3 py-2 text-right">Nợ</th>
                  <th className="px-3 py-2 text-right">Có</th>
                </tr>
              </thead>
              <tbody>
                {entry.lines.map((line) => (
                  <tr key={line.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono font-semibold">{line.account.code}</td>
                    <td className="px-3 py-2">{line.account.name}</td>
                    <td className="px-3 py-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {line.account.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {parseFloat(line.debit || '0') > 0
                        ? parseFloat(line.debit).toLocaleString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {parseFloat(line.credit || '0') > 0
                        ? parseFloat(line.credit).toLocaleString('vi-VN')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-semibold">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right">
                    Cộng:
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {debitTotal.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {creditTotal.toLocaleString('vi-VN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs text-gray-500">
          <div>Tạo: {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
          <div>
            Sửa: {format(new Date(entry.updated_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </div>
        </div>
      </div>
    </Modal>
  )
}
