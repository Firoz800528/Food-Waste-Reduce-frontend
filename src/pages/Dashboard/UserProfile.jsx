import React from 'react'
import { useAuth } from '../../hooks/useAuth'

const UserProfile = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {user.role !== 'user' && <p><strong>Role:</strong> {user.role}</p>}
    </div>
  )
}

export default UserProfile
