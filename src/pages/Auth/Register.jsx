import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'

const Register = () => {
  const { registerUser, updateUserProfile, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = async data => {
    try {
      await registerUser(data.email, data.password)
      await updateUserProfile(data.name, data.photo)

      
      const registerRes = await fetch('https://food-waste-backend.vercel.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          photo: data.photo,
          role: 'user',
        }),
      })

      if (!registerRes.ok) throw new Error('Registration failed')

      const { token } = await registerRes.json()
      localStorage.setItem('access-token', token)

      toast.success('Account created successfully!')
      navigate('/')
    } catch {
      toast.error('Registration failed')
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const result = await loginWithGoogle()
      const user = result.user

      
      const registerRes = await fetch('https://food-waste-backend.vercel.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          role: 'user',
        }),
      })

      if (!registerRes.ok && registerRes.status !== 400) {
        throw new Error('Register failed')
      }

      
      const loginRes = await fetch('https://food-waste-backend.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      if (!loginRes.ok) throw new Error('Login failed')

      const { token } = await loginRes.json()
      localStorage.setItem('access-token', token)

      toast.success('Account created with Google!')
      navigate('/')
    } catch {
      toast.error('Google sign up failed')
    }
  }

  return (
    <div className="max-w-md mx-auto my-10">
      <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('name', { required: true })}
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full"
        />
        <input
          {...register('photo')}
          type="text"
          placeholder="Photo URL"
          className="input input-bordered w-full"
        />
        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
        />
        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>

      <div className="divider">OR</div>

      <button
        onClick={handleGoogleRegister}
        className="btn btn-outline w-full flex items-center justify-center"
      >
        <img
          src="https://i.ibb.co/4pDNDk1/google.png"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        Sign up with Google
      </button>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Login here
        </Link>
      </p>
    </div>
  )
}

export default Register
