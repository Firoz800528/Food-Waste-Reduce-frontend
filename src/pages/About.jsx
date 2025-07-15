import React from 'react';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';

const About = () => {
  return (
    
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our Food Waste Reduction platform is dedicated to minimizing food waste and distributing surplus food to those in need.
            We connect restaurants, charities, and communities with the goal of sustainability and social good.
          </p>
        </div>
        <Footer />
      </div>
  );
};

export default About;
