import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  FaUser,
  FaClipboardList,
  FaTruck,
  FaGift,
  FaMoneyCheckAlt,
} from 'react-icons/fa'

const navItems = [
  { id: 'profile', label: 'Charity Profile', to: '' }, 
  { id: 'my-requests', label: 'My Requests', to: 'my-requests' },
  { id: 'my-pickups', label: 'My Pickups', to: 'my-pickups' },
  { id: 'received-donations', label: 'Received Donations', to: 'received-donations' },
  { id: 'transactions', label: 'Transaction History', to: 'transactions' },
]


const CharityDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  
  const currentPath = location.pathname.split('/').pop() || ''

  
  const activeItem = navItems.find(item => item.to === currentPath) || navItems[0]

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto">
     
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0
        `}
        aria-label="Charity dashboard navigation"
      >
        <div className="flex justify-between items-center mb-6 md:block">
          <h2 className="text-xl font-bold text-indigo-700">Charity Dashboard</h2>

          
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation drawer"
            className="text-gray-600 hover:text-indigo-600 focus:outline-none md:hidden"
          >
            &#x2715;
          </button>
        </div>

        <nav>
          <ul className="space-y-4">
            {navItems.map(({ to, label, id }) => {
             
              let icon = null
              switch (id) {
                case 'profile':
                  icon = <FaUser />
                  break
                case 'my-requests':
                  icon = <FaClipboardList />
                  break
                case 'my-pickups':
                  icon = <FaTruck />
                  break
                case 'received-donations':
                  icon = <FaGift />
                  break
                case 'transactions':
                  icon = <FaMoneyCheckAlt />
                  break
                default:
                  icon = null
              }

              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === ''}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 font-semibold px-3 py-2 rounded-md transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100'
                      }`
                    }
                    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                  >
                    {icon}
                    {label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      
      <div className="flex-1 p-6 md:ml-64">
        
        <button
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md md:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation drawer"
        >
          Menu
        </button>

        <h1 className="text-3xl font-bold mb-6">{activeItem.label} 🔒</h1>

        <Outlet /> 
      </div>
    </div>
  )
}

export default CharityDashboard
