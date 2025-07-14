import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'


import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

const slides = [
  {
    title: 'Reduce Food Waste',
    description: 'Join us in minimizing food waste for a better future.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Support Your Community',
    description: 'Help charities and those in need by donating surplus food.',
    image: 'https://images.unsplash.com/photo-1516684669134-de6f92a9e3e2?auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Make an Impact',
    description: 'Together, we can build a sustainable and food-secure world.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1350&q=80',
  },
]

const Banner = () => {
  return (
    <div className="w-full max-w-screen-xl mt-3 mx-auto">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="mySwiper rounded-lg overflow-hidden"
      >
        {slides.map(({ title, description, image }, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-64 sm:h-96 flex flex-col justify-center items-center text-center text-white px-4"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="bg-black bg-opacity-50 p-6 rounded-md max-w-xl">
                <h2 className="text-3xl font-bold mb-2">{title}</h2>
                <p className="text-lg">{description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Banner
