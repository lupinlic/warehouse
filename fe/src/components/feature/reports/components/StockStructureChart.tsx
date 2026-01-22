import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  data: {
    name: string
    value: number
  }[]
}

const COLORS = [
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
  '#bfdbfe',
  '#dbeafe',
  '#e0f2fe',
]

export default function StockStructureChart({ data }: Props) {
  const totalStock = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Cơ cấu tồn kho
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={75}
            outerRadius={110}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* Text ở giữa donut */}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-800 text-xl font-bold"
          >
            {totalStock.toLocaleString()}
          </text>

          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500 text-xs"
          >
            Tổng tồn kho
          </text>

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
