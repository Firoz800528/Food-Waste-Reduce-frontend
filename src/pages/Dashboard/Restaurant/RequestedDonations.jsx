import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

const RequestedDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { 
    data: requests = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['restaurant-donation-requests'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/restaurant/donation-requests');
      return response.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      await axiosSecure.patch(`/api/donation-requests/${id}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurant-donation-requests']);
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  });

  const handleStatusUpdate = (id, action) => {
    updateStatusMutation.mutate({ id, action });
  };

  if (isLoading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg"></span></div>;
  if (isError) return <div className="alert alert-error my-4">Error loading donation requests</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Charity Donation Requests</h1>
      
      {requests.length === 0 ? (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold">No requests found</h2>
          <p className="mt-2">You don't have any donation requests from charities yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300">
                <th>Donation</th>
                <th>Food Type</th>
                <th>Charity</th>
                <th>Request Details</th>
                <th>Pickup Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-base-200">
                  <td>
                    <div className="font-bold">{request.donation?.title}</div>
                    <div className="text-xs opacity-70">ID: {request.donation?._id?.toString().slice(-6)}</div>
                  </td>
                  <td>{request.donation?.foodType}</td>
                  <td>
                    <div>{request.charity?.name}</div>
                    <div className="text-xs opacity-70">{request.charity?.email}</div>
                  </td>
                  <td>{request.requestDetails?.description}</td>
                  <td>
                    {new Date(request.requestDetails?.pickupTime).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge font-semibold ${
                      request.status === 'Accepted' ? 'badge-success' : 
                      request.status === 'Rejected' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusUpdate(request._id, 'accept')}
                          className="btn btn-sm btn-success"
                          disabled={updateStatusMutation.isLoading}
                        >
                          <FaCheck /> Accept
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(request._id, 'reject')}
                          className="btn btn-sm btn-error"
                          disabled={updateStatusMutation.isLoading}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedDonations;