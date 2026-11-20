import { Empty, Tag } from 'antd'
import { dueText, isOverdue, shortDate } from '../../../shared/date'

/** 最近待办清单：按截止日期从近到远，逾期的标红 */
export default function TodoList({ tasks }) {
  if (!tasks.length) {
    return (
      <div className="todo-empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无待办任务" />
      </div>
    )
  }

  return (
    <div className="todo-list">
      {tasks.map((task) => {
        const overdue = isOverdue(task)
        return (
          <div className="todo-item" key={task.id}>
            <span className={`todo-dot todo-dot--${task.priority}`} />
            <div className="todo-main">
              <div className="todo-title">{task.title}</div>
              <div className="todo-meta">
                {task.projectName}
                {task.dueDate ? ` · ${shortDate(task.dueDate)}` : ' · 未设截止'}
              </div>
            </div>
            {overdue ? (
              <Tag color="red">已逾期</Tag>
            ) : (
              <span className="todo-due">{dueText(task.dueDate)}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
