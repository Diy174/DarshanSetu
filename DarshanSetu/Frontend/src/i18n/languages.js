export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી'},
]

export const languageNames = languages.reduce((acc, entry) => {
  acc[entry.code] = entry.label
  return acc
}, {})