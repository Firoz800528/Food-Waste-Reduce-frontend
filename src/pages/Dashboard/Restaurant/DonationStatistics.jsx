import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const DonationStatistics = () => {
  const axiosSecure = useAxiosSecure()

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['myDonationsStats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donations/my') // relative path, baseURL set in axios instance
      return res.data
    }
  })

  if (error) {
    return <p className="text-center text-red-500">Error loading donations: {error.message}</p>
  }

  // Aggregate quantity by foodType
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
