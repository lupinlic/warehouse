'use client'

import type { ImportReceipt } from '@/types/importReceipt'

type Props = {
  data: ImportReceipt
}

export default function ImportDetail({ data }: Props) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 print:p-0">
      
      {/* Nút in */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          In phiếu
        </button>
      </div>

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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chi tiết vật tư nhập
        </h3>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Mã vật tư</th>
                <th className="px-4 py-3 text-left">Tên vật tư</th>
                <th className="px-4 py-3 text-right">Số lượng</th>
                <th className="px-4 py-3 text-right">Giá (VNĐ)</th>
                <th className="px-4 py-3 text-right">Thành tiền (VNĐ)</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item, idx) => {
                const itemTotal = item.quantity * item.price
                return (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">{item.materialCode || 'N/A'}</td>
                    <td className="px-4 py-3">{item.materialName || 'N/A'}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      {item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {itemTotal.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>

            <tfoot className="font-semibold">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right">
                  Tổng cộng:
                </td>
                <td className="px-4 py-3 text-right">
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
          {data.createdAt && (
            <p>
              Tạo lúc:{' '}
              {new Date(data.createdAt).toLocaleString('vi-VN')}
            </p>
          )}
          {data.updatedAt && (
            <p>
              Cập nhật lúc:{' '}
              {new Date(data.updatedAt).toLocaleString('vi-VN')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
