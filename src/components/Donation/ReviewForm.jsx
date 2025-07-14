import { useForm } from 'react-hook-form'
import axiosSecure from '../../services/axiosSecure'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'

const ReviewForm = ({ donationId, refetch }) => {
  const { register, handleSubmit, reset } = useForm()
  const { user } = useAuth()

  const onSubmit = async data => {
    const review = {
      ...data,
      reviewer: user?.displayName,
      email: user?.email,
      donationId,
      createdAt: new Date()
    }
    const res = await axiosSecure.post('/api/reviews', review)
    if (res.data.insertedId) {
      toast.success('Review submitted!')
      reset()
      refetch()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <textarea {...register('description')} placeholder="Your review..." className="textarea textarea-bordered w-full" />
      <input {...register('rating')} type="number" placeholder="Rating (1-5)" className="input input-bordered w-full" min="1" max="5" />
      <button className="btn btn-primary">Submit</button>
    </form>
  )
}

export default ReviewForm
