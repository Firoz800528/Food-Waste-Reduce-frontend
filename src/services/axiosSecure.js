import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const axiosSecure = axios.create({
  baseURL: BASE_URL,
})

axiosSecure.interceptors.request.use(config => {
  const token = localStorage.getItem('access-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosSecure
