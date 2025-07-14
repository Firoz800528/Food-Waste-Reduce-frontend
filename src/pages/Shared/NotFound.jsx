import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-6xl font-bold text-error">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <button
        onClick={() => navigate('/')}
        className="btn btn-primary mt-6"
      >
        Back to Home
      </button>
    </div>
  )
}

export default NotFound
