import axios from 'axios'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://food-waste-backend.vercel.app'

const useAxiosSecure = () => {
  const navigate = useNavigate()
  const axiosInstanceRef = useRef(null)

  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = axios.create({
      baseURL: BASE_URL,
    })
  }

  useEffect(() => {
    const requestInterceptor = axiosInstanceRef.current.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        } else {
          delete config.headers.Authorization
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseInterceptor = axiosInstanceRef.current.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access-token')
          navigate('/login')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosInstanceRef.current.interceptors.request.eject(requestInterceptor)
      axiosInstanceRef.current.interceptors.response.eject(responseInterceptor)
    }
  }, [navigate])

  return axiosInstanceRef.current
}

export default useAxiosSecure
