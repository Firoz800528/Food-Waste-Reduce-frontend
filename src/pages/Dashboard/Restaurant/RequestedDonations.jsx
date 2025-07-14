import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const RequestedDonations = () => {
  const axios = useAxiosSecure()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    axios.get('/api/restaurant/donation-requests').then(res => setRequests(res.data))
  }, [])

  const handleDecision = async (id, action) => {
    await axios.patch(`/api/restaurant/donation-requests/${id}/${action}`)
    toast.success(`Request ${action}`)
    setRequests(requests.map(r =>
      r._id === id ? { ...r, status: action === 'accept' ? 'Accepted' : 'Rejected' } : r
    ))
  }

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Donation</th>
          <th>Food Type</th>
          <th>Charity Name</th>
          <th>Email</th>
          <th>Description</th>
          <th>Pickup Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(r => (
          <tr key={r._id}>
            <td>{r.donationTitle}</td>
            <td>{r.donationFoodType}</td>
            <td>{r.charityName}</td>
            <td>{r.charityEmail}</td>
            <td>{r.requestDescription}</td>
            <td>{r.pickupTime}</td>
            <td>{r.status}</td>
            <td>
              {r.status === 'Pending' && (
                <>
                  <button onClick={() => handleDecision(r._id, 'accept')} className="btn btn-xs btn-success">Accept</button>
                  <button onClick={() => handleDecision(r._id, 'reject')} className="btn btn-xs btn-error ml-1">Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RequestedDonations
