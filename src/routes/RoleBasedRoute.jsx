import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Loader from '../components/Shared/Loader'
import useRole from '../hooks/useRole'
import { useAuth } from '../hooks/useAuth'

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading: authLoading } = useAuth()
  const [role, roleLoading] = useRole()
  const location = useLocation()

  if (authLoading || roleLoading) return <Loader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!allowedRoles.includes(role)) {
    return <p className="text-center mt-10 text-red-600 font-semibold">Access Denied</p>
  }

  return children
}

export default RoleBasedRoute
