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
    },
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

  if (isLoading)
    return (
      <p className="text-left py-8 text-gray-500 dark:text-gray-400">Loading users...</p>
    )

  return (
    <div className="w-full overflow-x-auto border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {['#', 'Name', 'Email', 'Role', 'Actions'].map((header) => (
              <th
                key={header}
                className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-600 dark:text-gray-300 ${
                  header === 'Actions' ? 'text-center' : ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {users.map((user, i) => {
            const isAdmin = user.role === 'admin'
            const isRestaurant = user.role === 'restaurant'
            const isCharity = user.role === 'charity'

            const baseBtnClasses =
              'px-3 py-1 rounded-md font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors'

            return (
              <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                  {i + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">
                  {user.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm capitalize text-gray-600 dark:text-gray-400">
                  {user.role}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center space-x-1 sm:space-x-3">
                  <button
                    className={`${baseBtnClasses} ${
                      isAdmin
                        ? 'bg-[#F1AA5F]/50 cursor-not-allowed text-white'
                        : 'bg-[#F1AA5F] hover:bg-[#d59430] text-white'
                    }`}
                    onClick={() => !isAdmin && handleRoleChange(user._id, 'admin')}
                    disabled={isAdmin}
                    title="Make Admin"
                    aria-disabled={isAdmin}
                  >
                    Admin
                  </button>

                  <button
                    className={`${baseBtnClasses} ${
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
                    className={`${baseBtnClasses} ${
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
                    className={`${baseBtnClasses} bg-red-600 hover:bg-red-700 text-white`}
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

      {users.length === 0 && (
        <p className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      )}
    </div>
  )
}

export default ManageUsers
