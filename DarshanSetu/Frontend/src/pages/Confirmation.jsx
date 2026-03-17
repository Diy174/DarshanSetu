import { useEffect, useMemo } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import useTranslation from '../hooks/useTranslation'

const Confirmation = () => {
  const navigate = useNavigate()
  const { booking, resetBooking } = useBooking()
  const t = useTranslation()

  useEffect(() => {
    if (!booking.temple || (!booking.visitSlot && !booking.parkingZone)) {
      navigate('/')
    }
  }, [booking.temple, booking.visitSlot, booking.parkingZone, navigate])

  const qrPayload = useMemo(
    () =>
      JSON.stringify({
        bookingId: booking.bookingId,
        temple: booking.temple?.name,
        city: booking.temple?.city,
        date: booking.visitDate,
        slot: booking.visitSlot,
        mainPilgrim: booking.name,
        phone: booking.phone,
        totalVisitors: booking.total,
        visitors: booking.visitorDetails?.map(v => ({
          name: v.name,
          aadhaar: v.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'), // Format aadhaar
          type: v.type === 'visitor' ? 'Regular (0-59)' : 
                v.type === 'elder' ? 'Elder (60+)' : 'Differently Abled'
        })),
        elders: booking.elders,
        differentlyAbled: booking.differentlyAbled,
        issuedAt: new Date().toISOString(),
      }),
    [booking]
  )

  //SVG (Scalable Vector Graphics) is a vector-based image format that uses XML to describe shapes and graphics, allowing images to scale without losing quality.
  const downloadQr = () => {
    const svg = document.getElementById('darshan-qr')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgData = serializer.serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `darshan-pass-${booking.bookingId}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!booking.temple) return null

  return (
    <div className="space-y-8">
      <section className="glass-panel space-y-4">
        <p className="text-sm uppercase tracking-wide text-brand-dusk/60">
          {t('confirmation.passGenerated')}
        </p>
        <h2 className="section-heading">{t('confirmation.qrReady')}</h2>
        <p className="text-brand-dusk/70">
          {t('confirmation.qrDesc')}
        </p>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4 rounded-3xl border border-brand-dusk/10 bg-white/90 p-6 text-center shadow-inner">
            <div className="rounded-3xl bg-white p-4 shadow-lg">
              <QRCode id="darshan-qr" value={qrPayload} size={180} />
            </div>
            <p className="text-sm text-brand-dusk/70">
              {t('confirmation.bookingId')}: {booking.bookingId}
            </p>
            <p className="text-xs text-brand-dusk/60">
              {booking.temple?.name} · {booking.visitDate} {booking.visitSlot}
            </p>
            <div className="flex gap-3">
              <button
                onClick={downloadQr}
                className="rounded-full bg-brand-dusk px-4 py-2 text-sm font-semibold text-white"
              >
                {t('confirmation.downloadQR')}
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-full border border-brand-saffron px-4 py-2 text-sm font-semibold text-brand-saffron"
              >
                {t('confirmation.printSlip')}
              </button>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <article className="rounded-3xl border border-brand-dusk/10 bg-white/80 p-5 shadow">
              <p className="text-xs uppercase tracking-wide text-brand-dusk/50">
                {t('confirmation.details')}
              </p>
              <h3 className="text-xl font-semibold text-brand-dusk">
                {booking.temple?.name}
              </h3>
              <p className="text-sm text-brand-dusk/60">{booking.temple?.city}</p>
              <p className="mt-2 text-sm text-brand-dusk/70">
                {t('confirmation.slot')} · {booking.visitDate} · {booking.visitSlot}
              </p>
            </article>

            <article className="rounded-3xl border border-brand-dusk/10 bg-white/80 p-5 shadow">
              <p className="text-xs uppercase tracking-wide text-brand-dusk/50">
                {t('confirmation.pilgrim')}
              </p>
              <ul className="mt-2 text-sm text-brand-dusk/70">
                <li><strong>{t('confirmation.name')}:</strong> {booking.name || '—'}</li>
                <li><strong>{t('confirmation.contact')}:</strong> {booking.phone || '—'}</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-brand-dusk/10 bg-white/80 p-5 shadow">
              <p className="text-xs uppercase tracking-wide text-brand-dusk/50 mb-3">
                {t('confirmation.pilgrim')} ({booking.total} Total)
              </p>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {booking.visitorDetails?.map((visitor, index) => (
                  <div key={index} className="border-l-2 border-brand-saffron pl-3 py-2">
                    <p className="text-sm font-semibold text-brand-dusk">
                      {index + 1}. {visitor.name}
                    </p>
                    <p className="text-xs text-brand-dusk/60">
                      {t('confirmation.aadhar')}: {visitor.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '•••• •••• $3')}
                    </p>
                    <p className="text-xs text-brand-dusk/60">
                      {t('confirmation.type')}: {visitor.type === 'visitor' ? 'Regular (0-59)' : 
                             visitor.type === 'elder' ? 'Elder (60+)' : 
                             'Differently Abled'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-brand-dusk/10 text-xs text-brand-dusk/60">
                <p>{t('confirmation.elders')}: {booking.elders} | {t('confirmation.diff')}: {booking.differentlyAbled}</p>
              </div>
            </article>

            {booking.parkingZone && (
              <article className="rounded-3xl border border-brand-dusk/10 bg-white/80 p-5 shadow">
                <p className="text-xs uppercase tracking-wide text-brand-dusk/50">
                  Parking
                </p>
                <p className="text-sm text-brand-dusk/70">
                  Zone: {booking.parkingZone}
                </p>
                <p className="mt-1 text-sm text-brand-dusk/70">
                  {booking.parkingTime} hrs · {booking.vehicleType}
                </p>
              </article>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              resetBooking()
              navigate('/')
            }}
            className="rounded-full border border-brand-dusk/20 px-5 py-2 text-sm font-semibold text-brand-dusk"
          >
            {t('confirmation.planAnother')}
          </button>
          <button 
            className="rounded-full bg-brand-saffron px-5 py-2 text-sm font-semibold text-white" 
            onClick={() => window.open("https://web.whatsapp.com/", "_blank")}
          >
            {t('confirmation.shareWhatsApp')}
          </button>
        </div>
      </section>
    </div>
  )
}

export default Confirmation