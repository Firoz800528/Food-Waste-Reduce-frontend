import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useRole from '../../hooks/useRole'
import { useState, useEffect } from 'react'
import { FaBars, FaMoon, FaSun } from 'react-icons/fa'

const primaryColor = '#F1AA5F'
const primaryHoverColor = '#d19950'
const textGray = 'text-gray-700'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [role, isRoleLoading] = useRole()
  const [isOpen, setIsOpen] = useState(false)

  // Dark/Light mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  // Apply dark/light mode class to html
  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const dashboardPath = isRoleLoading
    ? '/dashboard'
    : role === 'restaurant'
    ? '/dashboard/restaurant'
    : role === 'admin'
    ? '/dashboard/admin'
    : role === 'charity'
    ? '/dashboard/charity'
    : '/dashboard/user'

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
      isActive ? 'text-black dark:text-white' : textGray + ' dark:text-gray-300'
    }`

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 select-none"
            aria-label="Food Waste Reduction Home"
            style={{ color: primaryColor }}
            onMouseEnter={e => (e.currentTarget.style.color = primaryHoverColor)}
            onMouseLeave={e => (e.currentTarget.style.color = primaryColor)}
          >
            <span className="text-4xl" role="img" aria-hidden="true">
              🍽️
            </span>
            <span className="hidden sm:inline text-lg font-semibold tracking-wide">
              Food Waste Reduction
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-4">
            <li>
              <NavLink to="/" onClick={handleLinkClick} className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={handleLinkClick} className={navLinkClass}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={handleLinkClick} className={navLinkClass}>
                Contact
              </NavLink>
            </li>

            {user && (
              <>
                <li>
                  <NavLink to="/alldonations" onClick={handleLinkClick} className={navLinkClass}>
                    All Donations
                  </NavLink>
                </li>
                <li>
                  <NavLink to={dashboardPath} onClick={handleLinkClick} className={navLinkClass}>
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Right buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block truncate max-w-[120px]"
                  title={user.displayName || 'User'}
                >
                  {user.displayName || 'User'}
                </span>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User Avatar'}
                    className="w-9 h-9 rounded-full border-2 object-cover"
                    style={{ borderColor: primaryColor }}
                  />
                )}
                <button
                  onClick={logout}
                  aria-label="Logout"
                  className="btn btn-sm border-none text-white transition-colors duration-200"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = primaryHoverColor)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = primaryColor)}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="btn btn-sm border-none text-white transition-colors duration-200"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = primaryHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = primaryColor)}
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
              style={{ color: primaryColor }}
              onMouseEnter={e => (e.currentTarget.style.color = primaryHoverColor)}
              onMouseLeave={e => (e.currentTarget.style.color = primaryColor)}
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-md transition-max-height duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-5 py-4 gap-1">
          <li>
            <NavLink to="/" onClick={handleLinkClick} className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={handleLinkClick} className={navLinkClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={handleLinkClick} className={navLinkClass}>
              Contact
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/alldonations" onClick={handleLinkClick} className={navLinkClass}>
                  All Donations
                </NavLink>
              </li>
              <li>
                <NavLink to={dashboardPath} onClick={handleLinkClick} className={navLinkClass}>
                  Dashboard
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
