import { useBooking } from '../context/BookingContext'
import { translate } from '../i18n/translate-function'

const useTranslation = () => {
  const { language } = useBooking()
  return (key, params) => {
    
    if (typeof params === 'string') {
      return translate(key, language) || params || key
    }
    
    return translate(key, language, params)
  }
}

export default useTranslation