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
  const [organizationName, setOrganizationName] = useState('')
  const [missionStatement, setMissionStatement] = useState('')
  const [imageLink, setImageLink] = useState('')
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

  const handlePaymentIntent = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('access-token')
      if (!token) {
        console.error('❌ No access-token found in localStorage')
        return
      }

      // Make sure organizationName and missionStatement are provided before creating payment intent
      if (!organizationName.trim() || !missionStatement.trim()) {
        toast.error('Please fill out organization name and mission statement.')
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

  if (alreadyRequested) {
    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Request Charity Role</h2>
        <p className="text-red-500">You already have a pending or approved request.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Request Charity Role</h2>
      {!clientSecret ? (
        <form onSubmit={handlePaymentIntent} className="space-y-4">
          <input
            type="text"
            placeholder="Organization Name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <textarea
            placeholder="Mission Statement"
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            className="textarea textarea-bordered w-full"
            required
          />
          <input
            type="url"
            placeholder="Image Link (optional)"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">
            Pay $25 & Submit
          </button>
        </form>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CharityCheckoutForm
            clientSecret={clientSecret}
            organizationName={organizationName}
            missionStatement={missionStatement}
            imageLink={imageLink}
          />
        </Elements>
      )}
    </div>
  )
}

export default CharityRequest
