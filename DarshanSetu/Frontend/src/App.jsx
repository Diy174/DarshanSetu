import axios from "axios"; //js lib used to make HTTP req from frontend and backend
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import AppLayout from './components/AppLayout'
import TempleSearch from './pages/TempleSearch'
import BookingOptions from './pages/BookingOptions'
import SlotAvailability from './pages/SlotAvailability'
import ParkingAvailability from './pages/ParkingAvailability'
import ParkingSlotSelection from './pages/ParkingSlotSelection'
import VisitorDetails from './pages/VisitorDetails'
import UserAccess from './pages/UserAccess'
import Confirmation from './pages/Confirmation'
import TempleMap from './pages/TempleMap'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ContactUs from './pages/ContactUs'
import Donations from './pages/Donations'
import About from './pages/About'


function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<TempleSearch />} />
            <Route path="/booking" element={<BookingOptions />} />
            <Route path="/slots" element={<SlotAvailability />} />
            <Route path="/parking" element={<ParkingAvailability />} />
            <Route path="/parking-slots" element={<ParkingSlotSelection />} />
            <Route path="/details" element={<VisitorDetails />} />
            <Route path="/access" element={<UserAccess />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/temple-map" element={<TempleMap />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App
