import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useAuth } from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'

const CharityCheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [organizationName, setOrganizationName] = useState('')
  const [missionStatement, setMissionStatement] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    const card = elements.getElement(CardElement)
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret, {
        payment_method: paymentMethod.id,
      }
    )

    if (confirmError) {
      toast.error(confirmError.message)
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
        })

        toast.success('Charity role request submitted!')
      } catch (err) {
        toast.error('Failed to submit charity request')
        console.error(err)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <CardElement />
      <button className="btn btn-success mt-4" type="submit" disabled={!stripe}>Pay & Submit</button>
    </form>
  )
}

export default CharityCheckoutForm
