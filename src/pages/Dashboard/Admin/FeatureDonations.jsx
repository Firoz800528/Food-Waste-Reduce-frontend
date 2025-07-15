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
    },
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

  if (isLoading)
    return (
      <p className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</p>
    )

  const nonFeaturedDonations = donations.filter(donation => !donation.featured)

  return (
    <div className="max-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Feature Donations</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['#', 'Image', 'Title', 'Food Type', 'Restaurant', 'Action'].map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {nonFeaturedDonations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No donations to feature.
                </td>
              </tr>
            ) : (
              nonFeaturedDonations.map((donation, index) => (
                <tr
                  key={donation._id}
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-center whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center whitespace-nowrap">
                    <img
                      src={donation.image}
                      alt={donation.title}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm truncate max-w-xs">
                    {donation.title}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm capitalize whitespace-nowrap">
                    {donation.foodType}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm truncate max-w-xs">
                    {donation.restaurantName}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleFeature(donation._id)}
                      className="px-3 py-1 bg-[#F1AA5F] hover:bg-[#d59430] text-white rounded-md text-sm font-semibold transition"
                      aria-label={`Feature donation ${donation.title}`}
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
    </div>
  )
}

export default FeatureDonations
