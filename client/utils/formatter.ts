const monthName = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const formattedDate = (date: string) => {
  const toLocaleDateStr = new Date(parseInt(date)).toLocaleDateString()

  const [m, d, y] = toLocaleDateStr.split('/')

  return `${d} ${monthName[parseInt(m) - 1]} ${y}`
}