const TABS = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'done', label: '已完成' },
]

export default function FilterTabs({ active, counts, onChange }) {
  return (
    <nav className="filters" aria-label="任务筛选">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`filter-tab${active === tab.key ? ' active' : ''}`}
          aria-pressed={active === tab.key}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          <span className="filter-count">{counts[tab.key]}</span>
        </button>
      ))}
    </nav>
  )
}
