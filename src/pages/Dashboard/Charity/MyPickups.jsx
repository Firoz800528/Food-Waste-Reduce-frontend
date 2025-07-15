import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const MyPickups = () => {
  const { data: pickups = [], refetch } = useQuery({
    queryKey: ['myPickups'],
    queryFn: async () => {
      const { data } = await axios.get('/api/charity/my-requests');
      return data.filter(pick => pick.status === 'Accepted');
    }
  });

  const confirmPickup = async (id) => {
    try {
      await axios.patch(`/api/donation-requests/${id}/confirm`);
      toast.success('Pickup confirmed');
      refetch();
    } catch (error) {
      toast.error('Failed to confirm pickup');
      console.error('Pickup error:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Pickups</h2>

      {pickups.length === 0 ? (
        <p>No assigned pickups found.</p>
      ) : (
        pickups.map(pick => (
          <div key={pick._id} className="border p-4 mb-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{pick.donationTitle || 'Untitled Donation'}</h3>
            <p><strong>Restaurant:</strong> {pick.restaurantName}</p>
            <p><strong>Location:</strong> {pick.restaurantLocation}</p>
            <p><strong>Food Type:</strong> {pick.foodType || 'N/A'}</p>
            <p><strong>Quantity:</strong> {pick.quantity || 'N/A'}</p>
            <p><strong>Pickup Time:</strong> {pick.pickupTime || 'N/A'}</p>
            <p><strong>Status:</strong> {pick.status}</p>
            <button
              className="btn btn-success btn-sm mt-2"
              onClick={() => confirmPickup(pick._id)}
            >
              Confirm Pickup
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPickups;
