import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useRole from '../../hooks/useRole'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'

const primaryColor = '#F1AA5F'
const primaryHoverColor = '#d19950' // Slightly darker for hover
const textGray = 'text-gray-700'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [role, isRoleLoading] = useRole()
  const [isOpen, setIsOpen] = useState(false)

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
      isActive
        ? 'text-white'
        : textGray
    }`

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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
              <NavLink
                to="/"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#F1AA5F] text-white'
                      : 'text-gray-700 hover:bg-[#F1AA5F] hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink
                    to="/alldonations"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#F1AA5F] text-white'
                          : 'text-gray-700 hover:bg-[#F1AA5F] hover:text-white'
                      }`
                    }
                  >
                    All Donations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={dashboardPath}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#F1AA5F] text-white'
                          : 'text-gray-700 hover:bg-[#F1AA5F] hover:text-white'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span
                  className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[120px]"
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
                  style={{
                    backgroundColor: '#F1AA5F',
                  }}
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
                style={{
                  backgroundColor: primaryColor,
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = primaryHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = primaryColor)}
              >
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2"
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
        className={`lg:hidden bg-white border-t border-gray-200 shadow-md transition-max-height duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-5 py-4 gap-1">
          <li>
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#F1AA5F] text-white'
                    : 'text-gray-700 hover:bg-[#F1AA5F] hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink
                  to="/alldonations"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#F1AA5F] text-white'
                        : 'text-gray-700 hover:bg-[#F1AA5F] hover:text-white'
                    }`
                  }
                >
                  All Donations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={dashboardPath}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#F1AA5F] text-white'
                        : 'text-gray-700 hover:bg-[#F1AA5F] hover:text-white'
                    }`
                  }
                >
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
