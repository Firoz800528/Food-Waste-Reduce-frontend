import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

const ReceivedDonations = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('access-token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  
  const { data: received = [], isLoading, error } = useQuery({
    queryKey: ['receivedDonations'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/charity/received-donations`,
        authHeader
      );
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-6">Loading received donations...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error loading received donations.</div>;
  }

  if (!Array.isArray(received) || received.length === 0) {
    return <div className="p-6">No received donations found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Received Donations</h2>
      {received.map((item) => (
        <div key={item._id} className="border rounded p-4 mb-4 shadow-sm">
          <p className="font-semibold text-lg">
            {item.donation?.title || 'Untitled Donation'}
          </p>
          <p><strong>Restaurant:</strong> {item.donation?.restaurantName || 'Unknown'}</p>
          <p><strong>Quantity:</strong> {item.donation?.quantity || 'N/A'}</p>
          <p>
            <strong>Picked Up At:</strong>{" "}
            {item.pickedUpAt ? new Date(item.pickedUpAt).toLocaleString() : 'Date not available'}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="badge badge-success">Received</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReceivedDonations;