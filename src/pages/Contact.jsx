import React from 'react';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4 text-primary">Contact Us</h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Have questions or want to get involved? Reach out to us!
        </p>
        <ul className="text-gray-700 dark:text-gray-300 space-y-2">
          <li><strong>Email:</strong> support@foodwasteplatform.org</li>
          <li><strong>Phone:</strong> +880-123-456-789</li>
          <li><strong>Address:</strong> Dhaka, Bangladesh</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
