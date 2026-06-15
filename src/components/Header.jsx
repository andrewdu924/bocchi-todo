export default function Header({ dailyTheme }) {
  const now = new Date()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const dateStr = `${now.getMonth() + 1}/${now.getDate()} 周${weekdays[now.getDay()]}`

  return (
    <header className="header">
      <div className="title-row">
        <h1 className="app-title"><span style={{ color: dailyTheme.color }}>ぼっち</span>Todo</h1>
        <span className="subtitle">今日担当：{dailyTheme.name}</span>
      </div>
      <span className="date-badge">{dateStr}</span>
    </header>
  )
}
