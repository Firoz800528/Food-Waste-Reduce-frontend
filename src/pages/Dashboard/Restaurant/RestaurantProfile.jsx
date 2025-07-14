import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../../hooks/useAuth'

const RestaurantProfile = () => {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.email) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProfile(res.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        setError('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.email, token])

  if (loading) return <p>Loading profile...</p>
  if (error) return <p className="text-red-600">{error}</p>

  
  const displayName = profile?.name || user?.displayName || 'No Name'
  const displayEmail = profile?.email || user?.email || 'No Email'

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Restaurant Profile</h2>

      <div className="mb-4">
        <strong>Name:</strong> {displayName}
      </div>

      <div className="mb-4">
        <strong>Email:</strong> {displayEmail}
      </div>

      <div className="mb-4">
        <p><strong>Role:</strong> Restaurant</p>
      </div>

      {profile?.restaurantImage && (
        <div className="mb-4">
          <strong>Logo/Image:</strong>
          <img
            src={profile.restaurantImage}
            alt="Restaurant Logo"
            className="mt-2 w-48 h-48 object-cover rounded"
          />
        </div>
      )}

      {profile?.address && (
        <div className="mb-4">
          <strong>Address:</strong> {profile.address}
        </div>
      )}

      {profile?.contactNumber && (
        <div className="mb-4">
          <strong>Contact Number:</strong> {profile.contactNumber}
        </div>
      )}

      {profile?.joinedDate && (
        <div className="mb-4">
          <strong>Joined Date:</strong>{' '}
          {new Date(profile.joinedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

export default RestaurantProfile
