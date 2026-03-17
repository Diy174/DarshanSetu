import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminLogin = () => {
  const navigate = useNavigate()
  const [contactNo, setContactNo] = useState('')
  const [temple_id, setTempleId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAdminLogin = async(e) => {
    e.preventDefault()
    setErrorMsg('')
    
    const loginData = {
      contactNo: contactNo,
      temple_id: temple_id,
      password: password,
    }

    try {
      
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/admin/login`,
        loginData,
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      )

      if (res && (res.status === 200 || res.status === 201)) {
        
       
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('temple_id', temple_id)
        
        navigate('/admin-dashboard')
      } else {
        // console.warn(res?.status, res?.data)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid login credentials'
      setErrorMsg(msg)
      console.error(err)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-3 py-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Admin Access
          </p>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-black md:text-3xl">
          Temple Admin Login
        </h2>
        <p className="mt-2 text-gray-600">
          Access temple management dashboard
        </p>
      </section>

      <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <label className="flex flex-col text-sm font-medium text-black">
            Contact Number *
            <input
              type="tel"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              required
              placeholder="Enter admin contact number"
              pattern="[0-9]{10}"
              maxLength="10"
              className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-blue-600 focus:border-blue-600 focus:outline-none"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-black">
            Temple ID *
            <input
              type="text"
              value={temple_id}
              onChange={(e) => setTempleId(e.target.value)}
              required
              placeholder="Enter temple ID"
              className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-blue-600 focus:border-blue-600 focus:outline-none"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-black">
            Password *
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="mt-2 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 pr-12 transition hover:border-blue-600 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </label>
          
          {errorMsg && (
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
            </div>
          )}
           
          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            Login as Admin
          </button>
        </form>

        <div className="mt-6 rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 text-center">
          <p className="text-sm text-gray-700">
            If forgot password, contact Temple Authority
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/access')}
            className="text-sm font-semibold text-gray-600 hover:underline"
          >
            ← Back to User Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin