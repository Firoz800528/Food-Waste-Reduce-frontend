import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from './useAuth'

const useRole = () => {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['role', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const token = localStorage.getItem('access-token')
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return res.data?.role || 'user'
    }
  })

  return [data, isLoading]
}

export default useRole
