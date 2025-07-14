import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const StripeWrapper = ({ price, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm price={price} onSuccess={onSuccess} />
    </Elements>
  )
}

export default StripeWrapper
