import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const ManageRequests = ({ donationId }) => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { data: requests = [], isLoading, refetch, error } = useQuery({
    queryKey: ['donationRequests', donationId],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donation-requests', {
        params: { donationId }
      })
      return res.data
    },
    enabled: !!donationId,
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return
    try {
      await axiosSecure.delete(`/api/donation-requests/${id}`)
      toast.success('Request deleted successfully!')
      queryClient.invalidateQueries(['donationRequests', donationId])
      // or refetch() as fallback
    } catch (err) {
      toast.error('Failed to delete request.')
      console.error(err)
    }
  }

  if (!donationId) return <p className="text-red-600">No Donation ID provided</p>
  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">Error loading requests</p>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Donation Requests</h2>
      <table className="table-auto w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Donation Title</th>
            <th className="border px-4 py-2">Charity Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">No requests found.</td>
            </tr>
          ) : (
            requests.map((req, i) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{i + 1}</td>
                <td className="border px-4 py-2">{req.donationTitle || 'N/A'}</td>
                <td className="border px-4 py-2">{req.charityName || 'N/A'}</td>
                <td className="border px-4 py-2">{req.charityEmail}</td>
                <td className="border px-4 py-2">{req.description || req.requestDetails || 'N/A'}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(req._id)}
                    className="btn btn-error btn-sm"
                    aria-label={`Delete request from ${req.charityName}`}
                  >
                    Delete
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

export default ManageRequests
