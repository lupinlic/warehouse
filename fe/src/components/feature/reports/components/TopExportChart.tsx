import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface Props {
  data: any[]
}

export default function TopExportChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Top vật tư xuất kho nhiều nhất
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barSize={36}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="materialName"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: '#eff6ff' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 12,
            }}
          />

          <Bar
            dataKey="exportQty"
            fill="#93c5fd"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
