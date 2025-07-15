import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CharityCheckoutForm from './CharityCheckoutForm';
import { useAuth } from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CharityRequest = () => {
  const { user } = useAuth();
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [imageLink, setImageLink] = useState('');
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('/api/user/charity-requests')
      .then(res => {
        if (res.data && (res.data.status === 'Pending' || res.data.status === 'Approved')) {
          setAlreadyRequested(true);
        }
      })
      .catch(err => {
        if (err.response?.status !== 404) {
          console.error('Error checking charity request:', err);
        }
      });
  }, [axiosSecure]);

  const handlePaymentIntent = async (e) => {
    e.preventDefault();
    try {
      if (!organizationName.trim() || !missionStatement.trim()) {
        toast.error('Please fill out organization name and mission statement.');
        return;
      }

      // <-- Updated API endpoint here:
      const res = await axiosSecure.post(
        '/api/create-payment-intent',
        { amount: 25 }
      );

      setClientSecret(res.data.clientSecret);
    } catch (error) {
      console.error('❌ Failed to create payment intent:', error);
      toast.error('Payment initialization failed');
    }
  };

  if (alreadyRequested) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Request Charity Role</h2>
        <p className="text-red-500">You already have a pending or approved request.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Request Charity Role</h2>
      {!clientSecret ? (
        <form onSubmit={handlePaymentIntent} className="space-y-4">
          <input
            type="text"
            placeholder="Organization Name *"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <textarea
            placeholder="Mission Statement *"
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          />
          <input
            type="url"
            placeholder="Image Link (optional)"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            className="input input-bordered w-full"
          />
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={!organizationName || !missionStatement}
          >
            Pay $25 & Submit Request
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
  );
};

export default CharityRequest;
