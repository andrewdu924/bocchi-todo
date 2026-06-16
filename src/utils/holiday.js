import festival from 'festival_chn'

function getTodayInt() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return parseInt(`${y}${m}${d}`)
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
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const startDate = parseInt(`${year}${String(month).padStart(2, '0')}01`)
    const endDate = parseInt(`${year}${String(month).padStart(2, '0')}31`)
    
    const holidays = festival.getDaysInRange(startDate, endDate)
    const todayInt = getTodayInt()
    
    for (const holiday of holidays) {
      if (holiday.isHoliday && holiday.date > todayInt) {
        const diffDays = Math.round((holiday.date - todayInt) / 10000) * 365 + 
                         ((holiday.date % 10000) - (todayInt % 10000)) / 100 * 30
        if (diffDays <= 7) {
          return { name: holiday.name || '节假日', days: Math.ceil(diffDays) }
        }
      }
    }
  } catch { /* 查询失败 */ }
  
  return { name: '周末', days: 6 - dayOfWeek }
}
