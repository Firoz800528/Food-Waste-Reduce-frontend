import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const Favorites = () => {
  const axiosSecure = useAxiosSecure()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    axiosSecure.get('/api/user/favorites').then(res => setFavorites(res.data))
  }, [])

  const handleRemove = async (id) => {
    await axiosSecure.delete(`/api/user/favorites/${id}`)
    toast.success('Removed from favorites')
    setFavorites(favorites.filter(fav => fav._id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Favorites</h1>
    <div className="grid md:grid-cols-2 gap-4">
      {favorites.map(fav => (
        <div key={fav._id} className="card bg-base-100 shadow-md">
          <img src={fav.image} alt={fav.title} className="h-40 object-cover" />
          <div className="p-4">
            <h3 className="font-bold">{fav.title}</h3>
            <p>{fav.restaurantName} - {fav.restaurantLocation}</p>
            <p>Status: {fav.status}</p>
            <p>Quantity: {fav.quantity}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleRemove(fav._id)} className="btn btn-sm btn-error">Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Favorites
