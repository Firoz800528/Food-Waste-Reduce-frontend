import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-toastify"

const MyPickups = () => {
  const { data: pickups = [], refetch } = useQuery({
    queryKey: ['myPickups'],
    queryFn: async () => {
      const { data } = await axios.get('/api/charity/my-pickups')
      return data
    }
  })

  const confirmPickup = async (id) => {
    try {
      await axios.patch(`/api/charity/pickups/${id}/confirm`)  
      toast.success('Marked as Picked Up')
      refetch()
    } catch (error) {
      toast.error('Failed to confirm pickup')
      console.error('Confirm Pickup error:', error)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Pickups</h2>

      {!Array.isArray(pickups) || pickups.length === 0 ? (
        <p>No pickups found.</p>
      ) : (
        pickups.map(pick => (
          <div key={pick._id} className="border p-4 mb-3 rounded">
            <p><strong>{pick.donationTitle || pick.title || 'Untitled Donation'}</strong> - Quantity: {pick.quantity || 'N/A'}</p>
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
  )
}

export default MyPickups
