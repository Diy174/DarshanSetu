import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('map')
  const [mapFile, setMapFile] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [currentMapUrl, setCurrentMapUrl] = useState(null)
  const [templeId, setTempleId] = useState(null)
  const [queries] = useState([
    { id: 1, user: 'Raj Kumar', type: 'Panic', message: 'Lost in temple premises', time: '10 mins ago', status: 'pending' },
    { id: 2, user: 'Priya Singh', type: 'Query', message: 'Wheelchair accessibility?', time: '25 mins ago', status: 'pending' },
    { id: 3, user: 'Amit Patel', type: 'Query', message: 'Prasad timings?', time: '1 hour ago', status: 'resolved' },
  ])

  useEffect(() => {
    const storedTempleId = localStorage.getItem('temple_id')
    
    if (!storedTempleId) {

      setUploadError('Temple ID not found. Please login again.')
      return
    }
    
    setTempleId(storedTempleId)
    
    fetchCurrentMap(storedTempleId)
  }, [])

  const fetchCurrentMap = async (temple_id) => {
    if (!temple_id) {
      return
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/admin/get-map/${temple_id}`,
        { withCredentials: true }
      )
      
      if (res.data?.data?.mapUrl) {
        setCurrentMapUrl(res.data.data.mapUrl)
      } else {
      }
    } catch (err) {

     
      if (err.response?.status !== 404) {
        console.error('Failed to get current map')
      }
    }
  }

  const handleLogoutRequest = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/admin/logout',
        {},
        { withCredentials: true }
      )

      if (res && (res.status === 200 || res.status === 201)) {
        console.log('Logged out success')
      }
    } catch (err) {
      console.error( err)
    }
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('temple_id')
    navigate('/admin-login')
  }

  const handleMapUpload = async (e) => {
    e.preventDefault()
    
    if (!mapFile) {
      setUploadError('Please select a file')
      return
    }

    if (!templeId) {
      setUploadError('Temple ID not found. Please login again.')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadSuccess('')

    const formData = new FormData()
    formData.append('mapFile', mapFile)
    formData.append('temple_id', templeId)

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/admin/upload-map',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      )

      if (res && res.status === 200) {
        setUploadSuccess('Temple map uploaded successfully!')
        setCurrentMapUrl(res.data.data.mapUrl)
        setMapFile(null)
        const fileInput = document.getElementById('mapFileInput')
        if (fileInput) fileInput.value = ''
      }
    } catch (err) {
      console.error( err)
      setUploadError(err.response?.data?.message || 'Failed to upload map')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-smoke">
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black">Confirm Admin Logout</h3>
              <p className="text-center text-gray-600">Are you sure you want to logout from admin panel?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-full border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <header className="border-b-2 border-blue-200 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-blue-600 bg-blue-50 text-lg font-bold text-blue-600">
              DS
            </div>
            <div>
              <p className="font-display text-lg font-bold text-blue-600">
                DarshanSetu Admin
              </p>
              <p className="text-xs uppercase tracking-wide text-blue-600/70">
                Temple Management Dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-4 py-2">
           
              <span className="text-sm font-semibold text-blue-600">Admin {templeId ? `(${templeId})` : ''}</span>
            </div>
            <button
              onClick={handleLogoutRequest}
              className="rounded-full border-2 border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

   
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="mt-2 text-blue-600">Manage temple operations and user queries</p>
        </div>

        <div className="rounded-3xl border-2 border-blue-200 bg-white shadow-lg">
          <div className="flex border-b border-blue-200">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === 'map'
                  ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-600'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Upload Temple Map
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-600'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              User Queries ({queries.filter(q => q.status === 'pending').length})
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'map' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black">Upload Temple Interior Map</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Upload a new interior map that will be visible to all users
                  </p>
                </div>

                {currentMapUrl && (
                  <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-blue-800">Current Temple Map:</p>
                    <img 
                      src={currentMapUrl} 
                      alt="Current Temple Map" 
                      className="max-h-64 w-full rounded-lg object-contain"
                    />
                  </div>
                )}

                <form onSubmit={handleMapUpload} className="space-y-4">
                  <label className="flex flex-col text-sm font-medium text-black">
                    Select Map Image (SVG, PNG, JPG)
                    <input
                      id="mapFileInput"
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg"
                      onChange={(e) => setMapFile(e.target.files[0])}
                      required
                      disabled={uploading}
                      className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-blue-600 focus:border-blue-600 focus:outline-none disabled:opacity-50"
                    />
                  </label>

                  {mapFile && (
                    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                      <p className="text-sm text-green-800">
                        Selected: {mapFile.name}
                      </p>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                      <p className="text-sm font-semibold text-green-800">
                        {uploadSuccess}
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-800">
                       {uploadError}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || !mapFile || !templeId}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Map'}
                  </button>
                </form>

                <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> The uploaded map will replace the current temple interior map and will be visible to all users immediately.
                  </p>
                </div>
              </div>
            ) :
             (
              <div className="space-y-6">
             
              </div>
            )}
          </div>
        </div>
    
      <footer className="border-t-2 border-blue-200 bg-white py-6 text-center text-sm text-blue-600">
        DarshanSetu Admin Panel ·  Heritage & Culture Track
      </footer>
    </div>
  )
}

export default AdminDashboard