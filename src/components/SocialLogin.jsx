import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SocialLogin = () => {
  const { googleLogin, setBackendUser } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSignIn = () => {
    googleLogin()
      .then(async res => {
        const user = res.user
        const saveUser = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          role: 'user',
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL || 'https://food-waste-backend.vercel.app'}/api/register`,
          saveUser
        )
        localStorage.setItem('access-token', response.data.token)

        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || 'https://food-waste-backend.vercel.app'}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        )

        setBackendUser(userRes.data)

        toast.success('Logged in with Google')
        navigate('/')
      })
      .catch(err => {
        toast.error('Google Login Failed')
        console.error(err)
      })
  }

  return (
    <div className="text-center mt-6">
      <button
        onClick={handleGoogleSignIn}
        className="btn btn-outline w-full max-w-xs mx-auto"
        aria-label="Continue with Google"
        style={{ borderColor: '#F1AA5F', color: '#F1AA5F' }}
      >
        Continue with Google
      </button>
    </div>
  )
}

export default SocialLogin
