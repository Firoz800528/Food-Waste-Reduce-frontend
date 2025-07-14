import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ReceivedDonations = () => {
  
  const { data: received = [], isLoading, error } = useQuery({
    queryKey: ['receivedDonations'],
    queryFn: async () => {
      const { data } = await axios.get('/api/charity/received-donations'); 
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
          <p className="font-semibold text-lg">{item.donationTitle || 'Untitled Donation'}</p>
          <p>
            Picked Up At:{' '}
            {item.pickedUpAt
              ? new Date(item.pickedUpAt).toLocaleString()
              : 'Date not available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReceivedDonations;
