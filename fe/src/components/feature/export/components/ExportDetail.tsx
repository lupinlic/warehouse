'use client'

import type { ExportReceipt } from '@/types/exportReceipt'

function Info({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  return (
    <div>
      <div className="text-gray-600 mb-1">{label}</div>
      <div className="font-medium">{value || '-'}</div>
    </div>
  )
}

export default function ExportDetail({
  data,
}: {
  data: ExportReceipt
}) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 text-sm print:p-0">

      {/* Nút in */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          In phiếu
        </button>
      </div>

      {/* Header in */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold uppercase">
          PHIẾU XUẤT KHO
        </h1>
        <p className="text-gray-600">
          Số phiếu: {data.id.substring(0, 8)}
        </p>
      </div>

      {/* Thông tin chung */}
      <div className="grid grid-cols-2 gap-4 border-b pb-4">
        <Info label="Kho xuất" value={data.warehouseName} />
        <Info label="Trạng thái" value={data.status} />
        <Info label="Lý do xuất" value={data.reason} />
      </div>

      {/* Danh sách vật tư */}
      <div>
        <div className="font-semibold mb-2">
          Danh sách vật tư xuất
        </div>

        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">
                Mã vật tư
              </th>
              <th className="border px-3 py-2 text-left">
                Tên vật tư
              </th>
              <th className="border px-3 py-2 text-right">
                Số lượng
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.materialId}>
                <td className="border px-3 py-2">
                  {item.materialCode || '-'}
                </td>
                <td className="border px-3 py-2">
                  {item.materialName || '-'}
                </td>
                <td className="border px-3 py-2 text-right">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chữ ký */}
      <div className="grid grid-cols-3 gap-8 pt-10 text-center text-sm">
        <div>
          <p className="font-semibold">Người lập phiếu</p>
          <p className="mt-16">(Ký, ghi rõ họ tên)</p>
        </div>
        <div>
          <p className="font-semibold">Thủ kho</p>
          <p className="mt-16">(Ký, ghi rõ họ tên)</p>
        </div>
        <div>
          <p className="font-semibold">Kế toán</p>
          <p className="mt-16">(Ký, ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  )
}
