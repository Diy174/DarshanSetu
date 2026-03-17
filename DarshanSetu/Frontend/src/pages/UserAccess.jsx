import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'
import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserAccess = () => {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const t = useTranslation()

  //page mode states
  const [showSignup, setShowSignup] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  //login states
  const [loginContact, setLoginContact] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  //signup states
  const [firstname, setfirstname] = useState('')
  const [lastname, setlastname] = useState('')
  const [phoneno, setphoneno] = useState('')
  const [password, setpassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showpassword, setShowpassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  //forgot password states
  const [resetContact, setResetContact] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [resetOtp, setResetOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  //common err msg
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg("");

    const loginData = {
      phoneno: loginContact.trim(),
      password: loginPassword
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`, loginData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res && (res.status === 200 || res.status === 201)) {
        console.log('Logged in successfully :', res.data);
      } else {
        console.warn('Login Api responded with unexpected error: ', res?.status, res?.data);
        alert('Something went wrong!!');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid login credentials";
      setErrorMsg(msg);
      return;
    }

    updateBooking({
      isAuthenticated: true,
      visitors: {
        ...booking.visitors,
        name: loginContact,
        contact: loginContact,
      },
    })
    const nextPath = booking.pendingPath || '/details'
    navigate(nextPath)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    const userInfo = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      phoneno: phoneno.trim(),
      password
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/users/register`, userInfo,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res && (res.status === 200 || res.status === 201)) {
        // console.log('Signup success');

        updateBooking({
          isAuthenticated: true,
          visitors: {
            ...booking.visitors,
            name: `${firstname} ${lastname}`,
            contact: phoneno,
          },
        })

        alert('Account created successfully!')
        const nextPath = booking.pendingPath || '/details'
        navigate(nextPath)
      } else {
        setErrorMsg('Something went wrong during registration')
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "User already exists!!";
      setErrorMsg(msg);
      return;
    }
  }

  const handleSendResetOtp = (e) => {
    e.preventDefault()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    alert(`Your OTP is: ${otp}`)
    setOtpSent(true)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (resetOtp !== generatedOtp) {
      alert('Invalid OTP! Please enter the correct OTP.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match!')
      return
    }

    const userInfo = {
      phoneno: resetContact.trim(),
      newPassword: newPassword
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/users/reset-password`, userInfo,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res && (res.status === 200 || res.status === 201)) {

        alert("Password reset is successful")
        setShowForgotPassword(false)
        setOtpSent(false)
        setResetContact('')
        setGeneratedOtp('')
        setResetOtp('')
        setNewPassword('')
        setConfirmNewPassword('')
      } else {
        console.warn('password changing is responded with unexpected status:', res?.status, res?.data);
      }
    } catch (err) {
      setErrorMsg("Error when resetting the password");
      return;
    }
  }

  const resetSignupForm = () => {
    setfirstname('')
    setlastname('')
    setphoneno('')
    setpassword('')
    setConfirmPassword('')
    setErrorMsg('')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange bg-brand-orange/5 px-3 py-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            {t('auth.heading')}
          </p>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-black md:text-3xl">
          {showForgotPassword ? 'Reset Password' : showSignup ? 'Create Account' : t('auth.title')}
        </h2>
        <p className="mt-2 text-gray-600">
          {showForgotPassword
            ? 'Enter your contact number to get OTP for password reset'
            : showSignup
              ? 'Sign up to continue with your booking'
              : t('auth.subtitle')}
        </p>
      </section>

      <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        {showForgotPassword ? (
          <div className="space-y-6">
            {!otpSent ? (
              <form onSubmit={handleSendResetOtp} className="space-y-4">
                <label className="flex flex-col text-sm font-medium text-black">
                  Contact Number *
                  <input
                    type="tel"
                    value={resetContact}
                    onChange={(e) => setResetContact(e.target.value)}
                    required
                    placeholder="Enter your contact number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-orange-dark"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  Your OTP: <span className="font-bold text-lg">{generatedOtp}</span>
                </div>
                <label className="flex flex-col text-sm font-medium text-black">
                  Enter OTP *
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    required
                    maxLength="6"
                    placeholder="123456"
                    className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-center text-xl tracking-widest transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-black">
                  New Password *
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength="6"
                      className="mt-2 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 pr-12 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange"
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </label>
                <label className="flex flex-col text-sm font-medium text-black">
                  Confirm New Password *
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      minLength="6"
                      className={`mt-2 w-full rounded-xl border-2 bg-white px-4 py-3 pr-12 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none ${confirmNewPassword && newPassword !== confirmNewPassword
                          ? 'border-red-500'
                          : confirmNewPassword && newPassword === confirmNewPassword
                            ? 'border-green-500'
                            : 'border-gray-300'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange"
                    >
                      {showConfirmNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <span className="mt-1 text-xs text-red-500">Passwords do not match</span>
                  )}
                  {confirmNewPassword && newPassword === confirmNewPassword && (
                    <span className="mt-1 text-xs text-green-500">Passwords match</span>
                  )}
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-orange-dark"
                >
                  Reset Password
                </button>
              </form>
            )}

            <div className="border-t border-gray-200 pt-4 text-center">
              <button
                onClick={() => {
                  setShowForgotPassword(false)
                  setOtpSent(false)
                  setResetContact('')
                  setGeneratedOtp('')
                  setResetOtp('')
                  setNewPassword('')
                  setConfirmNewPassword('')
                }}
                className="text-sm font-semibold text-brand-orange hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : !showSignup ? (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black">Login to Your Account</h3>
              <p className="mt-1 text-sm text-gray-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="flex flex-col text-sm font-medium text-black">
                Contact Number *
                <input
                  type="tel"
                  value={loginContact}
                  onChange={(e) => setLoginContact(e.target.value)}
                  required
                  placeholder="Enter your contact number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-black">
                Password *
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    minLength="6"
                    className="mt-2 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 pr-12 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange"
                  >
                    {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </label>
              {errorMsg && (
                <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-orange-dark"
              >
                Login
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-semibold text-brand-orange hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/admin-login')}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Login as Admin
              </button>
            </div>
            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account already?{' '}
                <button
                  onClick={() => setShowSignup(true)}
                  className="font-semibold text-brand-orange hover:underline"
                >
                  Sign up first
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black">Create New Account</h3>
              <p className="mt-1 text-sm text-gray-600">Sign up to continue with your booking</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-black">
                  First Name *
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setfirstname(e.target.value)}
                    required
                    placeholder="John"
                    className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-black">
                  Last Name *
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setlastname(e.target.value)}
                    required
                    placeholder="Doe"
                    className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm font-medium text-black">
                Contact Number *
                <input
                  type="tel"
                  value={phoneno}
                  onChange={(e) => setphoneno(e.target.value)}
                  required
                  placeholder="Enter your contact number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="mt-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-black">
                Password *
                <div className="relative">
                  <input
                    type={showpassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Minimum 6 characters"
                    className="mt-2 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 pr-12 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowpassword(!showpassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange"
                  >
                    {showpassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </label>

              <label className="flex flex-col text-sm font-medium text-black">
                Confirm Password *
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Re-enter password"
                    className={`mt-2 w-full rounded-xl border-2 bg-white px-4 py-3 pr-12 transition hover:border-brand-orange focus:border-brand-orange focus:outline-none ${confirmPassword && password !== confirmPassword
                        ? 'border-red-500'
                        : confirmPassword && password === confirmPassword
                          ? 'border-green-500'
                          : 'border-gray-300'
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-orange"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span className="mt-1 text-xs text-red-500">Passwords do not match</span>
                )}
                {confirmPassword && password === confirmPassword && (
                  <span className="mt-1 text-xs text-green-500">Passwords match ✓</span>
                )}
              </label>

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-orange-dark"
              >
                Create Account
              </button>
            </form>

            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignup(false)
                    resetSignupForm()
                  }}
                  className="font-semibold text-brand-orange hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAccess