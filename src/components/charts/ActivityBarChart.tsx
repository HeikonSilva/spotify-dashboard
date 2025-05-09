import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ActivityChartProps {
  data: Array<{
    hour?: number
    day?: number
    name?: string
    count: number
    percentage: number
  }>
  dataKey: string
  color: string
  xAxisDataKey: string
  xAxisFormatter?: (value: any) => string
}

export function ActivityBarChart({
  data,
  dataKey,
  color,
  xAxisDataKey,
  xAxisFormatter,
}: ActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
        <XAxis
          dataKey={xAxisDataKey}
          tick={{ fill: '#9CA3AF' }}
          tickFormatter={xAxisFormatter}
        />
        <YAxis tick={{ fill: '#9CA3AF' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E1E1E',
            border: '1px solid #333',
            borderRadius: '4px',
          }}
          itemStyle={{ color: '#fff' }}
          formatter={(value: number) => [`${value.toFixed(0)}`, 'Reproduções']}
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
