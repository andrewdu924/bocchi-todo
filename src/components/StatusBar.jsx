export default function StatusBar({ total, pending, done }) {
  return (
    <footer className="status-bar" role="status" aria-live="polite" aria-label="任务统计">
      <div className="status-item">
        <span className="status-dot pink" aria-hidden="true" />
        <span>{total} 项任务</span>
      </div>
      <div className="status-item">
        <span className="status-dot gold" aria-hidden="true" />
        <span>{pending} 待完成</span>
      </div>
      <div className="status-item">
        <span className="status-dot blue" aria-hidden="true" />
        <span>{done} 已完成</span>
      </div>
    </footer>
  )
}
