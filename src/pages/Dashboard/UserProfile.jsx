import React from 'react'
import { useAuth } from '../../hooks/useAuth'

const UserProfile = () => {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <p>No user logged in</p>

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      {user.photoURL && (
        <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      )}
      <p><strong>Name:</strong> {user.name || user.displayName || 'N/A'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role || 'user'}</p>
    </div>
  )
}

export default UserProfile
