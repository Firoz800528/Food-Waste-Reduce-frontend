import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => axiosSecure.get('/api/users/me'),
  })

  if (isLoading) return <p>Loading profile...</p>

  const admin = data?.data

  return (
    <div className="mb-8 border p-4 rounded shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
      <div>
        <p><strong>Name:</strong> {admin?.name}</p>
        <p><strong>Email:</strong> {admin?.email}</p>
        <p><strong>Role:</strong> {admin?.role}</p>
      </div>
    </div>
  )
}

export default AdminProfile
