import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";

const MyPickups = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('access-token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const { data: pickups = [], refetch } = useQuery({
    queryKey: ['myPickups'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/charity/my-requests`,
        authHeader
      );
      // Filter out Picked Up items
      return data.filter(pick => pick.status === 'Accepted');
    }
  });

  const confirmPickup = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/charity/pickups/${id}/confirm`,
        {},
        authHeader
      );
      toast.success('✅ Pickup confirmed');
      refetch();
    } catch (error) {
      toast.error('❌ Failed to confirm pickup');
      console.error('Pickup error:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Scheduled Pickups</h2>

      {pickups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg">No scheduled pickups found</p>
          <p className="text-gray-500 mt-2">
            You don't have any upcoming pickups scheduled
          </p>
        </div>
      ) : (
        pickups.map(pick => (
          <div key={pick._id} className="border p-4 mb-4 rounded-lg shadow bg-base-100">
            <h3 className="text-lg font-semibold mb-1">
              {pick.donation?.title || pick.donationTitle || 'Untitled Donation'}
            </h3>
            <p><strong>Restaurant:</strong> {pick.donation?.restaurantName || pick.restaurantName}</p>
            <p><strong>Location:</strong> {pick.donation?.restaurantLocation || pick.restaurantLocation}</p>
            <p><strong>Food Type:</strong> {pick.donation?.foodType || pick.foodType || 'N/A'}</p>
            <p><strong>Quantity:</strong> {pick.donation?.quantity || pick.quantity || 'N/A'}</p>
            <p><strong>Pickup Time:</strong> {new Date(pick.requestDetails?.pickupTime).toLocaleString() || 'N/A'}</p>

            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <span className="badge badge-warning">
                Scheduled
              </span>
            </p>

            <button
              className="btn btn-success btn-sm mt-3"
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