import { useState, useRef } from 'react'

const PRIORITY_CYCLE = ['low', 'medium', 'high']
const PRIORITY_LABELS = { low: '普通', medium: '中等', high: '紧急' }

export default function TodoInput({ onAdd }) {
  const [priority, setPriority] = useState('low')
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const cyclePriority = () => {
    const idx = PRIORITY_CYCLE.indexOf(priority)
    setPriority(PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length])
  }

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, priority)
    setText('')
    setPriority('low')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <section className="input-section">
      <div className="input-row">
        <div className="input-shell">
          <span className="input-prompt" aria-hidden="true">♫</span>
          <label htmlFor="todo-input" className="sr-only">新增任务</label>
          <input
            ref={inputRef}
            type="text"
            id="todo-input"
            placeholder="今天要练什么曲子..."
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          className="priority-btn"
          data-level={priority}
          title="切换优先级"
          aria-label={`优先级: ${PRIORITY_LABELS[priority]}`}
          onClick={cyclePriority}
        >
          !
        </button>
        <button
          className="add-btn"
          title="添加任务"
          aria-label="添加任务"
          onClick={handleAdd}
        >
          +
        </button>
      </div>
    </section>
  )
}
