import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/user/reviews')
      .then(res => {
        setReviews(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/user/reviews/${id}`)
      setReviews(prev => prev.filter(r => r._id !== id))
    } catch (error) {
      alert('Failed to delete review. Please try again.')
    }
  }

  if (loading) return <p className="text-center py-6 text-gray-500">Loading reviews...</p>
  if (!loading && reviews.length === 0)
    return <p className="text-center py-6 text-gray-600">No reviews submitted yet.</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Reviews</h1>
      {reviews.map(review => {
        const reviewDate = review.createdAt ? new Date(review.createdAt) : null
        const formattedDate = reviewDate && !isNaN(reviewDate)
          ? reviewDate.toLocaleDateString()
          : 'Unknown date'

        return (
          <article
            key={review._id}
            className="border p-4 mb-4 rounded shadow bg-white"
            aria-label={`Review for donation titled ${review.donationTitle || 'Untitled Donation'}`}
          >
            <h2 className="font-semibold text-lg mb-2">
              Donation Title: <span className="font-normal">{review.donationTitle || 'Untitled Donation'}</span>
            </h2>

            {review.restaurantName && (
              <p className="mb-1">
                Restaurant Name: <span className="font-normal">{review.restaurantName}</span>
              </p>
            )}

            <p className="mb-1 text-sm text-gray-600">
              Review Time: <time dateTime={review.createdAt}>{formattedDate}</time>
            </p>

            <p className="mb-4">
              Review Description: <span className="font-normal">{review.description || 'No description provided.'}</span>
            </p>

            <button
              className="btn btn-sm btn-error"
              onClick={() => handleDelete(review._id)}
              aria-label={`Delete review for ${review.donationTitle || 'Untitled Donation'}`}
              type="button"
            >
              Delete
            </button>
          </article>
        )
      })}
    </div>
  )
}

export default Reviews
