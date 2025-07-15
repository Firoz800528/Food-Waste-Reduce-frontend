import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-16 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Branding / About */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
            <span role="img" aria-label="Plate and cutlery">🍽️</span> Food Waste Reduction
          </h2>
          <p className="text-sm leading-relaxed">
            Saving food, reducing waste, and helping communities thrive through technology and compassion.
          </p>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Footer navigation" className="space-y-3">
          <h3 className="footer-title text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Links</h3>
          <ul>
            <li>
              <Link to="/about" className="link link-hover text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="link link-hover text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Media */}
        <div>
          <h3 className="footer-title text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Follow Us</h3>
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-primary transition-colors"
            >
              {/* Facebook SVG */}
              <svg className="w-6 h-6 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Facebook</title>
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-primary transition-colors"
            >
              {/* Twitter SVG */}
              <svg className="w-6 h-6 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Twitter</title>
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.566-2.005.974-3.127 1.195a4.916 4.916 0 00-8.373 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.903 4.903 0 01-2.228-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084 4.918 4.918 0 004.588 3.417A9.867 9.867 0 010 19.54a13.945 13.945 0 007.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.213-.004-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-primary transition-colors"
            >
              {/* LinkedIn SVG */}
              <svg className="w-6 h-6 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>LinkedIn</title>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.291c-.966 0-1.75-.788-1.75-1.75 0-.965.784-1.75 1.75-1.75s1.75.785 1.75 1.75c0 .962-.784 1.75-1.75 1.75zm13.5 10.291h-3v-4.5c0-1.074-.925-1.5-1.5-1.5-.75 0-1.5.5-1.5 1.5v4.5h-3v-9h3v1.29c.472-.796 1.157-1.29 2.35-1.29 1.593 0 3.15 1.079 3.15 3.92v5.08z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500 dark:text-gray-400 select-none">
        &copy; {new Date().getFullYear()} Food Waste Platform. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
