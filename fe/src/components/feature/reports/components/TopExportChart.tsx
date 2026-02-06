import { Loader2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { ExportAnalysisReport } from '@/types/report'

interface Props {
  data: ExportAnalysisReport | null
  isLoading?: boolean
}

export default function TopExportChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-center h-96">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!data?.topExports || data.topExports.length === 0) {
    return (
      <div className="bg-white rounded-xl h-full p-5 shadow-sm border border-slate-100 flex items-center justify-center h-96">
        <p className="text-gray-400">Không có dữ liệu</p>
      </div>
    )
  }

  const chartData = data.topExports.map((item) => ({
    name: item.materialName,
    quantity: item.quantity,
    value: item.value,
  }))

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Top vật tư xuất kho nhiều nhất
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tổng xuất: {data.totalExportQty.toLocaleString()} | Giá trị:{' '}
            {data.totalExportValue.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barSize={36}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />

          <Tooltip
            cursor={{ fill: '#eff6ff' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 12,
            }}
            formatter={(value) => {
              if (typeof value === 'number') {
                return value.toLocaleString()
              }
              return value
            }}
          />

          <Bar dataKey="quantity" fill="#93c5fd" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
