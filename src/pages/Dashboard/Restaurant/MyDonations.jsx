import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const MyDonations = () => {
  const axios = useAxiosSecure()
  const [donations, setDonations] = useState([])
  const [userEmail, setUserEmail] = useState('')
  const [editingDonation, setEditingDonation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    axios.get('/api/users/me')
      .then(res => setUserEmail(res.data.email))
      .catch(() => toast.error('Failed to fetch user info'))

    axios.get('/api/donations')
      .then(res => setDonations(res.data))
      .catch(() => toast.error('Failed to fetch donations'))
  }, [])

  const myDonations = donations.filter(d => d.restaurantEmail === userEmail)

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/donations/${id}`)
      setDonations(prev => prev.filter(d => d._id !== id))
      toast.success('Deleted donation')
    } catch {
      toast.error('Failed to delete donation')
    }
  }

  const openUpdateModal = (donation) => {
    setEditingDonation(donation)
    setIsModalOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const form = e.target
    const updatedDonation = {
      title: form.title.value,
      foodType: form.foodType.value,
      quantity: form.quantity.value,
    }

    try {
      await axios.patch(`/api/donations/${editingDonation._id}`, updatedDonation)
      toast.success('Donation updated')
      // Update local state
      setDonations(prev =>
        prev.map(d => d._id === editingDonation._id ? { ...d, ...updatedDonation } : d)
      )
      setIsModalOpen(false)
    } catch {
      toast.error('Failed to update donation')
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
                <button onClick={() => openUpdateModal(d)} className="btn btn-sm btn-warning">
                  Update
                </button>
              )}
              <button onClick={() => handleDelete(d._id)} className="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        </div>
      ))}
      {myDonations.length === 0 && <p>No donations found.</p>}

      {/* Update Modal */}
      {isModalOpen && editingDonation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Update Donation</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                name="title"
                defaultValue={editingDonation.title}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="foodType"
                defaultValue={editingDonation.foodType}
                className="input input-bordered w-full"
                required
              />
              <input
                type="number"
                name="quantity"
                defaultValue={editingDonation.quantity}
                className="input input-bordered w-full"
                required
              />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyDonations
