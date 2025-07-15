import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FaSpinner } from "react-icons/fa"

const TransactionHistory = () => {
  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['charityTransactions'],
    queryFn: async () => {
      const response = await axios.get('/api/charity/transactions')
      return response.data
    }
  })

  if (isLoading) return (
    <div className="p-6 flex flex-col items-center justify-center">
      <FaSpinner className="animate-spin text-2xl mb-2" />
      <p>Loading transaction history...</p>
    </div>
  )
  
  if (error) return (
    <div className="p-6 text-red-600 bg-red-50 rounded-lg">
      <p className="font-semibold">⚠️ Failed to load transactions</p>
      <p className="mt-1 text-sm">{error.message}</p>
    </div>
  )

  // Safely handle the API response data
  let transactions = []
  if (Array.isArray(responseData)) {
    transactions = responseData.filter(tx => 
      tx.purpose === 'charity_upgrade'
    )
  } else if (responseData && Array.isArray(responseData.data)) {
    // Handle case where response has a data property containing the array
    transactions = responseData.data.filter(tx => 
      tx.purpose === 'charity_upgrade'
    )
  } else if (responseData && Array.isArray(responseData.transactions)) {
    // Handle case where response has a transactions property
    transactions = responseData.transactions.filter(tx => 
      tx.purpose === 'charity_upgrade'
    )
  }

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Charity Role Transactions</h2>
          <p className="text-gray-500 mt-1">
            History of your charity role upgrade payments
          </p>
        </div>
        {transactions.length > 0 && (
          <div className="badge badge-neutral">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold">No transactions found</h3>
          <p className="mt-2 text-gray-600">
            You haven't made any charity role upgrade payments yet
          </p>
        </div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Transaction ID</th>
              <th>Amount Paid</th>
              <th>Status</th>
              <th>Request Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              const statusColor = 
                tx.status === 'Approved' ? 'badge-success' : 
                tx.status === 'Rejected' ? 'badge-error' : 'badge-warning'
              
              return (
                <tr key={tx._id || tx.id} className="hover:bg-base-100">
                  <td className="font-mono text-sm">{tx.transactionId || tx.id}</td>
                  <td className="font-semibold">${tx.amount?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusColor} text-xs`}>
                      {tx.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {tx.date ? new Date(tx.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TransactionHistory