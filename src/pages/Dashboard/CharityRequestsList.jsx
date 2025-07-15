import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const CharityRequestsList = () => {
  const axiosSecure = useAxiosSecure()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingActionId, setLoadingActionId] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await axiosSecure.get('/api/charity-requests')
      setRequests(res.data)
    } catch (err) {
      console.error('Failed to fetch requests', err)
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId, userEmail) => {
    setLoadingActionId(requestId)
    try {
      await axiosSecure.patch(`/api/charity-requests/${requestId}/approve`, { userEmail })
      toast.success('Request approved and role assigned!')
      await fetchRequests()
    } catch (err) {
      console.error(err)
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
      await fetchRequests()
    } catch (err) {
      console.error(err)
      toast.error('Failed to reject request')
    } finally {
      setLoadingActionId(null)
    }
  }

  if (loading) return <p className="text-left text-gray-500 py-6">Loading charity role requests...</p>

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Manage Role Requests</h2>
      <div className="overflow-x-auto rounded shadow border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs sm:text-sm text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3 border">#</th>
              {/* Name column removed */}
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Organization</th>
              <th className="px-4 py-3 border">Mission</th>
              <th className="px-4 py-3 border">Transaction ID</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests.map((req, idx) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{idx + 1}</td>
                {/* Name cell removed */}
                <td className="px-4 py-2 border break-all">{req.email}</td>
                <td className="px-4 py-2 border">{req.organization || req.organizationName}</td>
                <td className="px-4 py-2 border">{req.mission || req.missionStatement}</td>
                <td className="px-4 py-2 border break-all">{req.transactionId}</td>
                <td className="px-4 py-2 border capitalize font-medium">{req.status}</td>
                <td className="px-4 py-2 border text-center">
                  {req.status === 'Pending' ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleApprove(req._id, req.email)}
                        disabled={loadingActionId === req._id}
                        className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs sm:text-sm ${
                          loadingActionId === req._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={loadingActionId === req._id}
                        className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm ${
                          loadingActionId === req._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic text-sm">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CharityRequestsList
