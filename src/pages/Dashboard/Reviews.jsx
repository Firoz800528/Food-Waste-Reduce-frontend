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
    await axiosInstance.delete(`/user/reviews/${id}`)
    setReviews(reviews.filter(r => r._id !== id))
  }

  if (loading) return <p>Loading reviews...</p>
  if (reviews.length === 0) return <p>No reviews submitted yet.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      {reviews.map(review => (
        <div key={review._id} className="border p-4 mb-3 rounded shadow">
          <h2 className="font-semibold">{review.donationTitle}</h2>
          <p>Restaurant: {review.restaurantName}</p>
          <p>Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
          <p>{review.description}</p>
          <button className="btn btn-sm btn-error" onClick={() => handleDelete(review._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Reviews
