import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { id: 'profile', label: 'Profile', to: '' },
  { id: 'add-donation', label: 'Add Donation', to: 'add-donation' },
  { id: 'my-donations', label: 'My Donations', to: 'my-donations' },
  { id: 'requested-donations', label: 'Requested Donations', to: 'requested-donations' },
  { id: 'donation-statistics', label: 'Donation Statistics', to: 'donation-statistics' }, 
]

const highlightColor = '#D19950' // your gold-ish color

const RestaurantDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  const currentPath = location.pathname.split('/').pop() || ''
  const activeItem = navItems.find(item => item.to === currentPath) || navItems[0]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg hover transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none
          flex flex-col
        `}
        style={{ borderRight: `4px solid ${highlightColor}` }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold" style={{ color: highlightColor }}>
            Restaurant Dashboard
          </h2>
          <button
            className="md:hidden text-gray-600 hover:text-opacity-80"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            &#x2715;
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-3 px-2">
            {navItems.map(({ id, label, to }) => (
              <li key={id}>
                <NavLink
                  to={to}
                  end={to === ''}
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
                      isActive
                        ? `bg-[${highlightColor}] text-white shadow-md`
                        : `text-gray-700 hover:bg-[#d1995091]`
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? highlightColor : undefined,
                    color: isActive ? '#fff' : undefined,
                  })}
                  onClick={() => setDrawerOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <footer className="mt-auto px-6 py-4 text-xs text-gray-400 border-t border-gray-200 text-center">
          &copy; {new Date().getFullYear()} Your Company Name
        </footer>
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        <header className="flex items-center justify-between bg-white p-4 shadow md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="text-[color:var(--highlight)]"
            style={{ color: highlightColor }}
          >
            &#9776;
          </button>
          <div /> {/* Empty div to keep layout */}
        </header>

        <main className="flex-1 px-4 py-4 bg-transparent">
          <section aria-labelledby="page-heading" className="space-y-6">
            {/* Removed the page heading as per your request */}
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}

export default RestaurantDashboard
