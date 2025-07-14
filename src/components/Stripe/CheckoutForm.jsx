import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'

const CheckoutForm = ({ price, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-payment-intent`,
        { amount: price },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )

      const clientSecret = data.clientSecret || data

      const card = elements.getElement(CardElement)
      if (!card) {
        setError('Card element not found')
        setLoading(false)
        return
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user?.email || 'guest@example.com',
          },
        },
      })

      if (paymentResult.error) {
        setError(paymentResult.error.message)
        toast.error(paymentResult.error.message)
        setLoading(false)
        return
      }

      if (paymentResult.paymentIntent.status === 'succeeded') {
        onSuccess(paymentResult.paymentIntent)
        toast.success('Payment successful')
      } else {
        toast.error('Payment failed')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment failed. Try again.')
      toast.error('Payment failed. Try again.')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      {error && <p className="text-red-500">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${price}`}
      </button>
    </form>
  )
}

export default CheckoutForm
