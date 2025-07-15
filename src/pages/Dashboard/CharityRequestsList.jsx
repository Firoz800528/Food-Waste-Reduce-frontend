import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const CharityRequestsList = () => {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all charity role requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get('/api/admin/charity-requests');
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching charity requests:', err);
        toast.error('Failed to load charity requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosSecure]);

  const handleApprove = async (id, userEmail) => {
    try {
      const res = await axiosSecure.patch(`/api/charity-requests/${id}/approve`, {
        userEmail,
      });
      toast.success('Charity request approved');
      // Update UI
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: 'Approved' } : req
        )
      );
    } catch (err) {
      console.error('Error approving request:', err);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axiosSecure.patch(`/api/charity-requests/${id}/reject`);
      toast.success('Charity request rejected');
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: 'Rejected' } : req
        )
      );
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Charity Role Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Email</th>
                <th>Org Name</th>
                <th>Mission</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.email}</td>
                  <td>{req.organizationName}</td>
                  <td>{req.missionStatement}</td>
                  <td>
                    <span
                      className={`badge ${
                        req.status === 'Approved'
                          ? 'badge-success'
                          : req.status === 'Rejected'
                          ? 'badge-error'
                          : 'badge-warning'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleApprove(req._id, req.email)}
                      disabled={req.status !== 'Pending'}
                      className="btn btn-success btn-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      disabled={req.status !== 'Pending'}
                      className="btn btn-error btn-sm"
                    >
                      Reject
                    </button>
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

export default CharityRequestsList;
