import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase/firebase.config.js'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [backendUser, setBackendUser] = useState(null) 
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser)

      if (currentUser) {
        
        const token = localStorage.getItem('access-token')

        if (token) {
          try {
            
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL || 'https://food-waste-backend.vercel.app'}/api/users/me`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            setBackendUser(res.data)
          } catch (err) {
            
            console.error('Error fetching backend user:', err)
            localStorage.removeItem('access-token')
            setBackendUser(null)
          }
        }
      } else {
        
        setBackendUser(null)
        localStorage.removeItem('access-token')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const registerUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const updateUserProfile = (name, photo) => {
    if (!auth.currentUser) return Promise.reject('No user logged in')
    return updateProfile(auth.currentUser, { displayName: name, photoURL: photo })
  }

  const logout = () => {
    setLoading(true)
    localStorage.removeItem('access-token')
    setBackendUser(null)
    return signOut(auth)
  }

  const googleLogin = () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        backendUser,
        loading,
        login,
        registerUser,
        updateUserProfile,
        logout,
        googleLogin,
        setBackendUser, 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
