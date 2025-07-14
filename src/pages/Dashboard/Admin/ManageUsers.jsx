import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure()

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users')
      return res.data
    }
  })

  const handleRoleChange = async (id, newRole) => {
    try {
      await axiosSecure.patch(`/api/users/${id}/change-role`, { role: newRole })
      toast.success(`User role changed to ${newRole}`)
      refetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to change role')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await axiosSecure.delete(`/api/users/${id}`)
      toast.success('User deleted successfully')
      refetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete user')
    }
  }

  if (isLoading) return <p className="text-left py-8 text-gray-500">Loading users...</p>

  return (
    <div className="border p-4 w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Name', 'Email', 'Role', 'Actions'].map((header) => (
                <th
                  key={header}
                  className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider
                    ${header === 'Actions' ? 'text-center' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user, i) => {
              const isAdmin = user.role === 'admin'
              const isRestaurant = user.role === 'restaurant'
              const isCharity = user.role === 'charity'

              const buttonBaseClasses =
                'px-3 py-1 rounded-md font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors'

              return (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">{i + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm capitalize text-gray-600">{user.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center space-x-1 sm:space-x-3">
                    <button
                      className={`${buttonBaseClasses} ${
                        isAdmin
                          ? 'bg-green-300 cursor-not-allowed text-green-900'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      onClick={() => !isAdmin && handleRoleChange(user._id, 'admin')}
                      disabled={isAdmin}
                      title="Make Admin"
                      aria-disabled={isAdmin}
                    >
                      Admin
                    </button>

                    <button
                      className={`${buttonBaseClasses} ${
                        isRestaurant
                          ? 'bg-blue-300 cursor-not-allowed text-blue-900'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={() => !isRestaurant && handleRoleChange(user._id, 'restaurant')}
                      disabled={isRestaurant}
                      title="Make Restaurant"
                      aria-disabled={isRestaurant}
                    >
                      Restaurant
                    </button>

                    <button
                      className={`${buttonBaseClasses} ${
                        isCharity
                          ? 'bg-pink-300 cursor-not-allowed text-pink-900'
                          : 'bg-pink-600 hover:bg-pink-700 text-white'
                      }`}
                      onClick={() => !isCharity && handleRoleChange(user._id, 'charity')}
                      disabled={isCharity}
                      title="Make Charity"
                      aria-disabled={isCharity}
                    >
                      Charity
                    </button>

                    <button
                      className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700 text-white`}
                      onClick={() => handleDelete(user._id)}
                      title="Delete User"
                      aria-label={`Delete user ${user.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageUsers
