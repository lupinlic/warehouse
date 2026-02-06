import { Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: any | null
  isLoading?: boolean
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#f97316', '#f59e0b', '#ef4444', '#10b981', '#a78bfa']

function parseQuantity(raw: any) {
  if (raw == null) return 0
  if (typeof raw === 'number') return raw
  const s = String(raw).trim()
  const cleaned = s.replace(/\./g, '').replace(/,/g, '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

export default function StockStructureChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-center h-96">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    )
  }

  let items: { materialId?: string; name: string; quantity: number }[] = []

  if (!data) items = []
  else if (Array.isArray(data) && data.length > 0 && data[0] && data[0].materialId && data[0].materialName) {
    items = data.map((it: any) => ({
      materialId: it.materialId,
      name: it.materialName,
      quantity: parseQuantity(it.quantity),
    }))
  } else if (Array.isArray(data) && data.length > 0 && data[0].items) {
    items = data[0].items.map((it: any) => ({
      materialId: it.materialId,
      name: it.materialName,
      quantity: Number(it.quantity) || 0,
    }))
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl h-full p-5 shadow-sm border border-slate-100 flex items-center justify-center h-96">
        <p className="text-gray-400">Không có dữ liệu</p>
      </div>
    )
  }

  const totalQuantity = items.reduce((s, it) => s + (it.quantity || 0), 0)
  const chartData = items.map((it) => ({
    name: it.name,
    quantity: it.quantity,
    percent: totalQuantity > 0 ? (it.quantity / totalQuantity) * 100 : 0,
  }))

  const warehouseName = Array.isArray(data) && data[0] && data[0].warehouseName ? data[0].warehouseName : 'Tổng cộng'

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Cơ cấu tồn kho</h3>
          <p className="text-xs text-slate-500 mt-1">
            {warehouseName} - Tổng số lượng: {totalQuantity.toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ left: 40, right: 40 }}>
          <Pie
            data={chartData}
            dataKey="quantity"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            labelLine={false}
            label={(props: any) => {
              const { x, y, payload, percent, textAnchor } = props
              const name = payload?.name ?? ''
              const pct = ((percent ?? 0) * 100).toFixed(2)

              return (
                <text x={x} y={y} textAnchor={textAnchor} fill="#3b82f6" fontSize={12}>
                  <tspan x={x} dy="0">
                    {name}
                  </tspan>
                  <tspan x={x} dy="1.2em">
                    {pct}%
                  </tspan>
                </text>
              )
            }}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            formatter={(value: any, name: string | undefined, props: any) => {
              if (typeof value === 'number') {
                const percent = props.payload?.percent ?? 0
                return [`${value.toLocaleString('vi-VN')}`, `${Math.round(percent * 100) / 100}%`]
              }
              return value
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.slice(0, 8).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
            <div className="text-sm text-slate-600 whitespace-normal">
              {item.name} — {item.percent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
