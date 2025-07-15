import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const CharityProfile = () => {
  const axiosSecure = useAxiosSecure()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['charity-profile'],
    queryFn: () => axiosSecure.get('/api/users/me'),
  })

  if (isLoading) return <p className="text-center py-6 text-gray-500">Loading profile...</p>
  if (isError) return <p className="text-center py-6 text-red-500">Error loading profile.</p>

  const charity = data?.data

  return (
    <div className="p-4 sm:p-6 mb-6 sm:mb-8 border rounded shadow bg-white max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Charity Profile</h2>
      <div className="space-y-3 text-sm sm:text-base">
        <p><strong>Name:</strong> {charity?.name || '-'}</p>
        <p><strong>Email:</strong> {charity?.email || '-'}</p>
        <p><strong>Role:</strong> Charity</p>
      </div>
    </div>
  )
}

export default CharityProfile
