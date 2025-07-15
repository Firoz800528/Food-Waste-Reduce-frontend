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
  const [userRequest, setUserRequest] = useState(null)
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
      .catch(() => toast.error('❌ Failed to load donation'))
  }, [id])

  // Fetch user's request for this donation
  useEffect(() => {
    if (!id || !user || role !== 'charity' || !token) return
    
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-requests/me?donationId=${id}`, authHeader)
      .then(res => setUserRequest(res.data))
      .catch(() => setUserRequest(null))
  }, [id, user, role, token])

  // Fetch reviews
  useEffect(() => {
    if (!id || !token) return
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-reviews/${id}`, authHeader)
      .then(res => setReviews(res.data))
      .catch(() => toast.error('❌ Failed to load reviews'))
  }, [id, token])

  if (!donation) return <p className="text-center py-10">Loading donation details...</p>
  if (isRoleLoading) return <p className="text-center py-10">Loading role...</p>

  const handleSaveFavorite = async () => {
    try {
      const favsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/favorites`, authHeader)
      const existing = favsRes.data.find(fav => fav.donationId === id)
      if (existing) return toast.info('⚠️ Already in favorites')

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/favorites`, {
        donationId: id,
        image: donation.image,
        title: donation.title,
        restaurantName: donation.restaurantName,
        restaurantLocation: donation.restaurantLocation,
        status: donation.status,
        quantity: donation.quantity
      }, authHeader)
      toast.success('✅ Saved to favorites')
    } catch {
      toast.error('❌ Failed to save favorite')
    }
  }

  const handleSubmitRequest = async () => {
    if (!requestDescription || !pickupTime) return toast.error('❗ All fields required')
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/donation-requests`,
        {
          donationId: id,
          requestDetails: {
            description: requestDescription,
            pickupTime: pickupTime
          }
        },
        authHeader
      )
      
      toast.success('✅ Request submitted')
      setShowRequestModal(false)
      setRequestDescription('')
      setPickupTime('')
      setUserRequest(response.data)
    } catch {
      toast.error('❌ Failed to submit request')
    }
  }

  const handleConfirmPickup = async () => {
    try {
      if (!userRequest) return
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/donation-requests/${userRequest._id}/confirm`,
        {},
        authHeader
      )
      
      toast.success('✅ Pickup confirmed')
      
      // Update local state
      setUserRequest({ ...userRequest, status: 'Completed' })
      setDonation({ ...donation, status: 'Completed' })
    } catch {
      toast.error('❌ Failed to confirm pickup')
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewDescription || !reviewRating) return toast.error('❗ Please complete the review')
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/donation-reviews`,
        {
          donationId: id,
          reviewerName: user.displayName || 'Anonymous',
          reviewerEmail: user.email,
          description: reviewDescription,
          rating: reviewRating,
          date: new Date()
        },
        authHeader
      )
      
      toast.success('✅ Review submitted')
      setShowReviewModal(false)
      setReviewDescription('')
      setReviewRating(5)
      
      // Refresh reviews
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donation-reviews/${id}`, authHeader)
      setReviews(res.data)
    } catch {
      toast.error('❌ Failed to submit review')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{donation.title}</h1>
      <img src={donation.image} alt={donation.title} className="w-full h-64 object-cover rounded mb-6" />

      <p><strong>Description:</strong> {donation.description || 'N/A'}</p>
      <p><strong>Food Type:</strong> {donation.foodType}</p>
      <p><strong>Quantity:</strong> {donation.quantity}</p>
      <p><strong>Pickup Instructions:</strong> {donation.pickupInstructions || 'N/A'}</p>
      <p><strong>Restaurant:</strong> {donation.restaurantName}</p>
      <p><strong>Location:</strong> {donation.restaurantLocation}</p>
      <p><strong>Pickup Time Window:</strong> {donation.pickupWindow || 'N/A'}</p>
      <p>
        <strong>Status:</strong> 
        <span className={`badge ml-2 ${
          donation.status === 'Available' ? 'badge-success' : 
          donation.status === 'Reserved' ? 'badge-warning' : 'badge-error'
        }`}>
          {donation.status}
        </span>
      </p>

      {/* Request status badge */}
      {userRequest && (
        <div className="mt-4 p-3 bg-base-200 rounded-lg">
          <p className="font-bold">Your Request Status:</p>
          <span className={`badge ${
            userRequest.status === 'Accepted' ? 'badge-success' : 
            userRequest.status === 'Rejected' ? 'badge-error' : 'badge-warning'
          }`}>
            {userRequest.status}
          </span>
          {userRequest.status === 'Accepted' && (
            <p className="mt-2">
              <strong>Pickup Time:</strong> {new Date(userRequest.requestDetails.pickupTime).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <button 
          onClick={handleSaveFavorite} 
          className="btn bg-[#D19950] hover:bg-amber-600" 
          disabled={!user}
        >
          Save to Favorites
        </button>

        {role === 'charity' && !userRequest && (
          <button 
            onClick={() => setShowRequestModal(true)} 
            className="btn btn-secondary"
          >
            Request Donation
          </button>
        )}

        {role === 'charity' && userRequest?.status === 'Accepted' && (
          <button 
            onClick={handleConfirmPickup} 
            className="btn btn-success"
          >
            Confirm Pickup
          </button>
        )}

        <button 
          onClick={() => setShowReviewModal(true)} 
          className="btn btn-outline" 
          disabled={!user}
        >
          Add Review
        </button>
      </div>

      {/* Request Donation Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request Donation</h2>
            
            <div className="mb-4">
              <label className="block font-medium mb-1">Request Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={requestDescription}
                onChange={e => setRequestDescription(e.target.value)}
                placeholder="Explain why your charity needs this donation"
                rows={4}
              />
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-1">Proposed Pickup Time</label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={pickupTime}
                onChange={e => setPickupTime(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowRequestModal(false)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitRequest} 
                className="btn btn-primary"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Review</h2>
            
            <div className="mb-4">
              <label className="block font-medium mb-1">Your Review</label>
              <textarea
                placeholder="Share your experience with this donation"
                className="textarea textarea-bordered w-full"
                value={reviewDescription}
                onChange={e => setReviewDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-1">Rating</label>
              <select
                value={reviewRating}
                onChange={e => setReviewRating(Number(e.target.value))}
                className="select select-bordered w-full"
              >
                {[5, 4, 3, 2, 1].map(star => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowReviewModal(false)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview} 
                className="btn btn-primary"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-start">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        <span>{review.reviewerName.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="card-title">{review.reviewerName}</h3>
                      <div className="flex items-center mb-2">
                        <div className="rating rating-sm">
                          {[...Array(5)].map((_, i) => (
                            <input 
                              key={i}
                              type="radio" 
                              className="mask mask-star-2 bg-orange-400" 
                              checked={review.rating === i + 1}
                              readOnly
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationDetails