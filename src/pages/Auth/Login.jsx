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
      navigate('/')
    } catch (err) {
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
      navigate('/')
    } catch {
      toast.error('Google login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto my-10">
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>

      <div className="divider">OR</div>

      <button onClick={handleGoogleLogin} className="btn btn-outline w-full flex items-center justify-center">
        <img src="https://i.ibb.co/4pDNDk1/google.png" alt="Google" className="w-5 h-5 mr-2" />
        Login with Google
      </button>

      <p className="text-center mt-4">
        Don’t have an account?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}

export default Login
