import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useRole from '../../hooks/useRole'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'

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

  const navLinks = (
    <>
      <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>
      {user && (
        <>
          <li><NavLink to="/alldonations" onClick={handleLinkClick}>All Donations</NavLink></li>
          <li><NavLink to={dashboardPath} onClick={handleLinkClick}>Dashboard</NavLink></li>
        </>
      )}
    </>
  )

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span className="text-4xl" role="img" aria-label="logo">🍽️</span>
          <span className="hidden sm:inline">Food Waste</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex menu menu-horizontal gap-3">
          {navLinks}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium hidden sm:block">
                {user.displayName || 'User'}
              </span>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="user"
                  className="w-8 h-8 rounded-full border-2 border-primary"
                />
              )}
              <button onClick={logout} className="btn btn-sm btn-error">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
          )}

          {/* Hamburger */}
          <button
            className="lg:hidden btn btn-ghost text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <ul className="menu menu-vertical px-4 pb-4 pt-0 lg:hidden bg-base-100 shadow-md">
          {navLinks}
        </ul>
      )}
    </nav>
  )
}

export default Navbar
