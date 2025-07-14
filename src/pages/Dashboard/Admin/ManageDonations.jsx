import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const ManageDonations = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donations')
      return res.data
    },
  })

  const handleVerify = async (id) => {
    try {
      await axiosSecure.patch(`/api/donations/${id}/verify`)
      toast.success('Donation verified successfully!')
      queryClient.invalidateQueries(['donations'])
    } catch (error) {
      toast.error('Failed to verify donation.')
      console.error(error)
    }
  }

  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`/api/donations/${id}/reject`)  // You need to implement this endpoint
      toast.success('Donation rejected successfully!')
      queryClient.invalidateQueries(['donations'])
    } catch (error) {
      toast.error('Failed to reject donation.')
      console.error(error)
    }
  }

  if (isLoading) return <p>Loading donations...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Donations</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">#</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Restaurant</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, i) => (
            <tr key={donation._id} className="text-center border border-gray-300">
              <td className="border border-gray-300 p-2">{i + 1}</td>
              <td className="border border-gray-300 p-2">{donation.title}</td>
              <td className="border border-gray-300 p-2">{donation.foodType}</td>
              <td className="border border-gray-300 p-2">{donation.restaurantName}</td>
              <td className="border border-gray-300 p-2">{donation.restaurantEmail}</td>
              <td className="border border-gray-300 p-2">{donation.quantity}</td>
              <td className="border border-gray-300 p-2 font-semibold">
                {donation.status}
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                {(donation.status !== 'Verified' && donation.status !== 'Rejected') && (
                  <>
                    <button
                      onClick={() => handleVerify(donation._id)}
                      className="btn btn-success btn-sm"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleReject(donation._id)}
                      className="btn btn-error btn-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                {(donation.status === 'Verified' || donation.status === 'Rejected') && (
                  <span className="text-gray-500 italic">No actions available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageDonations
