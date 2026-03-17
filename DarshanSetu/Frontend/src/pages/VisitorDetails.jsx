import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VisitorDetails = () => {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const t = useTranslation()

  const [username, setName] = useState(booking.name || '')
  const [phone, setPhone] = useState(booking.phone || '')
  const [errorMsg, setErrorMsg] = useState("")

  const isKashiTemple =
    booking.temple?.name?.trim().toLowerCase() === "shri kashi vishwanath temple".toLowerCase()

  const DEFAULT_MAX_VISITORS = 10
  const MAX_VISITORS = isKashiTemple
    ? 2
    : (booking.temple?.maxVisitors ?? DEFAULT_MAX_VISITORS)

  const [visitorsList, setVisitorsList] = useState(
    booking.visitorDetails || [{
      name: '',
      aadhaar: '',
      type: 'visitor'
    }]
  )

  useEffect(() => {
    if (!booking.temple) {
      navigate('/')
    }
  }, [booking.temple, navigate])

  const addVisitor = () => {
    if (visitorsList.length >= MAX_VISITORS) {
      setErrorMsg(`Maximum ${MAX_VISITORS} visitors allowed per booking ${isKashiTemple ? '(Kashi Vishwanath Temple)' : ''}`)
      return
    }
    setVisitorsList([...visitorsList, { name: '', aadhaar: '', type: 'visitor' }])
    setErrorMsg('')
  }

  const removeVisitor = (index) => {
    if (visitorsList.length === 1) {
      setErrorMsg('At least one visitor is required')
      return
    }
    setVisitorsList(visitorsList.filter((_, i) => i !== index))
    setErrorMsg('')
  }

  const updateVisitor = (index, field, value) => {
    const updated = [...visitorsList]
    updated[index][field] = value
    setVisitorsList(updated)
  }

  const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    if (!username.trim()) {
      setErrorMsg('Please enter pilgrim name')
      return
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      setErrorMsg('Please enter valid 10-digit phone number')
      return
    }
    for (let i = 0; i < visitorsList.length; i++) {
      const visitor = visitorsList[i]

      if (!visitor.name.trim()) {
        setErrorMsg(`Please enter name for visitor ${i + 1}`)
        return
      }

      if (!validateAadhaar(visitor.aadhaar)) {
        setErrorMsg(`Please enter valid 12-digit Aadhaar for ${visitor.name}`)
        return
      }

      if (!visitor.type) {
        setErrorMsg(`Please select type for ${visitor.name}`)
        return
      }
    }
    if (visitorsList.length > MAX_VISITORS) {
      setErrorMsg(`Maximum ${MAX_VISITORS} visitors allowed per booking ${isKashiTemple ? '(Kashi Vishwanath Temple)' : ''}`)
      return
    }
    const totalVisitors = visitorsList.length
    const elders = visitorsList.filter(v => v.type === 'elder').length
    const differentlyAbled = visitorsList.filter(v => v.type === 'differentlyAbled').length

    const bookingInfo = {
      username,
      phone,
      visitorDetails: visitorsList,
      visitors: totalVisitors,
      elders,
      differentlyAbled,
      id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      temple: booking.temple.name,
      city: booking.temple.city,
      date: booking.visitDate,
      slot: booking.visitSlot,
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/bookings/booking`,
        bookingInfo,
        { headers: { 'content-Type': 'application/json' } }
      )

      if (res && (res.status === 200 || res.status === 201)) {
        console.log('Booking Successful:', res.data)

        updateBooking({
          name: username,
          phone,
          visitorDetails: visitorsList,
          total: totalVisitors,
          elders,
          differentlyAbled,
          bookingId: bookingInfo.id
        })

        navigate('/confirmation')
      } else {
        setErrorMsg('Booking failed. Please try again.')
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong while booking!")
      return
    }
  }

  if (!booking.temple) return null

  return (
    <div className="space-y-8">

      {booking.temple && (
        <div
          className={`rounded-2xl border-2 p-4 ${isKashiTemple
              ? "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50"
              : "border-blue-200 bg-blue-50"
            }`}
        >
          <div className="flex items-center gap-3">
            <svg className={`h-6 w-6 flex-shrink-0 ${isKashiTemple ? "text-orange-600" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>

            <div>
              <p className={`text-sm font-semibold ${isKashiTemple ? "text-orange-900" : "text-blue-900"}`}>
                {booking.temple.name}
              </p>
              <p className={`text-xs ${isKashiTemple ? "text-orange-700" : "text-blue-700"}`}>
                Maximum {MAX_VISITORS} devotees allowed per booking
                {isKashiTemple ? " (Special Rule)" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="glass-panel space-y-4">
        <p className="text-sm uppercase tracking-wide text-brand-dusk/60">
          {t('details.heading')}
        </p>
        <h2 className="section-heading">{t('details.title')}</h2>
        <p className="text-brand-dusk/70">{t('details.subtitle')}</p>
      </section>

      <form onSubmit={handleSubmit} className="glass-panel space-y-6">
        <div>
          <p className="mb-4 text-sm uppercase tracking-wide text-brand-dusk/60">

          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-brand-dusk/70">
              {t('visitor.devoteeNameLabel')} *
              <input
                type="text"
                value={username}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 rounded-2xl border border-brand-dusk/15 bg-white/80 px-4 py-3 focus:border-brand-saffron focus:outline-none"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-brand-dusk/70">
              {t('visitor.contactLabel')} *
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                className="mt-2 rounded-2xl border border-brand-dusk/15 bg-white/80 px-4 py-3 focus:border-brand-saffron focus:outline-none"
              />
            </label>
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-wide text-brand-dusk/60">
              {t('visitor.details')} ({visitorsList.length}/{MAX_VISITORS})
              {isKashiTemple && (
                <span className="ml-2 text-xs text-orange-600 font-semibold">
                  (Kashi Vishwanath)
                </span>
              )}
            </p>
          </div>

          <div className="space-y-4">
            {visitorsList.map((visitor, index) => (
              <div
                key={index}
                className="rounded-2xl border border-brand-dusk/15 bg-white/80 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-dusk">
                    {t('visitor.vis')} {index + 1}
                  </p>
                  {visitorsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVisitor(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      {t('visitor.remove')}
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="flex flex-col text-sm font-medium text-brand-dusk/70">
                    {t('visitor.name')} *
                    <input
                      type="text"
                      value={visitor.name}
                      onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                      required
                      className="mt-2 rounded-xl border border-brand-dusk/15 bg-white px-3 py-2 focus:border-brand-saffron focus:outline-none"
                    />
                  </label>

                  <label className="flex flex-col text-sm font-medium text-brand-dusk/70">
                    {t('visitor.adhaar')} *
                    <input
                      type="text"
                      value={visitor.aadhaar}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 12)
                        updateVisitor(index, 'aadhaar', value)
                      }}
                      required
                      pattern="\d{12}"
                      placeholder="12 digits"
                      className="mt-2 rounded-xl border border-brand-dusk/15 bg-white px-3 py-2 focus:border-brand-saffron focus:outline-none"
                    />
                  </label>

                  <label className="flex flex-col text-sm font-medium text-brand-dusk/70">
                    {t('visitor.type')} *
                    <select
                      value={visitor.type}
                      onChange={(e) => updateVisitor(index, 'type', e.target.value)}
                      required
                      className="mt-2 rounded-xl border border-brand-dusk/15 bg-white px-3 py-2 focus:border-brand-saffron focus:outline-none"
                    >
                      <option value="visitor">{t('visitor.vis')} (0-59)</option>
                      <option value="elder">{t('visitor.elder')} (60+)</option>
                      <option value="differentlyAbled">{t('visitor.diff')}</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
          {visitorsList.length < MAX_VISITORS && (
            <button
              type="button"
              onClick={addVisitor}
              className="mt-4 flex items-center gap-2 rounded-full border-2 border-dashed border-brand-saffron bg-white/80 px-6 py-3 text-sm font-semibold text-brand-saffron hover:bg-brand-saffron/10"
            >
              <span className="text-xl">+</span>
              {t('visitor.add')}
            </button>
          )}
        </div>
        <div className="rounded-3xl border border-brand-dusk/10 bg-white/80 p-5">
          <p className="text-xs uppercase tracking-wide text-brand-dusk/50">
            {t('visitor.bookingSummary')}
          </p>
          <div className="mt-3 space-y-1 text-sm text-brand-dusk/70">
            <p><strong>{t('visitor.temple')}:</strong> {booking.temple.name}</p>
            <p><strong>{t('visitor.date')}:</strong> {booking.visitDate}</p>
            {booking.visitSlot && (
              <p><strong>{t('visitor.slot')}:</strong> {booking.visitSlot}</p>
            )}
            <p><strong>{t('visitor.totalVisitorsLabel')}:</strong> {visitorsList.length}</p>
            <p><strong>{t('visitor.elder')}:</strong> {visitorsList.filter(v => v.type === 'elder').length}</p>
            <p><strong>{t('visitor.diff')}:</strong> {visitorsList.filter(v => v.type === 'differentlyAbled').length}</p>
            {isKashiTemple && (
              <p className="mt-2 pt-2 border-t border-orange-200">
                <strong className="text-orange-600">Temple:</strong>
                <span className="ml-2 text-orange-700"> Kashi Vishwanath (2 devotees max)</span>
              </p>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-brand-dusk px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-saffron"
        >
          {t('details.submit')}
        </button>
      </form>
    </div>
  )
}

export default VisitorDetails