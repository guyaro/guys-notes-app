export const OWNER_EMAIL = "guy.aro.2001@gmail.com"

export const NOTE_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "tutorial", label: "Tutorial" },
]

export const SEMESTERS = [
  "2025A", "2025B", "2025C",
  "2026A", "2026B", "2026C",
  "2027A", "2027B", "2027C",
  "2028A", "2028B", "2028C",
  "2029A", "2029B", "2029C",
]

// Current semester: A = Oct-Feb, B = Mar-Jun, C = Jul-Sep
export function getCurrentSemester() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  let term
  if (month >= 10 || month <= 2) term = "A"
  else if (month <= 6) term = "B"
  else term = "C"
  const semYear = month >= 10 ? year + 1 : year
  return `${semYear}${term}`
}
