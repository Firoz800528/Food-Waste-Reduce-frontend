import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useEffect, useState, useRef } from 'react'

const Banner = () => {
  const slides = [
    {
      id: 1,
      title: 'Save Food, Save Lives',
      subtitle: 'Join our community to reduce food waste and support those in need.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      title: 'Connect Restaurants & Charities',
      subtitle: 'Help local businesses donate surplus food effectively.',
      image: 'https://plus.unsplash.com/premium_photo-1676642611795-9f1de2b99f83?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      title: 'Make an Impact Today',
      subtitle: 'Together we can reduce waste and fight hunger.',
      image: 'https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=1024x1024&w=is&k=20&c=QPHFTWoscwMSXOEGKoAKOjlCnMGszppFBrqQHdy4EGc=',
    },
  ]

  const [current, setCurrent] = useState(0)
  const slideInterval = useRef(null)

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(slideInterval.current)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrent(index)
    clearInterval(slideInterval.current)
  }

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover brightness-70"
          />
          <div
            className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white"
           
          >
            <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{slide.title}</h2>
            <p className="mt-2 md:mt-4 max-w-xl text-sm md:text-lg drop-shadow-md">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? 'bg-[#F1AA5F]' : 'bg-white/60 hover:bg-white'
            }`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

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
    queryKey: ['verifiedDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/donations/verified')
      return res.data
    }
  })

  const { data: charityRequests = [] } = useQuery({
  queryKey: ['charityRequests'],
  enabled: isAdmin,
  queryFn: async () => {
    const res = await axiosSecure.get('/api/admin/charity-requests')
    return res.data
  }
})


  const featuredDonations = donations.filter(donation => donation.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Banner />

      {/* Featured Donations Section */}
      <h1 className="text-3xl font-bold mt-12 mb-6" style={{ color: '#F1AA5F' }}>
        Featured Donations
      </h1>
      {featuredDonations.length === 0 ? (
        <p className="text-gray-500">No featured donations available right now.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...featuredDonations].reverse().slice(0, 4).map(donation => (
            <div
              key={donation._id}
              className="card bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border"
              style={{ borderColor: '#F1AA5F' }}
            >
              <figure className="h-48 overflow-hidden">
                <img
                  src={donation.image}
                  alt={donation.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </figure>
              <div className="card-body p-4">
                <h2
                  className="card-title text-lg font-semibold text-gray-900 dark:text-white"
                  style={{ color: '#F1AA5F' }}
                >
                  {donation.title}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-semibold" style={{ color: '#F1AA5F' }}>Type:</span> {donation.foodType}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold" style={{ color: '#F1AA5F' }}>Restaurant:</span> {donation.restaurantName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold" style={{ color: '#F1AA5F' }}>Location:</span> {donation.restaurantLocation}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold" style={{ color: '#F1AA5F' }}>Status:</span> {donation.status}
                </p>
                <div className="card-actions mt-4 flex justify-end">
                  <Link
                    to={`/donations/${donation._id}`}
                    className="btn btn-sm px-4 py-1 transition"
                    style={{
                      backgroundColor: '#F1AA5F',
                      color: '#fff',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charity Requests */}
      {isAdmin && charityRequests.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mt-16 mb-6" style={{ color: '#F1AA5F' }}>
            Latest Charity Requests
          </h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...charityRequests].reverse().slice(0, 3).map(request => (
              <div
                key={request._id}
                className="card bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border"
                style={{ borderColor: '#F1AA5F' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0fpsEQvVYrq_RGYZ-N36HvvcYSWMlNLzOAt5n7rbyzkRJUqFVILjJ3TlS880k0L6O-wI&usqp=CAU"
                    alt="Charity"
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: '2px solid #F1AA5F' }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ color: '#F1AA5F' }}>
                      {request.organizationName}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  <strong style={{ color: '#F1AA5F' }}>Mission Statement:</strong> {request.missionStatement}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong style={{ color: '#F1AA5F' }}>Status:</strong> {request.status}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Impact Stats */}
      <h2 className="text-3xl font-bold mt-16 mb-6" style={{ color: '#F1AA5F' }}>
        Impact Stats
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 text-center">
        <div
          className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{ borderTop: '4px solid #F1AA5F' }}
        >
          <h3 className="text-3xl font-extrabold text-green-700 dark:text-green-300">12,500 kg</h3>
          <p className="text-green-900 dark:text-green-200 mt-1 font-semibold">Total Food Donated</p>
        </div>
        <div
          className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{ borderTop: '4px solid #F1AA5F' }}
        >
          <h3 className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-300">25,000+</h3>
          <p className="text-yellow-900 dark:text-yellow-200 mt-1 font-semibold">Meals Saved</p>
        </div>
        <div
          className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{ borderTop: '4px solid #F1AA5F' }}
        >
          <h3 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">8,700 kg</h3>
          <p className="text-blue-900 dark:text-blue-200 mt-1 font-semibold">CO₂ Reduced</p>
        </div>
      </div>

      {/* Community Stories */}
      <h2 className="text-3xl font-bold mt-16 mb-6" style={{ color: '#F1AA5F' }}>
        Community Stories
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            id: 1,
            title: 'Hope Charity feeds 1,000+ people',
            content:
              'Thanks to local restaurants and the Food Waste Platform, Hope Charity was able to organize a food drive that helped over 1,000 individuals in need.',
          },
          {
            id: 2,
            title: 'Green Leaf Diner reduces waste by 80%',
            content:
              'With regular donations through the platform, Green Leaf Diner minimized their food waste drastically while supporting shelters.',
          },
          {
            id: 3,
            title: 'Local Unity Kitchen joins the mission',
            content:
              'Unity Kitchen recently signed up and has already donated over 300 kg of food to charities across the city.',
          },
        ].map((story) => (
          <div
            key={story.id}
            className="card bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border"
            style={{ borderColor: '#F1AA5F' }}
          >
            <div className="card-body p-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ color: '#F1AA5F' }}>
                {story.title}
              </h3>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{story.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
