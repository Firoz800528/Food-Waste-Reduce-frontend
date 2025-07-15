import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useRole from '../../hooks/useRole'
import Loader from '../../components/Shared/Loader'

const DashboardWrapper = () => {
  const { user, loading: authLoading } = useAuth()
  const [role, roleLoading] = useRole()

  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  switch (role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />
    case 'restaurant':
      return <Navigate to="/dashboard/restaurant" replace />
    case 'charity':
      return <Navigate to="/dashboard/charity" replace />
    default:
      return <Navigate to="/dashboard/user" replace />
  }
}

export default DashboardWrapper
