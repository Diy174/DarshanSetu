import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parkingZones } from '../data/sampleData'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'

const ParkingAvailability = () => {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const t = useTranslation()
  const [selectedZone, setSelectedZone] = useState(booking.parkingZone || parkingZones[0].id)
  const [visitDate, setVisitDate] = useState(
    booking.visitDate || new Date().toISOString().split('T')[0],
  )
  const [arrivalTime, setArrivalTime] = useState(booking.parkingTime || '07:30')
  const [vehicle, setVehicle] = useState(booking.vehicleType || 'Two wheeler')

  useEffect(() => {
    if (!booking.temple) {
      navigate('/')
    }
  }, [booking.temple, navigate])

  const selectedZoneData = useMemo(
    () => parkingZones.find((zone) => zone.id === selectedZone),
    [selectedZone],
  )

  const handleConfirm = () => {
    const payload = {
      parkingZone: selectedZoneData.title,
      visitDate, 
      parkingTime: arrivalTime,
      vehicleType: vehicle,
    }
    updateBooking(payload)
    navigate('/parking-slots')
  }

  if (!booking.temple) {
    return null
  }

  const vehicleOptions = ['Two wheeler', 'Four wheeler', 'Wheelchair']

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-4">
        <p className="text-sm uppercase tracking-wide text-brand-dusk/60">
          {t('parking.heading')}
        </p>
        <h2 className="section-heading">{t('parking.title')}</h2>
        <p className="text-brand-dusk/70">{t('parking.subtitle')}</p>

        <div className="space-y-2 rounded-2xl border border-brand-dusk/10 bg-white/80 p-4 text-sm text-brand-dusk/80">
          <p>
            {t('parking.h1')}
          </p>
          <p>
            {t('parking.h2')}
          </p>
          <p>
            {t('parking.h3')}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {parkingZones.map((zone, index) => {
          const isActive = zone.id === selectedZone
          const occupancy = Math.round((zone.slotsFree / zone.capacity) * 100)
          const vehicleTitle = vehicleOptions[index] || zone.title

          return (
            <article
              key={zone.id}
              onClick={() => {
                setSelectedZone(zone.id)
                setVehicle(vehicleTitle)
              }}
              onDoubleClick={handleConfirm}
              className={`flex cursor-pointer flex-col gap-4 rounded-3xl border p-6 shadow transition hover:-translate-y-1 hover:shadow-xl ${
                isActive
                  ? 'border-brand-saffron bg-white ring-2 ring-brand-saffron'
                  : 'border-brand-dusk/10 bg-white/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-brand-dusk/50">
                    {t('parking.vehicle')}
                  </p>
                  <h3 className="text-xl font-semibold text-brand-dusk">
                    {vehicleTitle}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    occupancy > 40
                      ? 'bg-brand-teal/15 text-brand-teal'
                      : occupancy > 15
                        ? 'bg-brand-saffron/10 text-brand-saffron'
                        : 'bg-rose-50 text-rose-500'
                  }`}
                >
                  {zone.slotsFree} {t('parking.free')}
                </span>
              </div>
              <p className="text-sm text-brand-dusk/70">{zone.walkingTime}</p>
              <div className="h-2 rounded-full bg-brand-dusk/10">
                <div
                  className="h-2 rounded-full bg-brand-saffron transition"
                  style={{ width: `${Math.min(100, occupancy)}%` }}
                />
              </div>
              <ul className="text-sm text-brand-dusk/70">
                {zone.amenities.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>

      {selectedZoneData && (
        <div className="glass-panel flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-dusk/60">
              {t('parking.summary')}
            </p>
            <h3 className="text-2xl font-semibold text-brand-dusk">
              {booking.temple?.name}
            </h3>
            <p className="text-brand-dusk/60">
              {visitDate} · {arrivalTime} hrs · {vehicle}
            </p>
          </div>
          <p className="text-sm text-brand-dusk/70">
            {t('parking.lowerdiv')}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-orange-dark"
            >
              {t('parking.ctn')}
            </button>
            <button
              onClick={() => navigate('/booking')}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg hover:border-brand-orange hover:text-brand-orange"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('parking.return')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParkingAvailability
