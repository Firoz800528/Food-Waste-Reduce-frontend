import { useEffect, useState } from 'react'
import useAxiosSecure from '../api/useAxiosSecure'

const DashboardHome = () => {
  const [userData, setUserData] = useState(null)

  const token = localStorage.getItem('access-token')
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (!token) return 

    axiosSecure.get('/api/users/me')
      .then(res => setUserData(res.data))
      .catch(err => console.error('Error fetching user:', err))
  }, [token])

  if (!token) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {userData?.name}</h1>
    </div>
  )
}

export default DashboardHome
