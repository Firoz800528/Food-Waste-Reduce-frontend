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

      const registerRes = await fetch('http://localhost:5000/api/register', {
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
      window.location.href = '/'
    } catch {
      toast.error('Registration failed')
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const result = await loginWithGoogle()
      const user = result.user

      const registerRes = await fetch('http://localhost:5000/api/register', {
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

      const loginRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      if (!loginRes.ok) throw new Error('Login failed')

      const { token } = await loginRes.json()
      localStorage.setItem('access-token', token)

      toast.success('Account created with Google!')
      window.location.href = '/'
    } catch {
      toast.error('Google sign up failed')
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2
        className="text-3xl font-bold text-center mb-6"
        style={{ color: '#F1AA5F' }}
      >
        Register
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('name', { required: true })}
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full focus:ring-[#F1AA5F]"
        />
        <input
          {...register('photo')}
          type="text"
          placeholder="Photo URL"
          className="input input-bordered w-full focus:ring-[#F1AA5F]"
        />
        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email"
          className="input input-bordered w-full focus:ring-[#F1AA5F]"
          autoComplete="email"
        />
        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
          className="input input-bordered w-full focus:ring-[#F1AA5F]"
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="btn w-full text-white"
          style={{ backgroundColor: '#F1AA5F' }}
        >
          Register
        </button>
      </form>

      <div className="divider">OR</div>

      <button
        onClick={handleGoogleRegister}
        className="btn btn-outline w-full flex items-center justify-center space-x-2"
        style={{ borderColor: '#F1AA5F', color: '#F1AA5F' }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google"
          className="w-5 h-5"
          aria-hidden="true"
        />
        <span>Sign up with Google</span>
      </button>

      <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold hover:underline"
          style={{ color: '#F1AA5F' }}
        >
          Login here
        </Link>
      </p>
    </div>
  )
}

export default Register
