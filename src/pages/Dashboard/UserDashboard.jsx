import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { id: 'profile', label: 'My Profile', to: '' },
  { id: 'charity-request', label: 'Request Charity Role', to: 'charity-request' },
  { id: 'favorites', label: 'Favorites', to: 'favorites' },
  { id: 'reviews', label: 'My Reviews', to: 'reviews' },
  { id: 'transactions', label: 'Transaction History', to: 'transactions' },
]

const UserDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const primaryColor = '#F1AA5F'

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none
          flex flex-col
        `}
        aria-label="User dashboard navigation"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: '#fff7eb' }}>
          <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
            User Dashboard
          </h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-[#d18c22] dark:hover:text-[#d18c22] focus:outline-none focus:ring-2 focus:ring-[#F1AA5F] rounded"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            &#x2715;
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-3 py-4">
            {navItems.map(({ id, label, to }) => (
              <li key={id}>
                <NavLink
                  to={to}
                  end={to === ''}
                  className={({ isActive }) =>
                    `block w-full text-left px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#F1AA5F] text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-[#F1AA5F]/20 hover:text-[#F1AA5F]'
                    }`
                  }
                  onClick={() => setDrawerOpen(false)}
                  aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="mt-auto px-6 py-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 text-center select-none">
          &copy; {new Date().getFullYear()} Your Company Name
        </footer>
      </aside>

      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        {/* Mobile Header */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="text-[#F1AA5F] hover:text-[#d18c22] focus:outline-none focus:ring-2 focus:ring-[#F1AA5F] rounded"
          >
            &#9776;
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate" style={{ color: primaryColor }}>
            User Dashboard
          </h1>
          <div />
        </header>

        {/* Content Area */}
        <main className="flex-1 px-6 py-8 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
