import React from 'react'
import { useForm } from 'react-hook-form'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-toastify'
import { useAuth } from '../../../hooks/useAuth'

const AddDonation = () => {
  const { user } = useAuth()
  const axios = useAxiosSecure()
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async data => {
    try {
      
      const payload = {
        ...data,
        restaurantName: user.name,
        restaurantEmail: user.email,
      }
      await axios.post('/api/donations', payload)
      toast.success('Donation added, pending approval')
      reset()
    } catch (error) {
      toast.error('Failed to add donation')
      console.error('AddDonation error:', error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">Add Donation</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('title', { required: true })} placeholder="Donation Title" className="input input-bordered w-full" />
        <input {...register('foodType', { required: true })} placeholder="Food Type" className="input input-bordered w-full" />
        <input {...register('quantity', { required: true })} placeholder="Quantity (e.g., 5 kg)" className="input input-bordered w-full" />
        <input type="text" {...register('restaurantLocation')} placeholder="Location" className="input input-bordered w-full" defaultValue={user.location || ''} />
        <button type="submit" className="btn btn-primary w-full">Add Donation</button>
      </form>
    </div>
  )
}

export default AddDonation
