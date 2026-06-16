import { useState, useEffect } from 'react'
import { getNextHolidayAsync } from '../utils/holiday'

export default function Header({ dailyTheme }) {
  const [nextHoliday, setNextHoliday] = useState(null)
  const now = new Date()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const dateStr = `${now.getMonth() + 1}/${now.getDate()} 周${weekdays[now.getDay()]}`

  useEffect(() => {
    getNextHolidayAsync().then(setNextHoliday)
  }, [])

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title"><span style={{ color: dailyTheme.color }}>ボッチ</span>Todo</h1>
        <div className="date-row">
          <span className="date-badge">{dateStr}</span>
          {nextHoliday && (
            <span className="holiday-countdown">
              距{nextHoliday.name}还有{nextHoliday.days}天
            </span>
          )}
        </div>
      </div>
      {dailyTheme.avatar && (
        <div className="character-avatar">
          <img 
            src={dailyTheme.avatar} 
            alt={dailyTheme.name} 
            className="character-img"
          />
        </div>
      )}
    </header>
  )
}
