import type { StocktakeRecord } from '@/mock/stocktakes.mock'

export default function StocktakeDetail({
  data,
}: {
  data: StocktakeRecord
}) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <Info label="Mã kiểm kê" value={data.code} />
        <Info label="Ngày kiểm kê" value={data.date} />
        <Info label="Kho" value={data.warehouse} />
        <Info label="Người lập" value={data.createdBy} />
      </div>

      {data.note && (
        <div>
          <div className="text-gray-500">Ghi chú</div>
          <div className="font-medium">{data.note}</div>
        </div>
      )}

      <div>
        <div className="font-medium mb-2">
          Kết quả kiểm kê
        </div>

        <table className="w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">
                Vật tư
              </th>
              <th className="border px-3 py-2 text-right">
                Hệ thống
              </th>
              <th className="border px-3 py-2 text-right">
                Thực tế
              </th>
              <th className="border px-3 py-2 text-right">
                Chênh lệch
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const diff =
                item.actualQty - item.systemQty

              return (
                <tr key={item.materialId}>
                  <td className="border px-3 py-2">
                    {item.materialName}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {item.systemQty}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {item.actualQty}
                  </td>
                  <td
                    className={`border px-3 py-2 text-right font-medium ${
                      diff !== 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {diff}
                  </td>
                </tr>
              )
            })}
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
