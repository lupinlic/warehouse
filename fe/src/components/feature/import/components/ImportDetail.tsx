'use client'

import type { ImportReceipt } from '@/types/importReceipt'

type Props = {
  data: ImportReceipt
}

export default function ImportDetail({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Thông tin phiếu nhập */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-300">
        <div>
          <label className="text-sm font-semibold text-gray-600">Kho</label>
          <p className="text-gray-900 font-medium">
            {data.warehouseCode} - {data.warehouseName}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Nhà cung cấp</label>
          <p className="text-gray-900 font-medium">
            {data.supplierCode} - {data.supplierName}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
          <p className="text-gray-900 font-medium">
            {data.status === 'DRAFT' && <span className="text-blue-600">Nháp</span>}
            {data.status === 'COMPLETED' && <span className="text-green-600">Hoàn tất</span>}
            {data.status === 'CANCELLED' && <span className="text-red-600">Đã hủy</span>}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Tổng tiền</label>
          <p className="text-lg font-bold text-green-600">
            {data.totalAmount?.toLocaleString()} VNĐ
          </p>
        </div>
      </div>

      {/* Chi tiết vật tư */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết vật tư nhập</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Mã vật tư</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên vật tư</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Số lượng</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Giá (VNĐ)</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Thành tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => {
                const itemTotal = item.quantity * item.price
                return (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.materialCode || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {item.materialName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {itemTotal.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-gray-900">
                  Tổng cộng:
                </td>
                <td className="px-4 py-3 text-right text-lg text-green-600">
                  {data.totalAmount?.toLocaleString()} VNĐ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Timestamps */}
      {(data.createdAt || data.updatedAt) && (
        <div className="text-xs text-gray-500 border-t pt-4">
          {data.createdAt && <p>Tạo lúc: {new Date(data.createdAt).toLocaleString('vi-VN')}</p>}
          {data.updatedAt && <p>Cập nhật lúc: {new Date(data.updatedAt).toLocaleString('vi-VN')}</p>}
        </div>
      )}
    </div>
  )
}
