import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

import Home from '../pages/Home/Home'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import NotFound from '../pages/Shared/NotFound'

import AllDonations from '../pages/AllDonations'
import DonationDetails from '../components/DonationDetails'
import PrivateRoute from './PrivateRoute'
import RoleBasedRoute from './RoleBasedRoute'

import UserDashboard from '../pages/Dashboard/UserDashboard'
import UserProfile from '../pages/Dashboard/UserProfile'
import CharityRequest from '../pages/Dashboard/CharityRequest'
import Favorites from '../pages/Dashboard/Favorites'
import Reviews from '../pages/Dashboard/Reviews'
import Transactions from '../pages/Dashboard/Transactions'

import RestaurantDashboard from '../pages/Dashboard/Restaurant/RestaurantDashboard'
import RestaurantProfile from '../pages/Dashboard/Restaurant/RestaurantProfile'
import AddDonation from '../pages/Dashboard/Restaurant/AddDonation'
import MyDonations from '../pages/Dashboard/Restaurant/MyDonations'
import RequestedDonations from '../pages/Dashboard/Restaurant/RequestedDonations'

import CharityDashboard from '../pages/Dashboard/Charity/CharityDashboard'
import CharityProfile from '../pages/Dashboard/Charity/CharityProfile'
import MyRequests from '../pages/Dashboard/Charity/MyRequests'
import MyPickups from '../pages/Dashboard/Charity/MyPickups'
import ReceivedDonations from '../pages/Dashboard/Charity/ReceivedDonations'
import TransactionHistory from '../pages/Dashboard/Charity/TransactionHistory'

import AdminDashboard from '../pages/Dashboard/Admin/AdminDashboard'

import DashboardWrapper from '../pages/Dashboard/DashboardWrapper'
import DonationStatistics from '../pages/Dashboard/Restaurant/DonationStatistics'
import About from '../pages/About'
import Contact from '../pages/Contact'

const routes = createBrowserRouter([
  {
    element: <MainLayout />, 
    children: [
      { path: '/', element: <Home /> },

      {
        path: '/alldonations',
        element: <PrivateRoute><AllDonations /></PrivateRoute>,
      },
      {
        path: '/donations/:id',
        element: <PrivateRoute><DonationDetails /></PrivateRoute>,
      },
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardWrapper /></PrivateRoute>,
      },

      // User Dashboard
      {
        path: '/dashboard/user',
        element: (
          <RoleBasedRoute allowedRoles={['user']}>
            <UserDashboard />
          </RoleBasedRoute>
        ),

        
        children: [
          { index: true, element: <UserProfile /> },
          { path: 'charity-request', element: <CharityRequest /> },
          { path: 'favorites', element: <Favorites /> },
          { path: 'reviews', element: <Reviews /> },
          { path: 'transactions', element: <Transactions /> },
        ],
      },

      

      // Restaurant Dashboard
      {
        path: '/dashboard/restaurant',
        element: (
          <RoleBasedRoute allowedRoles={['restaurant']}>
            <RestaurantDashboard />
          </RoleBasedRoute>
        ),
        children: [
          { index: true, element: <RestaurantProfile /> },
          { path: 'add-donation', element: <AddDonation /> },
          { path: 'my-donations', element: <MyDonations /> },
          { path: 'requested-donations', element: <RequestedDonations /> },
          { path: 'donation-statistics', element: <DonationStatistics /> },
        ],
      },

      // Charity Dashboard — IMPORTANT: Nested routes inside here to keep MainLayout visible
      {
  path: '/dashboard/charity',
  element: (
    <RoleBasedRoute allowedRoles={['charity']}>
      <CharityDashboard />
    </RoleBasedRoute>
  ),
  children: [
    { index: true, element: <CharityProfile /> }, // default route
    { path: 'profile', element: <CharityProfile /> }, // optional, can keep for explicit `/profile`
    { path: 'my-requests', element: <MyRequests /> },
    { path: 'my-pickups', element: <MyPickups /> },
    { path: 'received-donations', element: <ReceivedDonations /> },
    { path: 'transactions', element: <TransactionHistory /> },
  ],
},

      // Admin Dashboard
      {
        path: '/dashboard/admin',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleBasedRoute>
        ),
      },
    ],
  },

  { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },

  // Auth routes without MainLayout (no navbar/footer)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  // 404 Not Found
  {
    path: '*',
    element: <NotFound />,
  },
])

export default routes
