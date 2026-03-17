import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SlotAvailability = () => {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const t = useTranslation()
  const [visitDate, setVisitDate] = useState(
    booking.visitDate || new Date().toISOString().split('T')[0]
  )
  const [selectedSlot, setSelectedSlot] = useState(booking.visitSlot || '')
  const [slotsData, setSlotsData] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // const TEMPLE_CAP = 60000
  // const isKashiTemple = booking.temple?.name === "Shri Kashi Vishwanath Temple"

  // const calculatedSlotCapacity = useMemo(() => {
  //   if (isKashiTemple) {
  //     return 2
  //   }
  //   if (!booking.predictedVisitors) {
  //     return null
  //   }

  //   const predictedVisitors = booking.predictedVisitors

  //   let slotCapacity
  //   if (predictedVisitors > TEMPLE_CAP) {
  //     slotCapacity = Math.floor((0.85 * TEMPLE_CAP) / 15)
  //   } else {
  //     slotCapacity = Math.floor((predictedVisitors * 0.85) / 15)
  //   }

  //   return slotCapacity
  // }, [booking.predictedVisitors, isKashiTemple])

  const DEFAULT_SLOT_CAPACITY = 2000;
  const isKashiTemple = booking.temple?.name === "Shri Kashi Vishwanath Temple";

  const calculatedSlotCapacity = useMemo(() => {
    if (!booking.temple) return null;


    if (isKashiTemple) return 2;

    return booking.temple.slotCapacity ?? DEFAULT_SLOT_CAPACITY;
  }, [booking.temple, isKashiTemple]);

  const fetchSlotAvailability = async () => {
    if (!booking.temple || !visitDate) return

    setLoadingSlots(true)
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/bookings/slot-availability`,
        {
          params: {
            temple: booking.temple.name,
            date: visitDate
          }
        }
      )

      if (response.data && response.data.data) {
        setSlotsData(response.data.data)
      }
    } catch (error) {
      if (error.response?.status === 404 || slotsData.length === 0) {
        await initializeSlots()
      }
    } finally {
      setLoadingSlots(false)
    }
  }
  const initializeSlots = async () => {
    if (!booking.temple || !visitDate || !calculatedSlotCapacity) {
      console.log("⏸ Skipping slot initialization - missing requirements:", {
        hasTemple: !!booking.temple,
        hasDate: !!visitDate,
        hasCapacity: !!calculatedSlotCapacity
      })
      return
    }

    const slotTemplates = [
      { slot: "6:00 AM - 7:00 AM", totalSeats: calculatedSlotCapacity },
      { slot: "7:00 AM - 8:00 AM", totalSeats: calculatedSlotCapacity },
      { slot: "8:00 AM - 9:00 AM", totalSeats: calculatedSlotCapacity },
      { slot: "9:00 AM - 10:00 AM", totalSeats: calculatedSlotCapacity },
      { slot: "10:00 AM - 11:00 AM", totalSeats: calculatedSlotCapacity },
      { slot: "11:00 AM - 12:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "12:00 PM - 1:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "1:00 PM - 2:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "2:00 PM - 3:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "3:00 PM - 4:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "4:00 PM - 5:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "5:00 PM - 6:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "6:00 PM - 7:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "7:00 PM - 8:00 PM", totalSeats: calculatedSlotCapacity },
      { slot: "8:00 PM - 9:00 PM", totalSeats: calculatedSlotCapacity },
    ]

    console.log(`🔧 Initializing slots with capacity: ${calculatedSlotCapacity} ${isKashiTemple ? '(KASHI TEMPLE)' : '(NORMAL)'}`)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/bookings/initialize-slots`,
        {
          temple: booking.temple.name,
          date: visitDate,
          slots: slotTemplates
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      await fetchSlotAvailability()
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    if (!booking.temple) {
      navigate('/')
    }
  }, [booking.temple, navigate])

  useEffect(() => {
    if (visitDate && booking.temple) {
      fetchSlotAvailability()
    }
  }, [visitDate, booking.temple])
  useEffect(() => {
    if (!calculatedSlotCapacity || booking.predictionLoading) {
      return
    }

    const needsInitialization = slotsData.length === 0
    const needsUpdate = slotsData.length > 0 && slotsData[0]?.totalSeats !== calculatedSlotCapacity

    if (needsInitialization && !loadingSlots) {
      initializeSlots()
    } else if (needsUpdate) {
      setSlotsData([])
      setTimeout(() => initializeSlots(), 100)
    }
  }, [calculatedSlotCapacity, slotsData.length, loadingSlots, booking.predictionLoading, isKashiTemple])

  useEffect(() => {
    if (visitDate && visitDate !== booking.visitDate) {
      updateBooking({ visitDate })
    }
  }, [visitDate, booking.visitDate, updateBooking])

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setVisitDate(newDate)
    setSlotsData([])
  }

  const handleContinue = () => {
    if (!selectedSlot) return
    const payload = {
      visitDate,
      visitSlot: selectedSlot,
    }
    if (!booking.isAuthenticated) {
      updateBooking({
        ...payload,
        pendingPath: '/details',
      })
      navigate('/access')
      return
    }
    updateBooking(payload)
    navigate('/details')
  }

  if (!booking.temple) return null

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-4">
        <p className="text-sm uppercase tracking-wide text-brand-dusk/60">
          {t('slots.heading')}
        </p>
        <h2 className="section-heading">{t('slots.title')}</h2>

        <label className="flex flex-col text-sm font-medium text-brand-dusk/70">
          {t('slots.date')}
          <input
            type="date"
            value={visitDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="mt-2 rounded-2xl border border-brand-dusk/15 bg-white/80 px-4 py-3 focus:border-brand-saffron focus:outline-none"
          />
        </label>
        {/* Festival Info (API-based) */}
        {visitDate && (
          <div className="mt-4 rounded-2xl border border-brand-saffron/30 bg-brand-saffron/5 p-4">
            {booking.navratriInfo?.type && booking.navratriInfo?.day && booking.navratriInfo?.goddess ? (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-4">
                <p className="font-semibold text-rose-700">
                  🌺 {booking.navratriInfo.type}
                </p>
                <p className="text-sm text-rose-600">
                  Day {booking.navratriInfo.day} — Goddess {booking.navratriInfo.goddess}
                </p>
              </div>
            ) : (
              <p className="text-sm text-brand-dusk/60">No major festival on this date</p>
            )}

            {Boolean(booking.publicHoliday) && (
              <p className="mt-1 text-sm font-medium text-amber-700">
                🇮🇳 Public Holiday
              </p>
            )}
          </div>
        )}
        {/* Weather Information */}
        {booking.temperature !== null && (
          <div className="mt-4 rounded-2xl border border-sky-300 bg-sky-50 p-4">
            <p className="text-sm font-bold text-sky-700">
              🌦️ Weather Forecast
            </p>

            <div className="mt-2 flex gap-6 text-sm text-sky-900">
              <p>🌡️ Temperature: <b>{booking.temperature}°C</b></p>
              <p>🌧️ Rainfall: <b>{booking.precipitation} mm</b></p>
            </div>

            {booking.precipitation > 5 && (
              <p className="mt-2 text-xs font-semibold text-red-600">
                ⚠️ Heavy rain expected. Plan accordingly.
              </p>
            )}
          </div>
        )}


        {visitDate && !isKashiTemple && (
          <div className="mt-6 rounded-2xl border-2 border-brand-saffron/20 bg-gradient-to-br from-brand-saffron/5 to-brand-orange/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-brand-saffron/10 p-3">
                <svg className="h-6 w-6 text-brand-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <div className="flex-1">

                <div className="space-y-2">
                  <p className="text-sm text-orange-800">
                    <strong>Slot Capacity:</strong> 500 devotees per slot (Limited darshan slots available)
                  </p>
                  <p className="text-sm text-orange-800">
                    <strong>Visitor Limit:</strong> Maximum 10 devotees per booking
                  </p>
                  <p className="text-xs text-orange-700 mt-2">
                    Due to high devotee sacred rituals, Temple maintains limited slot capacity for a peaceful darshan experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {visitDate && isKashiTemple && (
          <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-orange-200 p-3">
                <svg className="h-6 w-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Shri Kashi Vishwanath Temple
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-orange-800">
                    <strong>Slot Capacity:</strong> 2 devotees per slot (Limited darshan slots available)
                  </p>
                  <p className="text-sm text-orange-800">
                    <strong>Visitor Limit:</strong> Maximum 2 devotees per booking
                  </p>
                  <p className="text-xs text-orange-700 mt-2">
                    Due to high devotee sacred rituals, Kashi Vishwanath Temple maintains limited slot capacity for a peaceful darshan experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {loadingSlots && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-saffron border-t-transparent"></div>
          <p className="mt-2 text-sm text-brand-dusk/60">Loading available slots...</p>
        </div>
      )}

      {!loadingSlots && slotsData.length === 0 && calculatedSlotCapacity && (
        <div className="text-center py-8 rounded-2xl border-2 border-dashed border-brand-dusk/20 bg-white/50">
          <p className="text-brand-dusk/60">No slots available yet. Initializing...</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slotsData.map((slot) => {
          const isActive = selectedSlot === slot.slot
          const availableSeats = slot.availableSeats
          const isDisabled = availableSeats <= 0
          const occupancyPercent = (slot.bookedSeats / slot.totalSeats) * 100

          return (
            <article
              key={slot.slot}
              onClick={() => {
                if (!isDisabled) setSelectedSlot(slot.slot)
              }}
              onDoubleClick={() => {
                if (!isDisabled) handleContinue()
              }}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              className={`flex cursor-pointer flex-col gap-3 rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl ${isActive
                ? 'border-brand-saffron bg-white shadow-lg'
                : 'border-brand-dusk/10 bg-white/70'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-auto' : ''}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-brand-dusk">{slot.slot}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${occupancyPercent < 50
                    ? 'bg-brand-teal/15 text-brand-teal'
                    : occupancyPercent < 75
                      ? 'bg-brand-saffron/10 text-brand-saffron'
                      : occupancyPercent < 100
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'bg-rose-50 text-rose-500'
                    }`}
                >
                  {occupancyPercent < 50
                    ? 'Available'
                    : occupancyPercent < 75
                      ? 'Filling'
                      : occupancyPercent < 100
                        ? 'Few left'
                        : 'Full'}
                </span>
              </div>

              <p className="text-sm text-brand-dusk/60">
                {availableSeats > 0
                  ? `${availableSeats.toLocaleString()}/${slot.totalSeats.toLocaleString()} seats available`
                  : `Full (${slot.totalSeats.toLocaleString()}/${slot.totalSeats.toLocaleString()})`}
              </p>

              <div className="h-2 rounded-full bg-brand-dusk/10">
                <div
                  className={`h-2 rounded-full transition ${occupancyPercent < 50
                    ? 'bg-brand-teal'
                    : occupancyPercent < 75
                      ? 'bg-brand-saffron'
                      : occupancyPercent < 100
                        ? 'bg-brand-orange'
                        : 'bg-rose-400'
                    }`}
                  style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                />
              </div>

              {isDisabled && (
                <p className="mt-2 text-xs italic text-rose-600">This slot is full — please choose another.</p>
              )}
            </article>
          )
        })}
      </div>

      {selectedSlot && (
        <div className="glass-panel flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-dusk/60">Summary</p>
            <h3 className="text-2xl font-semibold text-brand-dusk">
              {booking.temple.name}
            </h3>
            <p className="text-brand-dusk/60">
              {visitDate} · {selectedSlot}
            </p>
            {isKashiTemple && (
              <p className="mt-2 text-sm font-semibold text-orange-600">
                Kashi Vishwanath: Max 2 devotees allowed
              </p>
            )}

          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleContinue}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-orange-dark"
            >
              {t('slots.cta')}
            </button>
            <button
              onClick={() => navigate('/booking')}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg hover:border-brand-orange hover:text-brand-orange"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('slot.return')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SlotAvailability