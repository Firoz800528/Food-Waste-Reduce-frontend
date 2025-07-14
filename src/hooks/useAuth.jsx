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

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
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
    return signOut(auth)
  }

  const loginWithGoogle = () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const authInfo = {
    user,
    loading,
    login,
    registerUser,
    updateUserProfile,
    logout,
    loginWithGoogle,
  }

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
