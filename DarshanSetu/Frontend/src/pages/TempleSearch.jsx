import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import useTranslation from '../hooks/useTranslation'
import { temples, locationFilters } from '../data/sampleData'

const TempleSearch = () => {
  const navigate = useNavigate()
  const { updateBooking } = useBooking()
  const t = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')


  useEffect(() => { //on page reload reset selected temple
    updateBooking({ temple: null })
  }, [])

  const filteredTemples = useMemo(() => {
    let result = temples

    if (selectedState && locationFilters[selectedState]) {
      if (selectedDistrict && locationFilters[selectedState][selectedDistrict]) {
        result = locationFilters[selectedState][selectedDistrict]
      } else {
        result = Object.values(locationFilters[selectedState]).flat()
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (temple) =>
          temple.name.toLowerCase().includes(query) ||
          temple.city.toLowerCase().includes(query)
      )
    }

    return result
  }, [searchQuery, selectedState, selectedDistrict])

  //when user clicks a temple
  const handleSelectTemple = (temple) => {
    updateBooking({ temple, searchQuery })
    navigate('/booking')
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl">
        <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12 lg:gap-12">
          <div className="space-y-5">
            <h1 className="font-display text-3xl font-bold leading-tight text-black md:text-4xl lg:text-5xl">
              {t('home.hero.title')}
            </h1>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
                </div>
                <div>
                  <p className="font-semibold text-black">{t('home.feature.queueUpdates')}</p>
                  <p className="text-sm text-gray-600">{t('home.feature.queueUpdatesDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
                </div>
                <div>
                  <p className="font-semibold text-black">{t('home.feature.slotBooking')}</p>
                  <p className="text-sm text-gray-600">{t('home.feature.slotBookingDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
                </div>
                <div>
                  <p className="font-semibold text-black">{t('home.feature.parkingManagement')}</p>
                  <p className="text-sm text-gray-600"> {t('home.feature.parkingManagementDesc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="relative h-80 w-80 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]" viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="60" r="25" fill="#d84315" opacity="0.08" />
                <circle cx="250" cy="100" r="35" fill="#d84315" opacity="0.08" />
                <circle cx="40" cy="200" r="20" fill="#d84315" opacity="0.1" />
                <circle cx="260" cy="240" r="30" fill="#d84315" opacity="0.08" />
                <circle cx="150" cy="280" r="40" fill="#d84315" opacity="0.06" />
                <circle cx="220" cy="50" r="18" fill="#d84315" opacity="0.1" />
                <circle cx="80" cy="280" r="22" fill="#d84315" opacity="0.08" />
                

                <line x1="150" y1="30" x2="150" y2="95" stroke="#d84315" strokeWidth="3.5" />
                
                <path d="M150 35 L190 47 L150 59 Z" fill="#d84315" />
                
                <path d="M150 95 L115 130 L185 130 Z" stroke="#d84315" strokeWidth="3.5" fill="none" />
                <line x1="132" y1="112" x2="168" y2="112" stroke="#d84315" strokeWidth="2.5" />
                
                <path d="M90 130 L150 100 L210 130" stroke="#d84315" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                <rect x="95" y="130" width="110" height="110" stroke="#d84315" strokeWidth="5" fill="none" />

                <line x1="107" y1="136" x2="107" y2="234" stroke="#d84315" strokeWidth="3.5" />
                <line x1="130" y1="136" x2="130" y2="234" stroke="#d84315" strokeWidth="3.5" />
                <line x1="170" y1="136" x2="170" y2="234" stroke="#d84315" strokeWidth="3.5" />
                <line x1="193" y1="136" x2="193" y2="234" stroke="#d84315" strokeWidth="3.5" />
                
                <rect x="125" y="175" width="50" height="65" stroke="#d84315" strokeWidth="3.5" fill="none" />
                <line x1="150" y1="175" x2="150" y2="240" stroke="#d84315" strokeWidth="2.5" />
                
                <line x1="95" y1="162" x2="205" y2="162" stroke="#d84315" strokeWidth="2.5" />
                <line x1="95" y1="200" x2="205" y2="200" stroke="#d84315" strokeWidth="2.5" />
                
                <rect x="78" y="240" width="144" height="10" stroke="#d84315" strokeWidth="3.5" fill="none" />
                
                <line x1="83" y1="250" x2="217" y2="250" stroke="#d84315" strokeWidth="3.5" />
                <line x1="88" y1="258" x2="212" y2="258" stroke="#d84315" strokeWidth="3.5" />
                <line x1="93" y1="266" x2="207" y2="266" stroke="#d84315" strokeWidth="3.5" />
                
                <circle cx="118" cy="118" r="5" stroke="#d84315" strokeWidth="2.5" fill="none" />
                <circle cx="150" cy="112" r="6" stroke="#d84315" strokeWidth="2.5" fill="none" />
                <circle cx="182" cy="118" r="5" stroke="#d84315" strokeWidth="2.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg md:p-8">
        <div className="mb-5 text-center">
          <h2 className="font-display text-xl font-bold text-black md:text-2xl">{t('home.search.title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('home.search.subtitle')}</p>
        </div>
        
        <div className="space-y-4">
          <label className="flex flex-col text-sm font-semibold text-black">
            <div className="relative mt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.search.placeholder')}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-5 py-4 pl-12 text-base shadow-sm transition hover:border-brand-orange hover:shadow-md focus:border-brand-orange focus:outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            </div>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-semibold text-black">
              <span className="mb-2 flex items-center gap-2">
                {t('common.state')}
              </span>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value)
                  setSelectedDistrict('')
                }}
                className="cursor-pointer rounded-xl border-2 border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:border-brand-orange hover:shadow-md focus:border-brand-orange focus:outline-none"
              >
                <option value="">{t('common.allStates')}</option>
                {Object.keys(locationFilters).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm font-semibold text-black">
              <span className="mb-2 flex items-center gap-2">
                {t('common.district')}
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
                className="cursor-pointer rounded-xl border-2 border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:border-brand-orange hover:shadow-md focus:border-brand-orange focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:shadow-sm"
              >
                <option value="">{t('common.allDistricts')}</option>
                {selectedState &&
                  Object.keys(locationFilters[selectedState] || {}).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold text-black md:text-3xl">{t('home.popular.title')}</h2>
          <p className="mt-2 text-base text-gray-600">{t('home.popular.subtitle')}</p>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-brand-orange" />
        </div>

        {filteredTemples.length === 0 ? (
          <div className="rounded-3xl border border-brand-orange/20 bg-white p-12 text-center text-brand-dusk/60 shadow">
            {t('home.popular.empty')}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {filteredTemples.map((temple) => (
              <article
                key={temple.id}
                onClick={() => handleSelectTemple(temple)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-brand-orange/20 bg-white shadow-lg transition hover:-translate-y-2 hover:border-brand-orange hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="h-full bg-cover bg-center transition duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${temple.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl font-bold text-white drop-shadow-lg md:text-2xl">
                      {temple.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white">
                      {temple.city}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {temple.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          temple.crowdLevel === 'Very High'
                            ? 'bg-rose-100'
                            : temple.crowdLevel === 'High'
                              ? 'bg-orange-100'
                              : 'bg-green-100'
                        }`}
                      >
                        <span
                          className={`text-xl font-bold ${
                            temple.crowdLevel === 'Very High'
                              ? 'text-rose-600'
                              : temple.crowdLevel === 'High'
                                ? 'text-brand-orange'
                                : 'text-green-600'
                          }`}
                        >
                          {temple.crowdLevel === 'Very High' ? '🔴' : temple.crowdLevel === 'High' ? '🟠' : '🟢'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Crowd Status</p>
                        <p className="text-sm font-bold text-black">{temple.crowdLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default TempleSearch
