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
    <div className="flex min-h-screen bg-gray-100">
      
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none
          flex flex-col
        `}
        aria-label="Admin dashboard navigation"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-700">Admin Dashboard</h2>
          <button
            className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            &#x2715;
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-3 px-2">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors duration-200
                    ${
                      activeSection === id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                    }`}
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
            aria-label="Open navigation menu"
            className="text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            &#9776;
          </button>
          <h1 className="text-lg font-bold text-gray-800 truncate">Admin Dashboard</h1>
          <div />
        </header>

        <main className="flex-1 px-4 py-4 bg-transparent">
          <section aria-labelledby={`${activeSection}-heading`} className="space-y-6">
            <h2
              id={`${activeSection}-heading`}
              className="text-2xl font-semibold text-gray-800 truncate"
            >
              {navItems.find(item => item.id === activeSection)?.label}
            </h2>
            <ActiveComponent />
          </section>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
