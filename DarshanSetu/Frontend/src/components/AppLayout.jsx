import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'
import { languages, languageNames } from '../i18n/languages'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const navLinks = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.about', to: '/about' },
]

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation()
  const { booking, updateBooking, language, setLanguage } = useBooking()
  const isAdminPage = location.pathname === '/admin-dashboard' || location.pathname === '/admin-login'
  const [bookingsOpen, setBookingsOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showCancelOtp, setShowCancelOtp] = useState(false)
  const [generatedCancelOtp, setGeneratedCancelOtp] = useState('')
  const [cancellingBooking, setCancellingBooking] = useState(null)
  const [cancelOtp, setCancelOtp] = useState('')

  const [selectedHistory, setSelectedHistory] = useState(
    booking.pastBookings?.[0] ?? null,
  )
  const [currentBooking, setCurrentBooking] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);

  const t = useTranslation()

  useEffect(() => {  //closes dropdown and scroll to top (user changes page)
    setBookingsOpen(false)
    setLanguageOpen(false)
    setProfileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {  //update <html lang=""> (user changes language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => { //auto-select latest booking (booking history updates)
    setSelectedHistory(booking.pastBookings?.[0] ?? null)
  }, [booking.pastBookings])

  const handleCancelRequest = (bookingToCancel) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCancelOtp(otp)
    setCancellingBooking(bookingToCancel)
    alert(`Cancellation OTP sent: ${otp}`)
    setShowCancelOtp(true)
  }

  const handleCancelConfirm = async () => {
    if (!cancellingBooking || !cancelOtp) return
    if (cancelOtp !== generatedCancelOtp) {
      alert('Invalid OTP! Please enter the correct OTP.')
      return
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/bookings/cancel-booking`,
        { bookingId: cancellingBooking._id },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.status === 200) {
        console.log('Released seats:', response.data.data.releasedSeats);

        alert('Booking cancelled successfully!');


        setShowCancelOtp(false);
        setCancelOtp('');
        setGeneratedCancelOtp('');
        setCancellingBooking(null);
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/v1/bookings/booking-history`,
            { withCredentials: true }
          );

          if (res.data.data) {
            const dataField = res.data.data;
            let currentBookingData = null;
            let previousBookingsData = [];

            if (dataField.currentBooking !== undefined) {
              currentBookingData = dataField.currentBooking;
              previousBookingsData = dataField.previousBookings || [];
            } else if (Array.isArray(dataField)) {
              currentBookingData = dataField.find(b => b.status === "SCHEDULED") || null;
              previousBookingsData = dataField.filter(b => b.status !== "SCHEDULED");
            }

            const transformedPreviousBookings = Array.isArray(previousBookingsData)
              ? previousBookingsData.map(booking => ({
                id: booking._id || booking.id,
                temple: booking.templeName || booking.temple || 'Unknown Temple',
                date: booking.visitDate || booking.date || '',
                slot: booking.visitSlot || booking.slot || '',
                status: booking.status || 'Completed',
                _id: booking._id,
                visitors: {
                  total: booking.devotes || booking.visitors?.total || 1,
                  elders: booking.elders || booking.visitors?.elders || 0,
                  differentlyAbled: booking.differentlyAbled || booking.visitors?.differentlyAbled || 0,
                }
              }))
              : [];

            updateBooking({
              currentBooking: currentBookingData,
              pastBookings: transformedPreviousBookings,
            });

            setCurrentBooking(currentBookingData);
            setPreviousBookings(transformedPreviousBookings);
          }
        } catch (fetchError) {
          alert("Booking cancelled but failed to refresh list. Please reload the page.");
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message || 'This booking is already cancelled or invalid');
      } else if (error.response?.status === 404) {
        alert('Booking not found. It may have already been cancelled.');
      } else if (error.response?.status === 403) {
        alert('You are not authorized to cancel this booking');
      } else {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
      setShowCancelOtp(false);
      setCancelOtp('');
      setGeneratedCancelOtp('');
      setCancellingBooking(null);
    }
  };


  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );

      alert('User logged out successfully!!')
      updateBooking({
        isAuthenticated: false,
        otpVerified: false,
        visitors: {
          name: '',
          phone: '',
          email: '',
          total: 1,
          elders: 0,
          differentlyAbled: 0,
          notes: '',
        },
      })
      setProfileOpen(false)

      navigate("/access");
    }
    catch (err) {
      console.log("Logout error:", err);
    }
  }

  useEffect(() => {

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/bookings/booking-history`, {
          withCredentials: true
        })

        let currentBookingData = null;
        let previousBookingsData = [];
        if (res.data.data) {
          const dataField = res.data.data;

          if (dataField.currentBooking !== undefined) {
            currentBookingData = dataField.currentBooking;
            previousBookingsData = dataField.previousBookings || [];
          } else if (Array.isArray(dataField)) {
            currentBookingData = dataField.find(b => b.status === "SCHEDULED") || null;
            previousBookingsData = dataField.filter(b => b.status !== "SCHEDULED");
          }


        }


        const transformedPreviousBookings = Array.isArray(previousBookingsData)
          ? previousBookingsData.map(booking => ({
            id: booking._id || booking.id,
            temple: booking.templeName || booking.temple || 'Unknown Temple',
            date: booking.visitDate || booking.date || '',
            slot: booking.visitSlot || booking.slot || '',
            status: booking.status || 'Completed',
            _id: booking._id,
            visitors: {
              total: booking.devotes || booking.visitors?.total || 1,
              elders: booking.elders || booking.visitors?.elders || 0,
              differentlyAbled: booking.differentlyAbled || booking.visitors?.differentlyAbled || 0,
            }
          }))
          : [];


        updateBooking({
          currentBooking: currentBookingData,
          pastBookings: transformedPreviousBookings,
        });



        setCurrentBooking(currentBookingData);
        setPreviousBookings(transformedPreviousBookings);

      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    }

    if (booking.isAuthenticated) {
      fetchBookings();
    }
    else {
      console.log("Booking not authenticated")
    }


  }, [booking.isAuthenticated]);



  const templesVisited = booking.pastBookings.length

  const activeHistory = selectedHistory ?? booking.pastBookings[0]

  return (
    <div className="min-h-screen bg-brand-smoke">
      {!isAdminPage &&
        <header className="border-b border-brand-dusk/5 bg-white">
          <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-saffron text-lg font-bold text-brand-saffron">
                DS
              </div>
              <div>
                <p className="font-display text-lg text-brand-dusk">
                  DarshanSetu
                </p>
                <p className="text-xs uppercase tracking-wide text-brand-slate/70">
                  Temple Crowd Command
                </p>
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-between md:flex">
              <nav className="flex items-center gap-8 text-sm font-semibold text-brand-slate">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.to
                  return (
                    <Link
                      key={item.labelKey}
                      to={item.to}
                      className={`hover:text-brand-saffron ${isActive ? 'text-brand-saffron' : ''
                        }`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  )
                })}
                {booking.temple && (
                  <>
                    <Link
                      to="/contact"
                      className={`hover:text-brand-saffron ${location.pathname === '/contact' ? 'text-brand-saffron' : ''
                        }`}
                    >
                      {t('nav.contact')}
                    </Link>
                    <Link
                      to="/temple-map"
                      className={`flex items-center gap-1 hover:text-brand-saffron ${location.pathname === '/temple-map' ? 'text-brand-saffron' : ''
                        }`}
                    >
                      {t('nav.map')}
                    </Link>
                    <Link
                      to="/donations"
                      className={`flex items-center gap-1 hover:text-brand-saffron ${location.pathname === '/donations' ? 'text-brand-saffron' : ''
                        }`}
                    >
                      {t('nav.donation')}
                    </Link>
                  </>
                )}
              </nav>
              <div className="relative">
                <button
                  onClick={() => setLanguageOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-brand-dusk/20 px-4 py-2 text-sm font-semibold text-brand-slate hover:border-brand-saffron hover:text-brand-saffron"
                >
                  {t('nav.language', 'Language')} · {languageNames[language]}
                  <span aria-hidden>▾</span>
                </button>
                {languageOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-brand-dusk/10 bg-white p-2 text-sm shadow-xl">
                    {languages.map((entry) => (
                      <button
                        key={entry.code}
                        onClick={() => {
                          setLanguage(entry.code)
                          setLanguageOpen(false)
                        }}
                        className={`w-full rounded-xl px-3 py-2 text-left ${language === entry.code
                            ? 'bg-brand-sand text-brand-dusk'
                            : 'text-brand-slate hover:bg-brand-smoke'
                          }`}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {booking.isAuthenticated && (
                <button
                  onClick={() => setBookingsOpen((prev) => !prev)}
                  className="rounded-full border border-brand-dusk/20 px-4 py-2 text-sm font-semibold text-brand-slate hover:border-brand-saffron hover:text-brand-saffron"
                >
                  {t('nav.myBookings', 'My bookings')}
                </button>
              )}
            </div>

            {booking.isAuthenticated && (
              <button
                onClick={() => setBookingsOpen((prev) => !prev)}
                className="rounded-full border border-brand-dusk/20 px-4 py-2 text-sm font-semibold text-brand-slate hover:border-brand-saffron hover:text-brand-saffron md:hidden"
              >
                {t('nav.myBookings', 'My bookings')}
              </button>
            )}
            <button
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="rounded-full border border-brand-dusk/20 px-4 py-2 text-sm font-semibold text-brand-slate hover:border-brand-saffron hover:text-brand-saffron md:hidden"
            >
              {t('nav.language', 'Language')} · {languageNames[language]}
            </button>

            {!booking.isAuthenticated ? (
              <Link
                to="/access"
                className="ml-auto rounded-full border border-brand-orange px-5 py-2 text-sm font-semibold text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                {t('nav.login', 'Login / Signup')}
              </Link>
            ) : (
              <div className="relative ml-auto">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white font-bold hover:bg-brand-orange-dark"
                  title="View Profile"
                >
                  {booking.visitors.name ? booking.visitors.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-2xl font-bold text-white">
                        {booking.visitors.name ? booking.visitors.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-black">{booking.visitors.name || 'User'}</h3>
                        <p className="text-sm text-gray-600">{booking.visitors.phone || 'No phone'}</p>
                      </div>
                    </div>

                    {booking.visitors.email && (
                      <div className="mb-4 rounded-xl bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500">Email</p>
                        <p className="text-sm text-gray-700">{booking.visitors.email}</p>
                      </div>
                    )}

                    <div className="mb-4 rounded-xl border-2 border-brand-orange/20 bg-brand-orange/5 p-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                        Temples Visited
                      </p>
                      <p className="mt-2 text-3xl font-bold text-brand-orange">{templesVisited}</p>
                      <p className="mt-1 text-xs text-gray-600">Through DarshanSetu</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-full border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {bookingsOpen && (
              <div className="absolute right-0 top-[72px] z-20 w-[420px] max-w-full rounded-3xl border border-brand-dusk/10 bg-white p-6 text-sm shadow-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-brand-slate/70">
                    {t('nav.currentBooking', 'Current booking')}
                  </p>
                  <button
                    className="text-xs text-brand-slate/60"
                    onClick={() => setBookingsOpen(false)}
                  >
                    {t('nav.close', 'Close')}
                  </button>
                </div>
                {booking.currentBooking ? (
                  <div className="mt-3">
                    <div className="rounded-xl bg-orange-50 p-4 shadow-sm">
                      <h3 className="font-bold text-lg">{booking.currentBooking.templeName}</h3>

                      <p>{booking.currentBooking.visitDate} • {booking.currentBooking.visitSlot}</p>

                      <p className="text-sm text-gray-600">
                        Parking: {booking.currentBooking.parking}
                      </p>

                      {!showCancelOtp ? (
                        <button
                          onClick={() => handleCancelRequest(booking.currentBooking)}
                          className="mt-3 rounded-full border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <div className="mt-3 space-y-2">
                          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-3 text-sm text-green-800">
                            Your OTP: <span className="font-bold text-lg">{generatedCancelOtp}</span>
                          </div>
                          <p className="text-xs font-semibold text-brand-dusk">Enter OTP to confirm cancellation:</p>
                          <input
                            type="text"
                            value={cancelOtp}
                            onChange={(e) => setCancelOtp(e.target.value)}
                            maxLength="6"
                            placeholder="123456"
                            className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-center text-lg tracking-widest focus:border-brand-orange focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleCancelConfirm}
                              className="flex-1 rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                            >
                              Confirm Cancel
                            </button>
                            <button
                              onClick={() => {
                                setShowCancelOtp(false)
                                setCancelOtp('')
                                setGeneratedCancelOtp('')
                                setCancellingBooking(null)
                              }}
                              className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl border border-dashed border-brand-dusk/15 p-4 text-brand-slate/60">
                    {t('nav.noActiveBooking')}
                  </p>
                )}
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide text-brand-slate/70">
                    {t('nav.previousSlots', 'Previous slots')}
                  </p>

                  <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                    {booking.pastBookings && booking.pastBookings.length > 0 ? (
                      booking.pastBookings.map((record) => (
                        <button
                          key={record.id || record._id}
                          onClick={() => setSelectedHistory(record)}
                          className={`w-full rounded-2xl border px-4 py-3 text-left ${activeHistory?.id === record.id
                              ? 'border-brand-saffron bg-brand-sand/60 text-brand-dusk'
                              : 'border-brand-dusk/10 text-brand-slate hover:bg-brand-smoke'
                            }`}
                        >
                          <p className="text-sm font-semibold">{record.temple}</p>
                          <p className="text-xs">{record.date}</p>
                          <p className="text-xs">{record.slot}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${record.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              record.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {record.status}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="rounded-2xl border border-dashed border-brand-dusk/15 p-4 text-center text-brand-slate/60">
                        {t('nav.noHistory', 'No previous bookings')}
                      </p>
                    )}
                  </div>



                  {activeHistory && (
                    <div className="mt-4 rounded-2xl bg-brand-smoke p-4 text-brand-slate">
                      <p className="text-sm font-semibold text-brand-dusk">
                        {activeHistory.temple}
                      </p>
                      <p className="text-xs text-brand-slate/70">
                        {activeHistory.city}
                      </p>
                      <p className="text-sm">
                        {t('nav.visit', 'Visit')}: {activeHistory.date} · {activeHistory.slot}
                      </p>
                      <p className="text-sm">
                        {t('nav.devotee', 'Devotee')}: {activeHistory?.visitors?.total ?? '—'}

                      </p>

                      <p className="text-sm">
                        {t('nav.groupSummary', 'Group')}: {activeHistory?.group ?? '—'} · Elders{' '}
                        {activeHistory?.visitors?.elders ?? '—'} · Differently abled{' '}
                        {activeHistory?.visitors?.differentlyAbled ?? '—'}
                      </p>

                      <p className="text-xs uppercase tracking-wide text-brand-slate/50">
                        {t('nav.status', 'Status')}: {activeHistory.status ?? 'Completed'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>}

      <main className="page-shell">{children}</main>


      {!isAdminPage &&
        <footer className="border-t border-brand-dusk/5 bg-white py-8 text-center text-sm text-brand-slate">
          Heritage & Culture Track · Pilgrim
          helpline 1800-108-1212
        </footer>}
    </div>
  )
}



export default AppLayout