import { useBooking } from '../context/BookingContext'
import { useState } from 'react'
import useTranslation from '../hooks/useTranslation'
const ContactUs = () => {
  const { booking } = useBooking()
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('query') // 'query' or 'panic'
  const [querySubmitted, setQuerySubmitted] = useState(false)

  const t = useTranslation()
  const templeContacts = {
    'Tirumala Tirupati Devasthanams': {
      temple: 'Tirumala Tirupati Devasthanams',
      phone: '+91-877-2277777',
      email: 'info@tirumala.org',
      timings: '6:00 AM - 10:00 PM',
      emergency: '+91-877-2263333'
    },
    'Shri Kashi Vishwanath Temple': {
      temple: 'Shri Kashi Vishwanath Temple',
      phone: '+91-542-2392059',
      email: 'info@shrikashivishwanath.org',
      timings: '7:00 AM - 9:00 PM',
      emergency: '+91-542-2392060'
    },
    'Meenakshi Amman Temple': {
      temple: 'Meenakshi Amman Temple',
      phone: '+91-452-2345789',
      email: 'info@meenakshitemple.org',
      timings: '5:00 AM - 9:30 PM',
      emergency: '+91-452-2345790'
    },
    'Shri Jagannath Puri': {
      temple: 'Shri Jagannath Puri',
      phone: '+91-6752-222106',
      email: 'info@jagannath.nic.in',
      timings: '5:00 AM - 10:00 PM',
      emergency: '+91-6752-222107'
    },
    'Somnath Temple': {
      temple: 'Somnath Temple',
      phone: '+91-842-268699',
      email: 'info@somnath.org',
      timings: '7:00 AM - 9:30 PM',
      emergency: '+91-748-984837'
    },
    'Shri Ambaji Mata Temple': {
      temple: 'Shri Ambaji Mata Temple',
      phone: '+91-898-262288',
      email: 'info@shriambajimata.org',
      timings: '4:00 AM - 9:30 PM',
      emergency: '+91-938-474849'
    },
    'Dwarkadish Temple': {
      temple: 'Dwarkadish Temple',
      phone: '+91-499-142627',
      email: 'info@dwarkadish.org',
      timings: '10:00 AM - 11:40 PM',
      emergency: '+91-938-479373'
    },
    'Vaishno Devi Temple': {
      temple: 'Vaishno Devi Temple',
      phone: '+91-746-383838',
      email: 'info@vaishnodevi.org',
      timings: '8:00 AM - 10:30 PM',
      emergency: '+91-373-843837'
    }
  }

  const selectedTempleContact = booking.temple?.name
    ? templeContacts[booking.temple.name]
    : null

  const handleSubmit = (type) => {
    if (message.trim()) {
      setMessageType(type)
      setQuerySubmitted(true)
      setTimeout(() => {
        setQuerySubmitted(false)
        setMessage('')
      }, 3000)
    }
  }


  if (!selectedTempleContact) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl border-2 border-blue-200 bg-white p-8 text-center shadow-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-3 py-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
             
               nav.contact
            </p>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-black md:text-3xl">
            Please Select a Temple First
          </h2>
          <p className="mt-2 text-blue-600">
            Contact information will be available after you select a temple
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {querySubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`rounded-3xl border-2 bg-white p-8 shadow-2xl ${
              messageType === 'panic' ? 'border-red-500' : 'border-green-500'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  messageType === 'panic' ? 'bg-red-100' : 'bg-green-100'
                }`}
              >
                {messageType === 'panic' ? (
                  <svg
                    className="h-12 w-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <h3 className="text-2xl font-bold text-black">
                {messageType === 'panic'
                  ? 'Emergency Alert Sent!'
                  : 'Message Submitted'}
              </h3>

              <p className="text-center text-gray-600">
                {messageType === 'panic'
                  ? 'Temple authorities have been notified immediately. Help is on the way!'
                  : 'Temple authorities will respond to your query soon'}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-3 py-1">
          <p className="text-xs font-semibold uppercase text-blue-600">
            Get in Touch
          </p>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-black md:text-3xl">
          Contact {selectedTempleContact.temple}
        </h2>
        <p className="mt-2 text-blue-600">
          Reach out to temple authorities for assistance and queries
        </p>
      </section>

      <div className="rounded-3xl border-2 border-blue-200 bg-blue-50 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-xl font-bold text-black">Temple Authority Contacts</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border-2 border-blue-300 bg-white p-4">
            <div className="flex items-start gap-3">

              <div>
                <p className="text-xs font-semibold uppercase text-blue-600">Phone</p>
                <a
                  href={`tel:${selectedTempleContact.phone}`}
                  className="text-lg font-semibold text-blue-700 hover:underline"
                >
                  {selectedTempleContact.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-red-300 bg-white p-4">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-red-600">Emergency Hotline</p>
                <a
                  href={`tel:${selectedTempleContact.emergency}`}
                  className="text-lg font-semibold text-red-600 hover:underline"
                >
                  {selectedTempleContact.emergency}
                </a>
              </div>
            </div>
          </div>


          <div className="rounded-xl border-2 border-blue-300 bg-white p-4">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-blue-600">Email</p>
                <a
                  href={`mailto:${selectedTempleContact.email}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  {selectedTempleContact.email}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-blue-300 bg-white p-4">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-blue-600">Available Timings</p>
                <p className="text-sm text-gray-700">
                  {selectedTempleContact.timings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      

    
      <div className="rounded-3xl border-2 border-green-200 bg-green-50 p-6 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☎</span>
          <h3 className="font-bold text-black">National Pilgrim Helpline</h3>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          24/7 assistance for all temples across India
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href="tel:1800-108-1212"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
          >
            1800-108-1212 (Toll Free)
          </a>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
