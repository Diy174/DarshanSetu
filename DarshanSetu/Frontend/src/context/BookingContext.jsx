import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'

const BookingContext = createContext(null)

const navratriDates = {
  2025: { sharad: "2025-09-22", chaitra: "2025-03-30" },
  2026: { sharad: "2026-09-12", chaitra: "2026-03-20" },
  2027: { sharad: "2027-10-02", chaitra: "2027-04-08" },
  2028: { sharad: "2028-09-21", chaitra: "2028-03-28" },
  2029: { sharad: "2029-09-10", chaitra: "2029-03-17" },
  2030: { sharad: "2030-09-30", chaitra: "2030-04-06" }
}

const navratriDays = [
  { day: 1, goddess: "Shailputri", color: "White" },
  { day: 2, goddess: "Brahmacharini", color: "Red" },
  { day: 3, goddess: "Chandraghanta", color: "Royal Blue" },
  { day: 4, goddess: "Kushmanda", color: "Yellow" },
  { day: 5, goddess: "Skandamata", color: "Green" },
  { day: 6, goddess: "Katyayani", color: "Grey" },
  { day: 7, goddess: "Kalaratri", color: "Orange" },
  { day: 8, goddess: "Mahagauri", color: "Peacock Green" },
  { day: 9, goddess: "Siddhidatri", color: "Pink" }
]

const allowedFestivals = [
  "Diwali",
  "Holi",
  "Janmashtami",
  "Makar Sankranti",
  "MahaShivratri",
  "Navratri"
]

const publicHolidays = [
  "Independence Day",
  "Gandhi Jayanti",
  "Republic Day"
]

function isNavratri(inputDate, year) {
  const dateObj = new Date(inputDate)
  const navratri = navratriDates[year]
  
  if (!navratri) return null
  
  const sharadStart = new Date(navratri.sharad)
  const sharadEnd = new Date(sharadStart)
  sharadEnd.setDate(sharadEnd.getDate() + 8) 
  
  if (dateObj >= sharadStart && dateObj <= sharadEnd) {
    const dayNumber = Math.floor((dateObj - sharadStart) / (1000 * 60 * 60 * 24)) + 1
    return { type: "Sharad Navratri", day: dayNumber, ...navratriDays[dayNumber - 1] }
  }
  
  const chaitraStart = new Date(navratri.chaitra)
  const chaitraEnd = new Date(chaitraStart)
  chaitraEnd.setDate(chaitraEnd.getDate() + 8)
  
  if (dateObj >= chaitraStart && dateObj <= chaitraEnd) {
    const dayNumber = Math.floor((dateObj - chaitraStart) / (1000 * 60 * 60 * 24)) + 1
    return { type: "Chaitra Navratri", day: dayNumber, ...navratriDays[dayNumber - 1] }
  }
  
  return null
}

function matchFestival(fetchedFestival) {
  if (!fetchedFestival) return "None"
  
  const lowerFetched = fetchedFestival.toLowerCase()
  
  for (const allowed of allowedFestivals) {
    if (lowerFetched.includes(allowed.toLowerCase())) {
      return allowed
    }
  }
  
  return "None"
}

function matchPublicHoliday(fetchedEvent) {
  if (!fetchedEvent) return false
  
  const lowerFetched = fetchedEvent.toLowerCase()
  
  for (const holiday of publicHolidays) {
    if (lowerFetched.includes(holiday.toLowerCase())) {
      return true
    }
  }
  
  return false
}

//Default booking data 
const buildInitialBooking = () => ({
  temple: null,
  searchQuery: '',
  visitDate: '',
  visitSlot: '',
  phone: '',
  email: '',
  total: 1,
  elders: 0,
  differentlyAbled: 0,
  notes: '',
  isReturningVisitor: false,
  otpVerified: false,
  isAuthenticated: false,
  pendingPath: '',
  currentBooking: null,
  pastBookings: [],
  
  temperature: null,
  precipitation: null,
  festival: "None",
  publicHoliday: 0,
})

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(buildInitialBooking) 
  const [language, setLanguage] = useState('en')

  const updateBooking = useCallback((partial) => {
    setBooking((prev) => ({
      ...prev,
      ...partial,
      visitors: {
      },
    }))
  }, [])

  const resetBooking = useCallback(() => setBooking(buildInitialBooking()), []) //resets to default

  const fetchWeatherData = useCallback(async (visitDate) => {
    const apiKey = "26aa731c60074a5889e91319262502"
    const lat = 21.233 //GPS coordinates of gujrat
    const lon = 72.867

    try {
      const inputDate = new Date(visitDate)
      const today = new Date()
      
      const diffTime = inputDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let endpoint
      if (diffDays <= 14 && diffDays >= 0) {
        endpoint = "forecast.json"
        console.log(`Using forecast API (${diffDays} days ahead)`)
      } else {
        endpoint = "future.json"
        console.log(`Using future API (${diffDays} days ahead)`)
      }
      
      const url = `http://api.weatherapi.com/v1/${endpoint}?key=${apiKey}&q=${lat},${lon}&dt=${visitDate}&aqi=no`
      
      const res = await fetch(url)
      if (!res.ok) {
        const txt = await res.text()
        // console.error("Weather API error")
        return { temperature: null, precipitation: null }
      }
      const data = await res.json()
      
      const fd0 = data?.forecast?.forecastday?.[0]
      if (!fd0) {
        console.error("No forecastday[0] in response:", JSON.stringify(data, null, 2))
        return { temperature: null, precipitation: null }
      }
  
      const temp = fd0.day?.avgtemp_c
      const precipitation = fd0.day?.totalprecip_mm
      return { temperature: temp, precipitation }
      
    } catch (err) {
      console.error("Weather get error")
      return { temperature: null, precipitation: null }
    }
  }, [])

  const fetchFestivalData = useCallback(async (visitDate) => {
    try {
      const [year, month, day] = visitDate.split('-')
      const dateObj = new Date(visitDate)
      
      const navratriInfo = isNavratri(visitDate, year)
      
      if (navratriInfo) {
        return { festival: "Navratri",navratriInfo, publicHoliday: 0 }
      }
      
      
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      
      const monthName = monthNames[parseInt(month) - 1]
      const dayName = dayNames[dateObj.getDay()]
      
      const url = `https://diy174.github.io/indian-calander-data/calendar/calendar/${year}.json`
      
      const res = await fetch(url)
      if (!res.ok) {
        return { festival: "None", publicHoliday: 0 }
      }
      
      const data = await res.json()
      
      const monthKey = `${monthName} ${year}`
      const dateKey = `${monthName} ${parseInt(day)}, ${year}, ${dayName}`
      
      if (!data[year] || !data[year][monthKey] || !data[year][monthKey][dateKey]) {
        return { festival: "None", publicHoliday: 0 }
      }
      
      const eventData = data[year][monthKey][dateKey]
      const fetchedEvent = eventData.event
      
      const isPublicHoliday = matchPublicHoliday(fetchedEvent)
      
      if (isPublicHoliday) {
        return { festival: "None", publicHoliday: 1 }
      }
      
      const festival = matchFestival(fetchedEvent)
      
      //return { festival, publicHoliday: 0 }
      return { festival, navratriInfo: null, publicHoliday: 0 }

      
    } catch (err) {
      return { festival: "None", publicHoliday: 0 }
    }
  }, [])

  useEffect(() => {
  if (!booking.visitDate) return

  const fetchAllData = async () => {
    const [weatherData, festivalData] = await Promise.all([
      fetchWeatherData(booking.visitDate),
      fetchFestivalData(booking.visitDate),
    ])

    setBooking(prev => ({
      ...prev,
      temperature: weatherData.temperature,
      precipitation: weatherData.precipitation,
      festival: festivalData.festival,
      navratriInfo: festivalData.navratriInfo,
      publicHoliday: festivalData.publicHoliday,
    }))
  }

  fetchAllData()
}, [booking.visitDate, fetchWeatherData, fetchFestivalData])


  const value = useMemo(
    () => ({
      booking,
      updateBooking,
      resetBooking,
      language,
      setLanguage,
    }),
    [booking, updateBooking, resetBooking, language],
  )

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}

export const useBooking = () => {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used inside BookingProvider')
  }
  return ctx
}