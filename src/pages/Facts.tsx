import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { name: 'Spotify', subscribers: 236 },
  { name: 'Apple Music', subscribers: 88 },
  { name: 'Amazon Music', subscribers: 82 },
  { name: 'YouTube Music', subscribers: 80 },
  { name: 'Tencent Music', subscribers: 106 },
]

const revenueData = [
  { name: 'Spotify', revenue: 13.2 },
  { name: 'Apple Music', revenue: 8.3 },
  { name: 'Amazon Music', revenue: 5.2 },
  { name: 'YouTube Music', revenue: 2.6 },
]

const sortedRevenueData = [...revenueData].sort((a, b) => b.revenue - a.revenue)

const COLORS = ['#1DB954', '#FA233B', '#FF9900', '#FF0000', '#40A0FF']

export default function Fact() {
  return (
    <div className="flex gap-4 flex-col">
      <div className="w-full h-80 bg-b1 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">
          Assinantes das Plataformas de Streaming (milhões)
        </h2>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              dataKey="subscribers"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} milhões`,
                'Assinantes',
              ]}
              contentStyle={{
                background: '#fff',
                border: 'none',
                color: '#18181b',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ color: '#b3b3b3', fontSize: 14 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-80 bg-b1 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">
          Receita Anual das Plataformas (US$ bilhões, 2023)
        </h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={sortedRevenueData}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="revenue">
              {sortedRevenueData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-row-reverse">
        <p>Dados colhidos em 2023</p>
      </div>
    </div>
  )
}
