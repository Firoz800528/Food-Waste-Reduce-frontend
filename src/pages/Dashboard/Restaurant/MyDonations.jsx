import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const MyDonations = () => {
  const axios = useAxiosSecure()
  const [donations, setDonations] = useState([])
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
   
    axios.get('/api/users/me')
      .then(res => setUserEmail(res.data.email))
      .catch(() => toast.error('Failed to fetch user info'))

    
    axios.get('/api/donations')
      .then(res => setDonations(res.data))
      .catch(() => toast.error('Failed to fetch donations'))
  }, [])

  
  const myDonations = donations.filter(donation => donation.restaurantEmail === userEmail)

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/donations/${id}`)
      setDonations(prev => prev.filter(d => d._id !== id))
      toast.success('Deleted donation')
    } catch {
      toast.error('Failed to delete donation')
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {myDonations.map(d => (
        <div key={d._id} className="card bg-base-100 shadow-md">
          <img src={d.image} alt={d.title} className="h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-bold">{d.title}</h3>
            <p>Type: {d.foodType}</p>
            <p>Quantity: {d.quantity}</p>
            <p>Status: {d.status}</p>
            <div className="mt-4 flex gap-2">
              {!['Rejected'].includes(d.status) && (
                <Link to={`/dashboard/restaurant/add-donation?id=${d._id}`} className="btn btn-sm btn-warning">
                  Update
                </Link>
              )}
              <button onClick={() => handleDelete(d._id)} className="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        </div>
      ))}
      {myDonations.length === 0 && <p>No donations found.</p>}
    </div>
  )
}

export default MyDonations
