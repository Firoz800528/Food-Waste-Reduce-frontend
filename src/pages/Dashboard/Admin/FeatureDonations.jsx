import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const FeatureDonations = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['verifiedDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donations/verified')
      return res.data
    }
  })

  const handleFeature = async (donationId) => {
    try {
      await axiosSecure.patch(`/api/donations/${donationId}/feature`)
      toast.success('Donation marked as featured!')
      queryClient.invalidateQueries(['verifiedDonations'])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to feature donation')
    }
  }

  if (isLoading) return <p>Loading...</p>

  // Show only non-featured donations in admin feature page
  const nonFeaturedDonations = donations.filter(donation => !donation.featured)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Feature Donations</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">#</th>
            <th className="border border-gray-300 px-2 py-1">Image</th>
            <th className="border border-gray-300 px-2 py-1">Title</th>
            <th className="border border-gray-300 px-2 py-1">Food Type</th>
            <th className="border border-gray-300 px-2 py-1">Restaurant</th>
            <th className="border border-gray-300 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {nonFeaturedDonations.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">No donations to feature.</td>
            </tr>
          ) : (
            nonFeaturedDonations.map((donation, index) => (
              <tr key={donation._id}>
                <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <img src={donation.image} alt={donation.title} className="w-16 h-16 object-cover" />
                </td>
                <td className="border border-gray-300 px-2 py-1">{donation.title}</td>
                <td className="border border-gray-300 px-2 py-1">{donation.foodType}</td>
                <td className="border border-gray-300 px-2 py-1">{donation.restaurantName}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleFeature(donation._id)}
                  >
                    Feature
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default FeatureDonations
