import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/user/transactions')
      .then(res => {
        setTransactions(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading transactions...</p>
  if (transactions.length === 0) return <p>No transactions found.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Transaction ID</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td className="border border-gray-300 p-2">{tx.transactionId}</td>
              <td className="border border-gray-300 p-2">${tx.amount}</td>
              <td className="border border-gray-300 p-2">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Transactions
