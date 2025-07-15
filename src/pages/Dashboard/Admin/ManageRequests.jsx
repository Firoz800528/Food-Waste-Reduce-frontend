import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa'

const ManageRequests = ({ donationId }) => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { 
    data: requests = [], 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['donationRequests', donationId],
    queryFn: async () => {
      if (!donationId) return []
      
      const res = await axiosSecure.get('/api/donation-requests', {
        params: { donationId }
      })
      return res.data
    },
    enabled: !!donationId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    onError: (error) => {
      toast.error('Failed to load requests: ' + (error.response?.data?.message || error.message))
    }
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return
    try {
      await axiosSecure.delete(`/api/donation-requests/${id}`)
      toast.success('Request deleted successfully!')
      queryClient.invalidateQueries(['donationRequests', donationId])
    } catch (err) {
      toast.error('Failed to delete request: ' + (err.response?.data?.message || err.message))
      console.error(err)
    }
  }

  // Handle missing donationId
  if (!donationId) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md max-w-2xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Donation Missing</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>No donation selected. Please go back and select a donation to view its requests.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading donation requests...</p>
      </div>
    )
  }
  
  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading requests</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message || 'Failed to load donation requests. Please try again later.'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Extract description from requestDetails if available
  const getDescription = (req) => {
    if (req.description) return req.description
    if (req.requestDetails?.description) return req.requestDetails.description
    return 'No description provided'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Donation Requests</h2>
        {requests.length > 0 && (
          <div className="badge badge-info">
            {requests.length} request{requests.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700">No requests found</h3>
          <p className="mt-2 text-gray-500">
            There are no charity requests for this donation yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donation Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charity Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req, i) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.donationTitle || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.charityName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a 
                      href={`mailto:${req.charityEmail}`} 
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      {req.charityEmail}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="line-clamp-2">
                      {getDescription(req)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label={`Delete request from ${req.charityName}`}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageRequests