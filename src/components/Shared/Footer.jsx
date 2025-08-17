import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useRole from '../../hooks/useRole'

const Footer = () => {
  const { user } = useAuth()
  const [role, isRoleLoading] = useRole()
  const brandColor = '#F1AA5F'
  const primaryHoverColor = '#d19950'

  const dashboardPath = isRoleLoading
    ? '/dashboard'
    : role === 'restaurant'
    ? '/dashboard/restaurant'
    : role === 'admin'
    ? '/dashboard/admin'
    : role === 'charity'
    ? '/dashboard/charity'
    : '/dashboard/user'

  const navLinkClass = ({ isActive }) =>
    `text-sm transition-colors duration-200 ${
      isActive ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'
    } hover:text-[#F1AA5F] hover:underline`

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-20 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        
        {/* Branding */}
        <div className="space-y-4">
          <h2
            className="text-2xl font-extrabold flex items-center gap-2"
            style={{ color: brandColor }}
          >
            <span role="img" aria-label="Plate and cutlery">🍽️</span> Food Waste Reduction
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Saving food, reducing waste, and helping communities thrive through technology and compassion.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: brandColor }}
          >
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/alldonations" className={navLinkClass}>All Donations</NavLink>
                </li>
                <li>
                  <NavLink to={dashboardPath} className={navLinkClass}>Dashboard</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: brandColor }}
          >
            Follow Us
          </h3>
          <div className="flex items-center gap-5">
            {/* Facebook */}
            <a
              href="https://web.facebook.com/phi.ro.ja.694863"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#F1AA5F] transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <title>Facebook</title>
                <path d="M22.675 0h-21.35A1.326 1.326 0 000 1.326v21.348A1.326 1.326 0 001.326 24H12.82v-9.294H9.69v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.312h3.587l-.467 3.622h-3.12V24h6.116A1.326 1.326 0 0024 22.674V1.326A1.326 1.326 0 0022.675 0z" />
              </svg>
            </a>
            {/* X */}
            <a
              href="https://x.com/FZaman800528"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#F1AA5F] transition-colors"
              aria-label="X"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <title>X</title>
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775A4.916 4.916 0 0024 2.557a9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.373 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.574A4.903 4.903 0 01.343 8.6v.061a4.918 4.918 0 003.946 4.827A4.996 4.996 0 012.8 13.18a4.918 4.918 0 004.6 3.417A9.868 9.868 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/md-firozzaman/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#F1AA5F] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <title>LinkedIn</title>
                <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.761-2.238-5-5-5zM8 19H5v-9h3v9zM6.5 8.709a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM19 19h-3v-4.5c0-1.074-.925-1.5-1.5-1.5s-1.5.5-1.5 1.5V19h-3v-9h3v1.29c.472-.796 1.157-1.29 2.35-1.29 1.593 0 3.15 1.079 3.15 3.92V19z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Food Waste Platform. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
