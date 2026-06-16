async function fetchHolidays() {
  const year = new Date().getFullYear()
  try {
    const response = await fetch(`https://timor.tech/api/holiday/year/${year}`)
    const data = await response.json()
    if (data.code === 0) {
      return Object.entries(data.holiday)
        .filter(([, info]) => info.holiday)
        .map(([dateStr, info]) => ({
          name: info.name,
          date: new Date(dateStr),
        }))
        .sort((a, b) => a.date - b.date)
    }
  } catch { /* API 请求失败 */ }
  return []
}

export function getNextHoliday() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  
  const getNextWeekend = () => {
    const daysUntilWeekend = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
    return { name: '周末', days: daysUntilWeekend === 0 ? 0 : daysUntilWeekend }
  }
  
  return getNextWeekend()
}

export async function getNextHolidayAsync() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  
  const getNextWeekend = () => {
    const daysUntilWeekend = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
    return { name: '周末', days: daysUntilWeekend === 0 ? 0 : daysUntilWeekend }
  }
  
  try {
    const holidays = await fetchHolidays()
    for (const holiday of holidays) {
      const diffTime = holiday.date - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 0 && diffDays <= 7) {
        return { name: holiday.name, days: diffDays }
      }
    }
  } catch { /* 获取节假日数据失败 */ }
  
  return getNextWeekend()
}
