import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import useRole from '../hooks/useRole'

const DonationDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [role, isRoleLoading] = useRole()

  const [donation, setDonation] = useState(null)
  const [requests, setRequests] = useState([])
  const [reviews, setReviews] = useState([])

  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  const [requestDescription, setRequestDescription] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [reviewDescription, setReviewDescription] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  const token = localStorage.getItem('access-token')
  const authHeader = { headers: { Authorization: `Bearer ${token}` } }

  // Fetch donation details
  useEffect(() => {
    if (!id) return
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations/${id}`)
      .then(res => setDonation(res.data))
      .catch(() => toast.error('Failed to load donation'))
  }, [id])

  // Fetch requests for this donation
  useEffect(() => {
    if (!id || !token) return
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-requests?donationId=${id}`, authHeader)
      .then(res => setRequests(res.data))
      .catch(() => toast.error('Failed to load requests'))
  }, [id, token])

  // Fetch reviews
  useEffect(() => {
    if (!id || !token) return
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-reviews/${id}`, authHeader)
      .then(res => setReviews(res.data))
      .catch(() => toast.error('Failed to load reviews'))
  }, [id, token])

  if (!donation) return <p className="text-center py-10">Loading donation details...</p>
  if (isRoleLoading) return <p className="text-center py-10">Loading role...</p>

  const userRequest = requests.find(r => r.charityEmail === user.email)

  // Save to Favorites
  const handleSaveFavorite = async () => {
    try {
      const favsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/favorites`, authHeader)
      const existing = favsRes.data.find(fav => fav.donationId === id)
      if (existing) return toast.info('Already in favorites')

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/favorites`, {
        donationId: id,
        image: donation.image,
        title: donation.title,
        restaurantName: donation.restaurantName,
        restaurantLocation: donation.restaurantLocation,
        status: donation.status,
        quantity: donation.quantity
      }, authHeader)
      toast.success('Saved to favorites')
    } catch {
      toast.error('Failed to save favorite')
    }
  }

  // Submit Donation Request (Charity)
  const handleSubmitRequest = async () => {
    if (!requestDescription || !pickupTime) return toast.error('All fields required')
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/donation-requests`, {
        donationId: id,
        donationTitle: donation.title,
        restaurantName: donation.restaurantName,
        charityName: user.displayName,
        charityEmail: user.email,
        requestDescription,
        pickupTime,
        status: 'Pending',
      }, authHeader)

      toast.success('Request submitted')
      setShowRequestModal(false)
      setRequestDescription('')
      setPickupTime('')

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-requests?donationId=${id}`, authHeader)
      setRequests(res.data)
    } catch {
      toast.error('Failed to submit request')
    }
  }

  // Confirm Pickup (Charity)
  const handleConfirmPickup = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/charity/pickups/${userRequest._id}/confirm`, {}, authHeader)
      toast.success('Pickup confirmed')
      const [requestsRes, donationRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-requests?donationId=${id}`, authHeader),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations/${id}`)
      ])
      setRequests(requestsRes.data)
      setDonation(donationRes.data)
    } catch {
      toast.error('Failed to confirm pickup')
    }
  }

  // Submit Review
  const handleSubmitReview = async () => {
    if (!reviewDescription || !reviewRating) return toast.error('Please complete the review')
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/donation-reviews`, {
        donationId: id,
        reviewerName: user.displayName || 'Anonymous',
        description: reviewDescription,
        rating: reviewRating,
        date: new Date()
      }, authHeader)
      toast.success('Review submitted')
      setShowReviewModal(false)
      setReviewDescription('')
      setReviewRating(5)

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-reviews/${id}`, authHeader)
      setReviews(res.data)
    } catch {
      toast.error('Failed to submit review')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Donation Details */}
      <h1 className="text-4xl font-bold mb-4">{donation.title}</h1>
      <img src={donation.image} alt={donation.title} className="w-full h-64 object-cover rounded mb-6" />

      <p><strong>Description:</strong> {donation.description || 'N/A'}</p>
      <p><strong>Food Type:</strong> {donation.foodType}</p>
      <p><strong>Quantity:</strong> {donation.quantity}</p>
      <p><strong>Pickup Instructions:</strong> {donation.pickupInstructions || 'N/A'}</p>
      <p><strong>Restaurant:</strong> {donation.restaurantName}</p>
      <p><strong>Location:</strong> {donation.restaurantLocation}</p>
      <p><strong>Pickup Time Window:</strong> {donation.pickupWindow || 'N/A'}</p>
      <p><strong>Status:</strong> {donation.status}</p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button onClick={handleSaveFavorite} className="btn btn-primary" disabled={!user}>
          Save to Favorites
        </button>

        {role === 'charity' && !userRequest && donation.status === 'Available' && (
          <button onClick={() => setShowRequestModal(true)} className="btn btn-secondary">
            Request Donation
          </button>
        )}

        {role === 'charity' && userRequest?.status === 'Accepted' && (
          <button onClick={handleConfirmPickup} className="btn btn-success">
            Confirm Pickup
          </button>
        )}

        <button onClick={() => setShowReviewModal(true)} className="btn btn-outline" disabled={!user}>
          Add Review
        </button>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Request Donation</h2>
            <p><strong>Donation:</strong> {donation.title}</p>
            <p><strong>Restaurant:</strong> {donation.restaurantName}</p>
            <p><strong>Charity:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <textarea
              placeholder="Request Description"
              className="textarea textarea-bordered w-full mt-3"
              value={requestDescription}
              onChange={e => setRequestDescription(e.target.value)}
            />
            <input
              type="datetime-local"
              className="input input-bordered w-full mt-3"
              value={pickupTime}
              onChange={e => setPickupTime(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowRequestModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSubmitRequest} className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Add Review</h2>
            <textarea
              placeholder="Your Review"
              className="textarea textarea-bordered w-full mb-4"
              value={reviewDescription}
              onChange={e => setReviewDescription(e.target.value)}
            />
            <select
              value={reviewRating}
              onChange={e => setReviewRating(Number(e.target.value))}
              className="select select-bordered w-full mb-4"
            >
              {[5, 4, 3, 2, 1].map(star => (
                <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReviewModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSubmitReview} className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        <ul className="space-y-4">
          {reviews.map(r => (
            <li key={r._id} className="border p-4 rounded shadow">
              <p><strong>{r.reviewerName}</strong> ({new Date(r.date).toLocaleDateString()})</p>
              <p>Rating: {'⭐'.repeat(r.rating)}</p>
              <p>{r.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DonationDetails
