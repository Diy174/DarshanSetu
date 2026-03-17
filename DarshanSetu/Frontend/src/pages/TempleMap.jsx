import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TempleMap = () => {
  const navigate = useNavigate()
  const { booking } = useBooking()
  const [uploadedMapUrl, setUploadedMapUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const templeIdMapping = {
    'kv': '231198',
    'tirupati': 'TIRUPATI001',
    'madurai': 'MADURAI001',
    'puri': 'PURI001',
  }

  useEffect(() => {
    if (!booking.temple) {
      navigate('/')
      return
    }


    fetchTempleMap()
  }, [booking.temple, navigate])

  const fetchTempleMap = async () => {
    if (!booking.temple || !booking.temple.id) {
      setLoading(false)
      return
    }


    const backendTempleId = templeIdMapping[booking.temple.id] || booking.temple.id

    try {
      setLoading(true)
      setError('')
  
      
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/admin/get-map/${backendTempleId}`,
        { withCredentials: true }
      )

      if (res.data?.data?.mapUrl) {
        setUploadedMapUrl(res.data.data.mapUrl)
 
      } else {
        setUploadedMapUrl(null)
      }
    } catch (err) {
      console.error( err)
      
      if (err.response?.status !== 404) {
        setError('Failed to load temple map')
      }
      setUploadedMapUrl(null)
    } finally {
      setLoading(false)
    }
  }

  if (!booking.temple) return null

  const getTempleMap = () => {
    switch (booking.temple.id) {
      case 'kv':
        return <KashiVishwanathMap />
      case 'tirupati':
        return <TirupatiMap />
      case 'madurai':
        return <MaduraiMap />
      case 'puri':
        return <PuriMap />
      default:
        return <DefaultTempleMap />
    }
  }

  return (
    <div className="space-y-8">

      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-orange bg-brand-orange/5 px-3 py-1">
    
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            Temple Interior Map
          </p>
        </div>

        <h2 className="mt-3 font-display text-2xl font-bold text-black md:text-3xl">
          {booking.temple.name}
        </h2>
        <p className="mt-2 text-gray-600">Navigate through the temple premises</p>
      </section>


      <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-black">Need Directions?</h3>
            <p className="mt-1 text-sm text-gray-600">
              Get turn-by-turn navigation to the temple
            </p>
          </div>

          <button
            onClick={() => {
              const destination = encodeURIComponent(
                `${booking.temple.name}, ${booking.temple.city}`
              )
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
                '_blank'
              )
            }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-orange-dark"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Get Directions
          </button>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        {loading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-brand-orange"></div>
              <p className="mt-4 text-sm text-gray-600">Loading temple map...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
              <p className="font-semibold text-red-800">{error}</p>
              <button
                onClick={fetchTempleMap}
                className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : uploadedMapUrl ? (
      
          <div className="flex flex-col items-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-600 bg-green-50 px-3 py-1">
     
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Official Temple Map
              </p>
            </div>
            <img
              src={uploadedMapUrl}
              alt={`${booking.temple.name} Interior Map`}
              className="max-h-[600px] w-full rounded-lg object-contain"
              onError={(e) => {
                console.error('Failed to load map image')
                setError('Failed to load map image')
                setUploadedMapUrl(null)
              }}
            />
          </div>
        ) : (
    
          <div>
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-3 py-1">
    
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Default Layout Map
                </p>
              </div>
            </div>
            {getTempleMap()}
          </div>
        )}
      </div>

  
      <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 font-bold text-black">Legend</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Legend color="bg-brand-orange" label="Main Sanctum" />
          <Legend color="bg-blue-500" label="Entry/Exit Points" />
          <Legend color="bg-green-500" label="Queue Zones" />
          <Legend color="bg-gray-400" label="Emergency Exits" />
        </div>
      </div>
    </div>
  )
}

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`h-6 w-6 rounded ${color}`}></div>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
)

const DefaultTempleMap = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <svg className="h-full w-full max-w-4xl" viewBox="0 0 800 600">
      <rect x="250" y="150" width="300" height="300" stroke="#d84315" strokeWidth="3" fill="#fff" />
      <rect x="325" y="225" width="150" height="150" fill="#d84315" opacity="0.2" />
      <text x="400" y="310" textAnchor="middle" fill="#d84315">SANCTUM</text>
      <rect x="375" y="450" width="50" height="30" fill="#3b82f6" />
      <text x="400" y="470" textAnchor="middle" fill="#fff">ENTRY</text>
      <rect x="375" y="120" width="50" height="30" fill="#3b82f6" />
      <text x="400" y="140" textAnchor="middle" fill="#fff">EXIT</text>
    </svg>
  </div>
)



const KashiVishwanathMap = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <svg className="h-full w-full max-w-4xl" viewBox="0 0 800 600">
      <rect x="200" y="100" width="400" height="400" stroke="#d84315" strokeWidth="3" fill="#fff" />
      <circle cx="400" cy="300" r="80" fill="#d84315" opacity="0.2" />
      <text x="400" y="310" textAnchor="middle" fill="#d84315">JYOTIRLINGA</text>
      <rect x="375" y="500" width="50" height="30" fill="#3b82f6" />
      <text x="400" y="520" textAnchor="middle" fill="#fff">ENTRY</text>
    </svg>
  </div>
)

const TirupatiMap = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <svg className="h-full w-full max-w-4xl" viewBox="0 0 800 600">
      <rect x="150" y="100" width="500" height="400" stroke="#d84315" strokeWidth="3" fill="#fff" />
      <rect x="325" y="200" width="150" height="200" fill="#d84315" opacity="0.2" />
      <text x="400" y="310" textAnchor="middle" fill="#d84315">VENKATESWARA</text>
      <rect x="100" y="250" width="50" height="100" fill="#22c55e" opacity="0.3" />
      <text x="125" y="310" textAnchor="middle" fill="#16a34a">ZONE A</text>
    </svg>
  </div>
)

const MaduraiMap = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <svg className="h-full w-full max-w-4xl" viewBox="0 0 800 600">
      <rect x="200" y="100" width="400" height="400" stroke="#d84315" strokeWidth="3" fill="#fff" />
      <rect x="300" y="200" width="100" height="100" fill="#d84315" opacity="0.2" />
      <text x="350" y="260" textAnchor="middle" fill="#d84315">MEENAKSHI</text>
      <rect x="400" y="200" width="100" height="100" fill="#d84315" opacity="0.2" />
      <text x="450" y="260" textAnchor="middle" fill="#d84315">SUNDARESWARAR</text>
    </svg>
  </div>
)

const PuriMap = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <svg className="h-full w-full max-w-4xl" viewBox="0 0 800 600">
      <rect x="200" y="100" width="400" height="400" stroke="#d84315" strokeWidth="3" fill="#fff" />
      <rect x="325" y="225" width="150" height="150" fill="#d84315" opacity="0.2" />
      <text x="400" y="310" textAnchor="middle" fill="#d84315">JAGANNATH</text>
      <rect x="375" y="500" width="50" height="30" fill="#3b82f6" />
      <text x="400" y="520" textAnchor="middle" fill="#fff">ENTRY</text>
    </svg>
  </div>
)

export default TempleMap