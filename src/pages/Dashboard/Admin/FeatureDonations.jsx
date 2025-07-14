import React from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const FeatureDonations = () => {
  const axiosSecure = useAxiosSecure()

  const { data: donations = [], isLoading, refetch } = useQuery({
    queryKey: ['verifiedDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donations/verified')
      return res.data
    }
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Feature Donations</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Food Type</th>
            <th>Restaurant</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr key={donation._id}>
              <td>{index + 1}</td>
              <td>
                <img src={donation.image} alt={donation.title} className="w-16 h-16 object-cover" />
              </td>
              <td>{donation.title}</td>
              <td>{donation.foodType}</td>
              <td>{donation.restaurantName}</td>
              <td>
                
                <button className="btn btn-primary btn-sm">Feature</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FeatureDonations
