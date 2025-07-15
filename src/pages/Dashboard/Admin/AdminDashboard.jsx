import React, { useState } from 'react'
import AdminProfile from './AdminProfile'
import ManageUsers from './ManageUsers'
import ManageDonations from './ManageDonations'
import CharityRequestsList from '../CharityRequestsList'
import ManageRequests from './ManageRequests'
import FeatureDonations from './FeatureDonations'

const navItems = [
  { id: 'profile', label: 'Admin Profile', component: AdminProfile },
  { id: 'users', label: 'Manage Users', component: ManageUsers },
  { id: 'donations', label: 'Manage Donations', component: ManageDonations },
  { id: 'charity-requests', label: 'Charity Role Requests', component: CharityRequestsList },
  { id: 'requests', label: 'Manage Requests', component: ManageRequests },
  { id: 'featured', label: 'Feature Donations', component: FeatureDonations },
]

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')

  const ActiveComponent = navItems.find(item => item.id === activeSection)?.component || AdminProfile

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
        aria-label="Admin dashboard navigation"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-[#F1AA5F] dark:text-yellow-400">Admin Dashboard</h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-[#F1AA5F] focus:outline-none focus:ring-2 focus:ring-[#F1AA5F] rounded"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            &#x2715;
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-3 py-4">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <button
                  className={`
                    w-full text-left px-4 py-3 rounded-md font-semibold transition-colors duration-200
                    ${
                      activeSection === id
                        ? 'bg-[#F1AA5F] text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-[#F1AA5F]/20 hover:text-[#F1AA5F]'
                    }
                  `}
                  onClick={() => {
                    setActiveSection(id)
                    setDrawerOpen(false)
                  }}
                  aria-current={activeSection === id ? 'page' : undefined}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="mt-auto px-6 py-4 text-xs text-gray-400 border-t border-gray-200 dark:border-gray-700 text-center select-none">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        {/* Mobile header */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="text-[#F1AA5F] dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-[#F1AA5F] rounded"
          >
            &#9776;
          </button>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
            Admin Dashboard
          </h1>
          <div />
        </header>

        <main className="flex-1 px-6 py-8 bg-gray-50 dark:bg-gray-900">
          <section aria-labelledby={`${activeSection}-heading`} className="space-y-6 max-w-7xl mx-auto">
            <h2
              id={`${activeSection}-heading`}
              className="text-3xl font-semibold text-gray-900 dark:text-white truncate"
            >
              {navItems.find(item => item.id === activeSection)?.label}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <ActiveComponent />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
