import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const DonationStatistics = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['myDonationsStats'],
    queryFn: async () => {
      const token = localStorage.getItem('access-token')
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    }
  })

  const chartData = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.foodType]) {
        acc[item.foodType] = { foodType: item.foodType, total: 0 }
      }
      acc[item.foodType].total += item.quantity
      return acc
    }, {})
  )

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Donation Statistics</h1>

      {isLoading ? (
        <p className="text-center">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="foodType" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default DonationStatistics
