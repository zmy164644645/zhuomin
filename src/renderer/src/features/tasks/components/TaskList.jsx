import { Button, Card, Checkbox, Empty, List, Tag } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { dueText, isOverdue, shortDate } from '../../../shared/date'
import { priorityMeta } from '../../../shared/constants/taskPriority'

/** 任务清单列表：展示优先级与截止日期，逾期标红 */
export default function TaskList({ tasks, onToggle, onDelete, emptyText }) {
  return (
    <Card title="实训待办任务列表" className="task-list-card">
      {tasks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyText || '当前项目还没有任务，快在上方输入框添加一个吧！'}
        />
      ) : (
        <List
          dataSource={tasks}
          renderItem={(task) => {
            const meta = priorityMeta(task.priority)
            const overdue = isOverdue(task)
            return (
              <List.Item
                key={task.id}
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(task.id)}
                  >
                    删除
                  </Button>
                ]}
              >
                <div className="task-row">
                  <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
                  <div className="task-row-main">
                    <div className={`task-row-title${task.completed ? ' is-done' : ''}`}>
                      {task.title}
                    </div>
                    <div className="task-row-meta">
                      <Tag color={meta.color}>{meta.label}</Tag>
                      {task.dueDate ? (
                        <span className={overdue ? 'text-danger' : 'task-row-due'}>
                          {shortDate(task.dueDate)}
                          {overdue ? ` · ${dueText(task.dueDate)}` : ''}
                        </span>
                      ) : (
                        <span className="task-row-due">未设截止</span>
                      )}
                    </div>
                  </div>
                  {task.completed ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      已完成
                    </Tag>
                  ) : (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                      进行中
                    </Tag>
                  )}
                </div>
              </List.Item>
            )
          }}
        />
      )}
    </Card>
  )
}
