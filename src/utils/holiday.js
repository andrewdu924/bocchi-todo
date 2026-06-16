async function fetchHolidays() {
  const year = new Date().getFullYear()
  try {
    const response = await fetch(`https://timor.tech/api/holiday/year/${year}`)
    const data = await response.json()
    if (data.code === 0) {
      return Object.entries(data.holiday)
        .filter(([, info]) => info.holiday)
        .map(([dateStr, info]) => {
          const [y, m, d] = dateStr.split('-').map(Number)
          return {
            name: info.name,
            date: new Date(y, m - 1, d),
          }
        })
        .sort((a, b) => a.date - b.date)
    }
  } catch { /* API 请求失败 */ }
  return []
}

function getDaysUntil(date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

export function getNextHoliday() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { name: '周末', days: 0 }
  }
  return { name: '周末', days: 6 - dayOfWeek }
}

export async function getNextHolidayAsync() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { name: '周末', days: 0 }
  }
  
  try {
    const holidays = await fetchHolidays()
    for (const holiday of holidays) {
      const diffDays = getDaysUntil(holiday.date)
      if (diffDays >= 0 && diffDays <= 7) {
        return { name: holiday.name, days: diffDays }
      }
    }
  } catch { /* 获取节假日数据失败 */ }
  
  return { name: '周末', days: 6 - dayOfWeek }
}
