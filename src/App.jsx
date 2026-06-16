import { useState, useEffect, useCallback, useMemo } from 'react'
import Header from './components/Header'
import BandStripe from './components/BandStripe'
import TodoInput from './components/TodoInput'
import FilterTabs from './components/FilterTabs'
import EmptyState from './components/EmptyState'
import StatusBar from './components/StatusBar'

const STORE_KEY = 'bocchitodo:items'
const DB_NAME = 'bocchi-todo-db'
const DB_VERSION = 1
const DB_STORE_NAME = 'todos'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function saveToIndexedDB(todos) {
  const db = await openDB()
  const tx = db.transaction(DB_STORE_NAME, 'readwrite')
  const store = tx.objectStore(DB_STORE_NAME)
  await store.clear()
  todos.forEach(todo => store.put(todo))
  await tx.complete
  db.close()
}

async function loadFromIndexedDB() {
  const db = await openDB()
  const tx = db.transaction(DB_STORE_NAME, 'readonly')
  const store = tx.objectStore(DB_STORE_NAME)
  const request = store.getAll()
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => resolve([])
  })
}

const DAILY_THEMES = [
  { 
    name: '波奇', color: '#de7b8e', dim: 'rgba(222,123,142,0.10)',
    images: Array.from({length: 10}, (_, i) => `/bocchi-todo/images/bocchi-${i+1}.png`)
  },  // 周日/周三 - 粉
  { 
    name: '虹夏', color: '#d4a03c', dim: 'rgba(212,160,60,0.10)',
    images: Array.from({length: 10}, (_, i) => `/bocchi-todo/images/nijika-${i+1}.png`)
  },   // 周一/周四 - 金
  { 
    name: '凉',   color: '#6889a8', dim: 'rgba(104,137,168,0.10)',
    images: Array.from({length: 10}, (_, i) => `/bocchi-todo/images/ryou-${i+1}.png`)
  },  // 周二/周五 - 蓝
  { 
    name: '喜多', color: '#c9505e', dim: 'rgba(201,80,94,0.10)',
    images: Array.from({length: 10}, (_, i) => `/bocchi-todo/images/kita-${i+1}.png`)
  },  // 周六 - 红
]

function getDailyTheme() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - start) / 86400000)
  
  const theme = DAILY_THEMES[dayOfYear % DAILY_THEMES.length]
  
  const avatars = DAILY_THEMES.map((char, i) => {
    const imgIndex = (dayOfYear + i) % char.images.length
    return { name: char.name, color: char.color, src: char.images[imgIndex] }
  })
  
  return { ...theme, avatars }
}

const DAILY_QUOTES = [
  // 波奇
  { text: '要是能像空气吉他一样，什么都不做就能弹就好了...', who: '波奇' },
  { text: '反正我这种人，就算消失也不会有人在意的...', who: '波奇' },
  { text: '今天也是社恐的一天呢。', who: '波奇' },
  { text: '想要被人需要，想要被人认可。', who: '波奇' },
  { text: '吉他英雄什么的，才不是我的目标呢...才怪。', who: '波奇' },
  { text: '就算只有一个人也好，想组乐队。', who: '波奇' },
  { text: '吉他弦断了也要继续弹！', who: '波奇' },
  { text: '社恐不是病，是超能力。', who: '波奇' },
  { text: '明天也要努力练习吉他！...大概。', who: '波奇' },
  { text: '第一次收到LINE消息居然不是广告！', who: '波奇' },
  { text: '我这种人，站在舞台上真是太奇怪了...', who: '波奇' },
  { text: '吉他袋是我的安全区。', who: '波奇' },
  { text: '如果能一直躲在壁橱里就好了...', who: '波奇' },
  { text: '网络上的我和现实中的我是两个人。', who: '波奇' },
  { text: '吉他英雄之路，从孤独开始！', who: '波奇' },
  { text: '今天的练习...还是算了吧。', who: '波奇' },
  { text: '如果世界末日就好了，就不用上台了...', who: '波奇' },
  { text: '我只想在房间里弹吉他...', who: '波奇' },
  { text: '被夸奖了...好尴尬...', who: '波奇' },
  { text: '乐队练习？我肚子疼...', who: '波奇' },
  
  // 虹夏
  { text: '就算逃到天涯海角，乐队的问题还是会追上来的。', who: '虹夏' },
  { text: '乐队就是要大家一起才有趣啊！', who: '虹夏' },
  { text: '只要站在舞台上，大家就都是主角。', who: '虹夏' },
  { text: '闪闪发光的青春，大概就是这样的吧。', who: '虹夏' },
  { text: '大家在一起，就是最棒的乐队。', who: '虹夏' },
  { text: '下课铃响了就是乐队时间！', who: '虹夏' },
  { text: '青春就是不断试错的过程。', who: '虹夏' },
  { text: '今天也要元满满地练习！', who: '虹夏' },
  { text: '乐队的羁绊是最珍贵的！', who: '虹夏' },
  { text: 'Live House才是我们的战场！', who: '虹夏' },
  { text: '鼓点就是心跳的节奏！', who: '虹夏' },
  { text: '让我们一起创造美好的回忆吧！', who: '虹夏' },
  { text: '乐队活动是最棒的青春！', who: '虹夏' },
  { text: '今天的练习也要加油哦！', who: '虹夏' },
  { text: '舞台上的大家都是最闪耀的！', who: '虹夏' },
  { text: '音乐让我们连接在一起！', who: '虹夏' },
  { text: '乐队就是我的家！', who: '虹夏' },
  { text: '每一次Live都是奇迹！', who: '虹夏' },
  { text: '让我们一起创造传说吧！', who: '虹夏' },
  { text: '鼓手是乐队的心脏！', who: '虹夏' },
  
  // 凉
  { text: '音乐是不需要语言的。', who: '凉' },
  { text: '贝斯才是乐队的灵魂。', who: '凉' },
  { text: '音乐不会背叛你。', who: '凉' },
  { text: '下町的空气里，都带着摇滚的味道。', who: '凉' },
  { text: '贝斯线才是让身体动起来的关键。', who: '凉' },
  { text: '衣服是用来穿的，不是用来品味的。', who: '凉' },
  { text: '贝斯手的孤独，你们不懂。', who: '凉' },
  { text: '低音才是音乐的根基。', who: '凉' },
  { text: '沉默是最有力的表达。', who: '凉' },
  { text: '贝斯手是乐队的幕后英雄。', who: '凉' },
  { text: '音乐是超越语言的对话。', who: '凉' },
  { text: '低音炮才是王道。', who: '凉' },
  { text: '贝斯手不需要聚光灯。', who: '凉' },
  { text: '音乐是灵魂的出口。', who: '凉' },
  { text: '沉默中蕴含着力量。', who: '凉' },
  { text: '贝斯手是乐队的定海神针。', who: '凉' },
  { text: '音乐是永恒的陪伴。', who: '凉' },
  { text: '低音是音乐的灵魂。', who: '凉' },
  { text: '贝斯手是乐队的基石。', who: '凉' },
  { text: '音乐是生命的律动。', who: '凉' },
  
  // 喜多
  { text: '结束乐队，是我们的全部。', who: '喜多' },
  { text: '第一次Live居然成功了！', who: '喜多' },
  { text: '今天的练习，是为了明天的Live！', who: '喜多' },
  { text: 'Live House的灯光，是最美的风景。', who: '喜多' },
  { text: 'STAR☆的光芒，照亮每一个角落！', who: '喜多' },
  { text: '后藤同学的吉他，真的很厉害哦。', who: '喜多' },
  { text: '吉他手是最帅的！', who: '喜多' },
  { text: '让我们一起创造最棒的Live！', who: '喜多' },
  { text: '音乐是连接心灵的桥梁！', who: '喜多' },
  { text: '舞台上的每一刻都是奇迹！', who: '喜多' },
  { text: '乐队活动是最开心的事！', who: '喜多' },
  { text: '让我们一起闪耀吧！', who: '喜多' },
  { text: '音乐是世界上最棒的东西！', who: '喜多' },
  { text: 'Live就是青春的证明！', who: '喜多' },
  { text: '乐队就是我的一切！', who: '喜多' },
  { text: '让我们一起创造回忆吧！', who: '喜多' },
  { text: '音乐是永恒的青春！', who: '喜多' },
  { text: '舞台是最棒的地方！', who: '喜多' },
  { text: '乐队是青春的象征！', who: '喜多' },
  { text: '让我们一起追逐梦想吧！', who: '喜多' },
]

function getRandomQuote() {
  const index = Math.floor(Math.random() * DAILY_QUOTES.length)
  return DAILY_QUOTES[index]
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY))
    if (Array.isArray(saved) && saved.length > 0) {
      return saved
    }
  } catch { /* localStorage 不可用 */ }
  return []
}

async function loadTodosWithRecovery() {
  const fromLocal = loadTodos()
  if (fromLocal.length > 0) {
    return fromLocal
  }
  try {
    const recovered = await loadFromIndexedDB()
    if (Array.isArray(recovered) && recovered.length > 0) {
      localStorage.setItem(STORE_KEY, JSON.stringify(recovered))
      return recovered
    }
  } catch { /* IndexedDB 不可用 */ }
  return []
}

async function saveTodos(todos) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(todos))
  } catch { /* localStorage 不可用 */ }
  try {
    await saveToIndexedDB(todos)
  } catch { /* IndexedDB 不可用 */ }
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [removingIds, setRemovingIds] = useState(new Set())
  const [dailyQuote, setDailyQuote] = useState(getRandomQuote())
  const dailyTheme = useMemo(() => getDailyTheme(), [])

  useEffect(() => {
    loadTodosWithRecovery().then(setTodos)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', dailyTheme.color)
    root.style.setProperty('--accent-dim', dailyTheme.dim)
  }, [dailyTheme])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  useEffect(() => {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const msUntilMidnight = tomorrow - now
    const timer = setTimeout(() => window.location.reload(), msUntilMidnight)
    return () => clearTimeout(timer)
  }, [])

  const addTodo = useCallback((text, priority) => {
    setTodos((prev) => [
      { id: genId(), text, done: false, priority, ts: Date.now() },
      ...prev,
    ])
    setDailyQuote(getRandomQuote())
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }, [])

  const removeTodo = useCallback((id) => {
    setRemovingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id))
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 200)
  }, [])

  const totalCount = todos.length
  const doneCount = todos.filter((t) => t.done).length
  const activeCount = totalCount - doneCount

  const counts = {
    all: totalCount,
    active: activeCount,
    done: doneCount,
  }

  const filtered = todos
    .filter((t) => {
      if (filter === 'active') return !t.done
      if (filter === 'done') return t.done
      return true
    })
    .sort((a, b) => a.done - b.done)

  return (
    <>
      <div className="app">
        <Header dailyTheme={dailyTheme} />
        <BandStripe />
        <TodoInput onAdd={addTodo} />
        <FilterTabs active={filter} counts={counts} onChange={setFilter} />

        {filtered.length > 0 ? (
          <ul className="todo-list" aria-label="待办任务列表">
            {filtered.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item${todo.done ? ' done' : ''}${removingIds.has(todo.id) ? ' removing' : ''}`}
              >
                <button
                  className="todo-check"
                  aria-label={todo.done ? '取消完成' : '标记完成'}
                  onClick={() => toggleTodo(todo.id)}
                >
                  <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M2.5 6L5 8.5 9.5 3.5" />
                  </svg>
                </button>
                <span className="todo-text">{todo.text}</span>
                <span className={`todo-priority ${todo.priority}`}>
                  {todo.priority === 'high' ? '紧急' : todo.priority === 'medium' ? '中等' : '普通'}
                </span>
                <button
                  className="todo-delete"
                  aria-label="删除任务"
                  onClick={() => removeTodo(todo.id)}
                >
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 3l8 8M11 3l-8 8" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState filter={filter} totalCount={totalCount} />
        )}

        <div className="daily-quote">
          <p className="daily-quote-text">「{dailyQuote.text}」</p>
          <span className="daily-quote-who">—— {dailyQuote.who}</span>
        </div>
      </div>
      <StatusBar total={totalCount} pending={activeCount} done={doneCount} />
    </>
  )
}
