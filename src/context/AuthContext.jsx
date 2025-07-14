import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      axiosInstance.get('/me')
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null)
          setToken(null)
          localStorage.removeItem('token')
        })
    } else {
      setUser(null)
      localStorage.removeItem('token')
    }
  }, [token])

  const login = (token) => setToken(token)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
