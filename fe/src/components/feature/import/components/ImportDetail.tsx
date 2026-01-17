import type { ImportReceipt } from '@/mock/imports.mock'

export default function ImportDetail({
  data,
}: {
  data: ImportReceipt
}) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <Info label="Mã phiếu" value={data.code} />
        <Info label="Ngày nhập" value={data.date} />
        <Info label="Nhà cung cấp" value={data.supplier} />
        <Info
          label="Tổng tiền"
          value={data.total.toLocaleString() + ' ₫'}
        />
      </div>

      <div>
        <div className="font-medium mb-2">
          Danh sách vật tư
        </div>

        <table className="w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">
                Vật tư
              </th>
              <th className="border px-3 py-2 text-right">
                Số lượng
              </th>
              <th className="border px-3 py-2 text-right">
                Đơn giá
              </th>
              <th className="border px-3 py-2 text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.materialId}>
                <td className="border px-3 py-2">
                  {item.materialName}
                </td>
                <td className="border px-3 py-2 text-right">
                  {item.quantity}
                </td>
                <td className="border px-3 py-2 text-right">
                  {item.price.toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-right">
                  {(item.quantity * item.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
