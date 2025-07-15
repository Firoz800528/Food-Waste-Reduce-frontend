import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { FaTrash, FaCheckCircle } from 'react-icons/fa'

const MyRequests = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { 
    data: requests = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['charity-requests'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/api/charity/my-requests')
      return data
    },
    onError: (err) => {
      toast.error('Failed to fetch requests: ' + (err.response?.data?.message || err.message))
    }
  })

  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/api/donation-requests/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['charity-requests'])
      toast.success('Request canceled')
    },
    onError: (error) => {
      toast.error('Failed to cancel request: ' + (error.response?.data?.message || error.message))
    }
  })

  if (isLoading) return (
    <div className="text-center py-12">
      <span className="loading loading-spinner loading-lg"></span>
      <p className="mt-4">Loading your requests...</p>
    </div>
  )

  if (isError) return (
    <div className="alert alert-error max-w-2xl mx-auto my-8">
      <div className="flex-1">
        <label>Error loading donation requests. Please try again later.</label>
      </div>
    </div>
  )

  // Filter out requests with "Picked Up" status
  const filteredRequests = requests.filter(request => 
    request.status !== 'Picked Up'
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Donation Requests</h1>
      
      {filteredRequests.length === 0 ? (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold">No active requests found</h2>
          <p className="mt-2">You don't have any active donation requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{request.donationTitle}</h2>
                
                <div className="flex items-center mb-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`badge ml-2 ${
                    request.status === 'Accepted' ? 'badge-success' : 
                    request.status === 'Rejected' ? 'badge-error' : 'badge-warning'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="mb-2">
                  <p className="font-semibold">Restaurant:</p>
                  <p>{request.restaurantName}</p>
                  <p className="text-sm opacity-75">{request.restaurantLocation}</p>
                </div>
                
                {request.requestDetails?.description && (
                  <div className="mb-2">
                    <p className="font-semibold">Request Notes:</p>
                    <p>{request.requestDetails.description}</p>
                  </div>
                )}
                
                {request.requestDetails?.pickupTime && (
                  <div className="mb-2">
                    <p className="font-semibold">Proposed Pickup:</p>
                    <p>{new Date(request.requestDetails.pickupTime).toLocaleString()}</p>
                  </div>
                )}
                
                <div className="card-actions justify-end mt-4">
                  {request.status === 'Pending' && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => cancelMutation.mutate(request._id)}
                      disabled={cancelMutation.isLoading}
                    >
                      <FaTrash className="mr-1" />
                      {cancelMutation.isLoading ? 'Canceling...' : 'Cancel Request'}
                    </button>
                  )}
                  
                  {request.status === 'Accepted' && (
                    <button className="btn btn-success btn-sm" disabled>
                      <FaCheckCircle className="mr-1" />
                      Pickup Scheduled
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRequests