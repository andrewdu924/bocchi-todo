const EMPTY_MESSAGES = {
  noTodos: '还没有任务...要不先躲进纸箱里？',
  allDone: '全部完成了！今天的演出很成功！',
  noDone: '还没有完成的任务呢',
}

export default function EmptyState({ filter, totalCount }) {
  let message = EMPTY_MESSAGES.noTodos
  if (totalCount > 0 && filter === 'active') message = EMPTY_MESSAGES.allDone
  else if (totalCount > 0 && filter === 'done') message = EMPTY_MESSAGES.noDone

  return (
    <div className="empty-state">
      <div className="empty-ascii" aria-hidden="true">
{` __________
|          |
|  (;_;)   |
|  /| |\\   |
|__________|
 bocchi in a box`}
      </div>
      <p className="empty-text">{message}</p>
    </div>
  )
}
