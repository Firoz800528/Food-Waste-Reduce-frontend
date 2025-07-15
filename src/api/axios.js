import axios from 'axios'

const API_URL = 'https://food-waste-backend.vercel.app/api' 

const axiosInstance = axios.create({
  baseURL: API_URL,
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('access-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosInstance
