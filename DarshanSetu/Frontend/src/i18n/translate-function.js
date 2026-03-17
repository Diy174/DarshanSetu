
import { translations } from './translations'

export const translate = (key, language = 'en', params = {}) => {
  
  const text = translations[language]?.[key] || translations.en?.[key] || key
  
  if (params && typeof text === 'string') {
    let result = text
    Object.keys(params).forEach(paramKey => {
      result = result.split('{' + paramKey + '}').join(params[paramKey])
    })
    return result
  }
  
  return text
}