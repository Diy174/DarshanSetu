import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext' //read the selected temple feom global context
import useTranslation from '../hooks/useTranslation'

const BookingOptions = () => {
  const navigate = useNavigate()
  const { booking } = useBooking()
  const t = useTranslation()


  useEffect(() => {
    if (!booking.temple) {
      navigate('/')
    }
  }, [booking.temple, navigate])

  if (!booking.temple) return null

  return (
    <div className="space-y-8">
      <section
        className="relative h-96 overflow-hidden rounded-3xl bg-cover bg-center shadow-2xl"
        style={{ backgroundImage: `url(${booking.temple.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
            {t('booking.featured')}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            {booking.temple.name}
          </h1>
          <p className="mt-2 text-lg text-white/90">{booking.temple.city}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {booking.temple.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6 lg:col-span-2">
        <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="font-display text-2xl font-bold text-black">
            {t('booking.briefTitle')}
          </h3>
          <p className="mt-2 text-gray-600">{t('booking.briefSubtitle')}</p>
          <div className="mt-4 h-1 w-16 rounded-full bg-brand-orange" />
          <br />
          <article className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-brand-orange">
                  {t('booking.history')}
                </p>
                <p className="mt-3 leading-relaxed text-gray-700">
                  {booking.temple.history}
                </p>
              </div>
            </div>
          </article>
          <br />
          <article className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-brand-orange">
                  {t('booking.origin')}
                </p>
                <p className="mt-3 leading-relaxed text-gray-700">
                  {booking.temple.origin}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-xl md:p-12">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-black md:text-3xl">
            {t('booking.howToProceed')}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
            {t('booking.selectOption')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <button
            onClick={() => navigate('/slots')}
            className="group rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-xl focus:outline-none focus:ring-0"
          >
            <h3 className="font-display text-xl font-bold text-black md:text-2xl">
              {t('booking.btn.slot')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {t('booking.slotDesc')}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-orange">
              <span>{t('booking.btn.slot')}</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/parking')}
            className="group rounded-3xl border-2 border-gray-200 bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-xl"
          >
            <h3 className="font-display text-xl font-bold text-black md:text-2xl">
              {t('booking.btn.parking')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {t('booking.parkingDesc')}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-orange">
              <span>{t('booking.btn.parking')}</span>
              <span className="transition group-hover:translate-x-2">→</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}

export default BookingOptions
