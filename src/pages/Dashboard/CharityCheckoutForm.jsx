import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const CharityCheckoutForm = ({ clientSecret, organizationName, missionStatement, imageLink }) => {
  const stripe = useStripe()
  const elements = useElements()
  const axiosSecure = useAxiosSecure()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    const card = elements.getElement(CardElement)
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    })

    if (confirmError) {
      toast.error(confirmError.message)
      setLoading(false)
      return
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await axiosSecure.post('/api/transactions', {
          transactionId: paymentIntent.id,
          amount: 25,
          purpose: 'Charity Role Request',
        })

        await axiosSecure.post('/api/user/charity-request', {
          organizationName,
          missionStatement,
          transactionId: paymentIntent.id,
          amount: 25,
          imageLink,
        })

        toast.success('Charity role request submitted successfully!')
        elements.getElement(CardElement).clear()
      } catch (err) {
        toast.error('Failed to submit charity request')
        console.error(err)
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      <button
        className="btn btn-success mt-4"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Pay & Submit'}
      </button>
    </form>
  )
}

export default CharityCheckoutForm
