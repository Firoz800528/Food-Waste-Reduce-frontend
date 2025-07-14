import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CharityCheckoutForm from './CharityCheckoutForm'
import { useAuth } from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import axios from 'axios'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CharityRequest = () => {
  const { user } = useAuth()
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    axiosSecure.get('/api/user/charity-request')
      .then(res => {
        if (res.data && (res.data.status === 'Pending' || res.data.status === 'Approved')) {
          setAlreadyRequested(true)
        }
      })
      .catch(err => {
        console.error('Error checking charity request:', err)
      })
  }, [])

  const handlePaymentIntent = async () => {
    try {
      const token = localStorage.getItem('access-token')
      console.log('📦 Sending Token:', token)

      if (!token) {
        console.error('❌ No access-token found in localStorage')
        return
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-payment-intent`,
        { amount: 25 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setClientSecret(res.data.clientSecret)
    } catch (error) {
      console.error('❌ Failed to create payment intent:', error.response || error)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Request Charity Role</h2>
      {alreadyRequested ? (
        <p className="text-red-500">You already have a pending or approved request.</p>
      ) : (
        <>
          {!clientSecret ? (
            <button onClick={handlePaymentIntent} className="btn btn-primary">Pay $25 & Submit</button>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CharityCheckoutForm clientSecret={clientSecret} />
            </Elements>
          )}
        </>
      )}
    </div>
  )
}

export default CharityRequest
