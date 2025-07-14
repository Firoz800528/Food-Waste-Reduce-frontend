import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Loader from '../../../components/Shared/Loader'

const ManageRoleRequests = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const [loadingActionId, setLoadingActionId] = React.useState(null)

  const { data: requests = [], isLoading } = useQuery(['charity-requests'], async () => {
    const res = await axiosSecure.get('/api/charity-requests')
    return res.data
  })

  const handleApprove = async (requestId, userId) => {
    setLoadingActionId(requestId)
    try {
      await axiosSecure.patch(`/api/charity-requests/${requestId}/approve`, { userId })
      toast.success('Request approved and role assigned!')
      queryClient.invalidateQueries(['charity-requests'])
    } catch (error) {
      console.error(error)
      toast.error('Failed to approve request')
    } finally {
      setLoadingActionId(null)
    }
  }

  const handleReject = async (requestId) => {
    setLoadingActionId(requestId)
    try {
      await axiosSecure.patch(`/api/charity-requests/${requestId}/reject`)
      toast.success('Request rejected')
      queryClient.invalidateQueries(['charity-requests'])
    } catch (error) {
      console.error(error)
      toast.error('Failed to reject request')
    } finally {
      setLoadingActionId(null)
    }
  }

  if (isLoading) return <Loader />

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Role Requests</h2>
      <table className="min-w-full border border-gray-300 border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">User Name</th>
            <th className="border p-2 text-left">User Email</th>
            <th className="border p-2 text-left">Organization Name</th>
            <th className="border p-2 text-left">Mission Statement</th>
            <th className="border p-2 text-left">Transaction ID</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id} className="hover:bg-gray-50">
              <td className="border p-2">{req.userName || 'N/A'}</td>
              <td className="border p-2">{req.email}</td>
              <td className="border p-2">{req.organizationName}</td>
              <td className="border p-2">{req.missionStatement}</td>
              <td className="border p-2">{req.transactionId}</td>
              <td className="border p-2 capitalize font-medium">{req.status}</td>
              <td className="border p-2 space-x-2">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(req._id, req.userId)}
                      disabled={loadingActionId === req._id}
                      className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm ${
                        loadingActionId === req._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      disabled={loadingActionId === req._id}
                      className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ${
                        loadingActionId === req._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 italic">No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageRoleRequests
