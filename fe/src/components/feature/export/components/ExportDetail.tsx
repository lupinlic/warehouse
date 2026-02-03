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
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <Info label="Mã phiếu" value={data.id.substring(0, 8)} />
        <Info label="Kho xuất" value={data.warehouseName} />
        <Info label="Trạng thái" value={data.status} />
        <Info label="Lý do xuất" value={data.reason} />
      </div>

      <div>
        <div className="font-medium mb-2">
          Danh sách vật tư xuất
        </div>

        <table className="w-full border border-gray-200">
          <thead className="bg-gray-50">
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

      <div className="flex justify-end pt-4 border-t">
        <div className="text-sm text-gray-600">
          {data.reason && <p>Lý do: {data.reason}</p>}
        </div>
      </div>
    </div>
  )
}
