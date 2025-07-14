import { useQuery } from '@tanstack/react-query'
import Banner from '../../components/Banner'
import { Link } from 'react-router-dom'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useEffect, useState } from 'react'

const Home = () => {
  const axiosSecure = useAxiosSecure()
  const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    axiosSecure.get('/api/me')
      .then(res => {
        setIsAdmin(res.data.role === 'admin')
      })
      .catch(() => setIsAdmin(false))
  }, [axiosSecure])

  
  const { data: donations = [] } = useQuery({
    queryKey: ['featuredDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donations')
      return res.data
    }
  })

 
  const { data: charityRequests = [] } = useQuery({
    queryKey: ['charityRequests'],
    enabled: isAdmin,
    queryFn: async () => {
      const res = await axiosSecure.get('/api/charity-requests')
      return res.data
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4">
  
      <Banner />

     
      <h1 className="text-3xl font-bold mt-10 mb-4">Featured Donations</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {donations.slice(0, 4).map(donation => (
          <div key={donation._id} className="card bg-base-100 shadow-lg border">
            <figure>
              <img src={donation.image} alt={donation.title} className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{donation.title}</h2>
              <p><span className="font-semibold">Type:</span> {donation.foodType}</p>
              <p><span className="font-semibold">Restaurant:</span> {donation.restaurantName}</p>
              <p><span className="font-semibold">Location:</span> {donation.restaurantLocation}</p>
              <p><span className="font-semibold">Status:</span> {donation.status}</p>
              <div className="card-actions mt-4 justify-end">
                <Link to={`/donations/${donation._id}`} className="btn btn-primary btn-sm">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

   
      {isAdmin && (
        <>
          <h2 className="text-3xl font-bold mt-16 mb-4">Latest Charity Requests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charityRequests.slice(0, 3).map(request => (
              <div key={request._id} className="card bg-base-100 shadow-md border">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={request.charityImage} alt={request.charityName} className="w-10 h-10 rounded-full" />
                    <h3 className="font-bold">{request.charityName}</h3>
                  </div>
                  <p><span className="font-semibold">Donation:</span> {request.donationTitle}</p>
                  <p className="text-gray-700 mt-2">{request.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

  
      <h2 className="text-3xl font-bold mt-16 mb-4">Impact Stats</h2>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold">12,500 kg</h3>
          <p className="text-gray-700">Total Food Donated</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold">25,000+</h3>
          <p className="text-gray-700">Meals Saved</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold">8,700 kg</h3>
          <p className="text-gray-700">CO₂ Reduced</p>
        </div>
      </div>

  
      <h2 className="text-3xl font-bold mt-16 mb-4">Community Stories</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{ id: 1, title: 'Hope Charity feeds 1,000+ people', content: 'Thanks to local restaurants and the Food Waste Platform, Hope Charity was able to organize a food drive that helped over 1,000 individuals in need.' },
        { id: 2, title: 'Green Leaf Diner reduces waste by 80%', content: 'With regular donations through the platform, Green Leaf Diner minimized their food waste drastically while supporting shelters.' },
        { id: 3, title: 'Local Unity Kitchen joins the mission', content: 'Unity Kitchen recently signed up and has already donated over 300 kg of food to charities across the city.' }].map(story => (
          <div key={story.id} className="card bg-base-100 shadow-md border">
            <div className="card-body">
              <h3 className="text-xl font-bold">{story.title}</h3>
              <p className="mt-2 text-gray-700">{story.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
