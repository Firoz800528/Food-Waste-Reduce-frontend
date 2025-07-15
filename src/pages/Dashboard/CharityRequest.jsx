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
    if (!organizationName.trim() || !missionStatement.trim()) {
      toast.error('Please fill out organization name and mission statement.');
      return;
    }
    try {
      const res = await axiosSecure.post('/api/create-payment-intent', { amount: 25 });
      setClientSecret(res.data.clientSecret);
    } catch (error) {
      console.error('❌ Failed to create payment intent:', error);
      toast.error('Payment initialization failed');
    }
  };

  if (alreadyRequested) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white text-black rounded-lg shadow-md">
  <h2 className="text-3xl font-bold mb-4 text-black">Request Charity Role</h2>
  <p className="text-red-600 text-lg font-semibold">
    You already have a pending or approved request.
  </p>
</div>

    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[#F1AA5F]">Request Charity Role</h2>
      {!clientSecret ? (
        <form onSubmit={handlePaymentIntent} className="space-y-5">
          <input
            type="text"
            placeholder="Organization Name *"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="input w-full bg-white text-black border border-gray-300 focus:border-[#F1AA5F] focus:ring focus:ring-[#F1AA5F]/50"
            required
            aria-label="Organization Name"
          />
          <textarea
            placeholder="Mission Statement *"
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            className="textarea w-full bg-white text-black border border-gray-300 focus:border-[#F1AA5F] focus:ring focus:ring-[#F1AA5F]/50"
            rows={5}
            required
            aria-label="Mission Statement"
          />
          <input
            type="url"
            placeholder="Image Link (optional)"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            className="input w-full bg-white text-black border border-gray-300 focus:border-[#F1AA5F] focus:ring focus:ring-[#F1AA5F]/50"
            aria-label="Image Link"
          />
          <button
            type="submit"
            className="btn w-full bg-[#F1AA5F] hover:bg-[#d18c22] text-white font-semibold text-lg rounded-md transition"
            disabled={!organizationName || !missionStatement}
            aria-disabled={!organizationName || !missionStatement}
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
