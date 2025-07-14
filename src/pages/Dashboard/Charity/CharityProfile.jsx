import { useAuth } from "../../../hooks/useAuth"


const CharityProfile = () => {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Charity Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> Charity</p>
      
    </div>
  )
}

export default CharityProfile
