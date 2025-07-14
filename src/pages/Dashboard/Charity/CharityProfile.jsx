import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const CharityProfile = () => {
  const axiosSecure = useAxiosSecure()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['charity-profile'],
    queryFn: () => axiosSecure.get('/api/users/me'),
  })

  if (isLoading) return <p>Loading profile...</p>
  if (isError) return <p>Error loading profile.</p>

  const charity = data?.data

  return (
    <div className="p-6 mb-8 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Charity Profile</h2>
      <p><strong>Name:</strong> {charity?.name}</p>
      <p><strong>Email:</strong> {charity?.email}</p>
      <p><strong>Role:</strong> Charity</p>
    </div>
  )
}

export default CharityProfile
