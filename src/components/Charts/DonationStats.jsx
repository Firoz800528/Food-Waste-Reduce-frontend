
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#8884d8']

const DonationStats = ({ data }) => {
  const chartData = Object.entries(
    data.reduce((acc, curr) => {
      acc[curr.foodType] = (acc[curr.foodType] || 0) + parseInt(curr.quantity)
      return acc
    }, {})
  ).map(([type, value]) => ({ name: type, value }))

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  )
}

export default DonationStats
