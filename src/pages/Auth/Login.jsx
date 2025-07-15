import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = async data => {
    try {
      await login(data.email, data.password)

      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      if (!res.ok) throw new Error('Login failed')

      const { token } = await res.json()
      localStorage.setItem('access-token', token)

      toast.success('Login successful!')
      window.location.href = '/'
    } catch {
      toast.error('Invalid email or password')
    }
  }

  const handleGoogleLogin = async () => {
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

      const loginRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      if (!loginRes.ok) throw new Error('Login failed')

      const { token } = await loginRes.json()
      localStorage.setItem('access-token', token)

      toast.success('Logged in with Google!')
      window.location.href = '/'
    } catch {
      toast.error('Google login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2
        className="text-3xl font-bold text-center mb-6"
        style={{ color: '#F1AA5F' }}
      >
        Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="btn w-full text-white"
          style={{ backgroundColor: '#F1AA5F' }}
        >
          Login
        </button>
      </form>

      <div className="divider">OR</div>

      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline w-full flex items-center justify-center space-x-2 hover:bg-[#f1aa5f33] dark:hover:bg-[#f1aa5f55]"
        aria-label="Login with Google"
        style={{ borderColor: '#F1AA5F', color: '#F1AA5F' }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google"
          className="w-5 h-5"
          aria-hidden="true"
        />
        <span>Login with Google</span>
      </button>

      <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
        Don’t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{ color: '#F1AA5F' }}
        >
          Register here
        </Link>
      </p>
    </div>
  )
}

export default Login
