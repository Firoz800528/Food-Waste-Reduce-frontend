import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const TransactionHistory = () => {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['charityTransactions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/charity/transactions')
      return data
    }
  })

  if (isLoading) return <div className="p-6">Loading transactions...</div>
  if (error) return <div className="p-6 text-red-600">Failed to load transactions</div>

  const txArray = Array.isArray(transactions) ? transactions : []

  console.log('Transactions:', txArray) // Useful for debugging

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      {txArray.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {txArray.map(tx => (
              <tr key={tx._id}>
                <td>{tx.transactionId}</td>
                <td>${tx.amount}</td>
                <td>{tx.status || 'Paid'}</td> {/* fallback if status missing */}
                <td>{tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A'}</td> {/* fallback if date missing */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TransactionHistory
