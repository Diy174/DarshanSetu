import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'

const Donations = () => {
  const navigate = useNavigate()
  const { booking } = useBooking()
  const t = useTranslation()

  const [donorName, setDonorName] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!booking.temple) {
      navigate('/')
    }
  }, [booking.temple, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!donorName || !contactNo || !donationAmount) {
      alert('Please fill all required fields')
      return
    }

    if (contactNo.length !== 10) {
      alert('Please enter a valid 10-digit contact number')
      return
    }

    if (parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount')
      return
    }

    setSubmitted(true)
    
  
    setTimeout(() => {
      setSubmitted(false)
      setDonorName('')
      setContactNo('')
      setDonationAmount('')
    }, 3000)
  }

  if (!booking.temple) {
    return null
  }

  return (
    <div className="space-y-8">
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-3xl border-2 border-green-500 bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black">Donation Submitted!</h3>
              <p className="text-center text-gray-600">
                Thank you for your generous donation. Temple authorities will contact you shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-3xl border-2 border-orange-200 bg-white p-8 shadow-lg">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-600 bg-orange-50 px-3 py-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            {t('donations.title')}
          </p>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-black md:text-3xl">
           {booking.temple.name}
        </h2>
        <p className="mt-2 text-orange-600">
          {t('donations.subtitle')}
        </p>
      </section>

      <div className="rounded-3xl border-2 border-orange-200 bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-4 text-xl font-bold text-black">{t('donations.details')}</h3>
            <p className="text-sm text-gray-600">
              {t('donations.fillDetails')}
            </p>
          </div>

          <label className="flex flex-col text-sm font-medium text-black">
            {t('donations.donorName')} *
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-orange-600 focus:border-orange-600 focus:outline-none"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-black">
            {t('donations.contactNumber')} *
            <input
              type="tel"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value.replace(/\D/g, ''))}
              required
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength="10"
              className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-orange-600 focus:border-orange-600 focus:outline-none"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-black">
            {t('donations.amount')} (₹) 
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              required
              placeholder="Enter amount in rupees"
              min="1"
              step="1"
              className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-orange-600 focus:border-orange-600 focus:outline-none"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">{t('donations.quickSelect')}:</p>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {[1000, 2000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setDonationAmount(amount.toString())}
                  className="rounded-xl border-2 border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-600 hover:text-white"
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ</span>
              <div>
                <p className="text-sm font-semibold text-blue-900">{t('donations.importantNote')}</p>
                <p className="mt-1 text-sm text-blue-800">
                  {t('donations.authorityContact')}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-700"
          >
            {t('donations.submit')}
          </button>

          <button
            type="button"
            onClick={() => navigate('/booking')}
            className="w-full rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg transition hover:border-orange-600 hover:text-orange-600"
          >
            {t('donations.backToTemple')}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border-2 border-orange-200 bg-orange-50 p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-orange-900">{t('donations.helps')}:</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold text-orange-900">{t('donations.maintenance')}</p>
              <p className="text-sm text-orange-800">{t('donations.maintenanceDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold text-orange-900">{t('donations.rituals')}</p>
              <p className="text-sm text-orange-800">{t('donations.ritualsDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold text-orange-900">{t('donations.prasad')}</p>
              <p className="text-sm text-orange-800">{t('donations.prasadDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold text-orange-900">{t('donations.education')}</p>
              <p className="text-sm text-orange-800">{t('donations.educationDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donations