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
    return <div className="text-center py-10 font-semibold text-[#F1AA5F]">Loading donations...</div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-[#F1AA5F] drop-shadow-md">
        All Verified Donations
      </h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by location (city or zip)"
          className="input input-bordered w-full sm:max-w-md rounded-md border-[#F1AA5F] focus:border-[#F1AA5F] focus:ring-2 focus:ring-[#F1AA5F] transition"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search donations by location"
        />

        <select
          className="select select-bordered w-full sm:w-48 rounded-md border-[#F1AA5F] focus:border-[#F1AA5F] focus:ring-2 focus:ring-[#F1AA5F] transition"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          aria-label="Sort donations"
        >
          <option value="">Sort by</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="pickup-soon">Pickup Time (Soonest)</option>
          <option value="pickup-late">Pickup Time (Latest)</option>
        </select>
      </div>

      {/* Donations Grid */}
      {sortedDonations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedDonations.map(donation => (
            <div
              key={donation._id}
              className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-[#F1AA5F] hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              <figure className="h-48 overflow-hidden rounded-t-lg">
                <img
                  src={donation.image}
                  alt={donation.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </figure>
              <div className="card-body flex flex-col flex-grow p-5">
                <h2 className="card-title text-xl font-semibold text-[#F1AA5F] mb-2 truncate">
                  {donation.title}
                </h2>
                <div className="text-gray-700 dark:text-gray-300 flex-grow text-sm space-y-1">
                  <p>
                    <span className="font-semibold text-[#F1AA5F]">Restaurant:</span> {donation.restaurantName}
                  </p>
                  <p>
                    <span className="font-semibold text-[#F1AA5F]">Location:</span> {donation.restaurantLocation}
                  </p>
                  <p>
                    <span className="font-semibold text-[#F1AA5F]">Quantity:</span> {donation.quantity}
                  </p>
                  <p>
                    <span className="font-semibold text-[#F1AA5F]">Charity:</span> {donation.charityName || 'Not Assigned'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#F1AA5F]">Status:</span>{' '}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
                        donation.status === 'Available'
                          ? 'bg-green-600'
                          : donation.status === 'Requested'
                          ? 'bg-yellow-500'
                          : 'bg-blue-600'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </p>
                </div>
                <div className="card-actions mt-6 flex justify-end">
                  <Link
                    to={`/donations/${donation._id}`}
                    className="btn btn-sm bg-[#F1AA5F] text-white hover:bg-[#d79942] transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No donations found matching your search.
        </p>
      )}
    </div>
  )
}

export default AllDonations
