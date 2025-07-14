import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const AllDonations = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('')

  const { data: donations = [], isLoading, isError } = useQuery({
    queryKey: ['allVerifiedDonations'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations/verified`)
      return res.data
    }
  })

  if (isError) {
    toast.error('Failed to load donations.')
    return <div className="text-center py-10 text-red-500">Something went wrong.</div>
  }

  if (isLoading) {
    return <div className="text-center py-10 font-semibold">Loading donations...</div>
  }

  // Filter by search location
  const filteredDonations = donations.filter(donation =>
    donation.restaurantLocation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort by quantity or pickup time
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (sortOption === 'quantity-asc') return a.quantity - b.quantity
    if (sortOption === 'quantity-desc') return b.quantity - a.quantity
    if (sortOption === 'pickup-soon') return new Date(a.pickupWindow) - new Date(b.pickupWindow)
    if (sortOption === 'pickup-late') return new Date(b.pickupWindow) - new Date(a.pickupWindow)
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">All Verified Donations</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by location (city or zip)"
          className="input input-bordered w-full md:w-1/2"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select
          className="select select-bordered w-full md:w-60"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="pickup-soon">Pickup Time (Soonest)</option>
          <option value="pickup-late">Pickup Time (Latest)</option>
        </select>
      </div>

      {/* Donations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedDonations.map(donation => (
          <div key={donation._id} className="card bg-base-100 shadow-lg border">
            <figure>
              <img
                src={donation.image}
                alt={donation.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{donation.title}</h2>
              <p><span className="font-semibold">Restaurant:</span> {donation.restaurantName}</p>
              <p><span className="font-semibold">Location:</span> {donation.restaurantLocation}</p>
              <p><span className="font-semibold">Quantity:</span> {donation.quantity}</p>
              <p><span className="font-semibold">Charity:</span> {donation.charityName || 'Not Assigned'}</p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`badge ${
                    donation.status === 'Available'
                      ? 'badge-success'
                      : donation.status === 'Requested'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}
                >
                  {donation.status}
                </span>
              </p>
              <div className="card-actions mt-4 justify-end">
                <Link to={`/donations/${donation._id}`} className="btn btn-sm btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedDonations.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No donations found matching your search.</p>
      )}
    </div>
  )
}

export default AllDonations
