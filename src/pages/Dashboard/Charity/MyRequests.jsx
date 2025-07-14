import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyRequests = () => {
  const {
    data: requests = [],
    refetch,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['myRequests'],
    queryFn: async () => {
      const { data } = await axios.get('/api/charity/my-requests')
      return data
    },
    retry: false,
    onError: (err) => {
      toast.error('Failed to fetch requests: ' + (err.response?.data?.message || err.message))
    },
  })

  const cancelRequest = async (id) => {
    try {
      await axios.delete(`/api/charity/my-requests/${id}`) 
      toast.success('Request canceled')
      refetch()
    } catch (error) {
      toast.error('Failed to cancel request: ' + (error.response?.data?.message || error.message))
    }
  }

  if (isLoading) return <p>Loading your requests...</p>
  if (isError) return <p>Error loading requests.</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Requests</h2>
      {Array.isArray(requests) && requests.length > 0 ? (
        requests.map((req) => (
          <div key={req._id} className="border p-4 rounded mb-4">
            <p><strong>{req.donationTitle}</strong></p>
            <p>Status: {req.status}</p>
            {req.status === 'Pending' && (
              <button
                className="btn btn-sm btn-error"
                onClick={() => cancelRequest(req._id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  )
}

export default MyRequests
