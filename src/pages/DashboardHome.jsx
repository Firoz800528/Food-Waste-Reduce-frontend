import { useEffect, useState } from 'react'
import useAxiosSecure from '../api/useAxiosSecure'

const DashboardHome = () => {
  const [userData, setUserData] = useState(null)
  const token = localStorage.getItem('access-token')
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (!token) return

    axiosSecure
      .get('/api/users/me')
      .then(res => setUserData(res.data))
      .catch(err => console.error('Error fetching user:', err))
  }, [token])

  if (!token) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1
        className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-[#F1AA5F] drop-shadow-md"
        aria-live="polite"
      >
        Welcome, {userData?.name || 'User'}
      </h1>
      <p className="text-center text-gray-700 dark:text-gray-300 text-lg max-w-lg mx-auto">
        This is your dashboard home page. Here you can find a summary of your activities and manage your account details.
      </p>
    </div>
  )
}

export default DashboardHome
