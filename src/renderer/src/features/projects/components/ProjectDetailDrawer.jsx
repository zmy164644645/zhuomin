import { Button, Checkbox, Drawer, Empty, Progress, Tag } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { selectProjectStats } from '../../../store/selectors'
import { dueText, isOverdue, shortDate } from '../../../shared/date'
import { priorityMeta } from '../../../shared/constants/taskPriority'

/**
 * 项目详情抽屉：无需新增路由即可查看单个项目的全部任务，
 * 并支持直接勾选 / 删除任务，避免在页面之间来回跳。
 */
export default function ProjectDetailDrawer({
  project,
  open,
  onClose,
  onNavigate,
  onToggleTask,
  onRemoveTask
}) {
  const tasks = project?.tasks || []
  const stats = selectProjectStats(project)

  return (
    <Drawer
      title={project?.name || '项目详情'}
      open={open}
      onClose={onClose}
      width={480}
      className="project-drawer"
      footer={
        <div className="drawer-footer">
          <Button onClick={onClose}>关闭</Button>
          <Button type="primary" onClick={() => onNavigate?.('tasks')}>
            去任务管理
          </Button>
        </div>
      }
    >
      {project ? (
        <>
          <div className="detail-meta">
            <div className="detail-meta-row">
              <span>所属课程</span>
              <Tag color="blue">{project.course}</Tag>
            </div>
            <div className="detail-meta-row">
              <span>创建时间</span>
              <b>{project.createdAt}</b>
            </div>
            <div className="detail-meta-row">
              <span>本地目录</span>
              <b className="detail-path">{project.folderPath}</b>
            </div>
          </div>

          <p className="detail-desc">{project.description}</p>

          <div className="detail-progress">
            <div className="detail-progress-head">
              <span>完成进度</span>
              <b>
                {stats.completed}/{stats.total} 项
                {stats.overdue > 0 ? (
                  <em className="text-danger">（{stats.overdue} 项逾期）</em>
                ) : null}
              </b>
            </div>
            <Progress percent={stats.percent} strokeColor="#2563eb" />
          </div>

          <div className="detail-section-title">任务清单</div>
          {tasks.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="该项目还没有任务" />
          ) : (
            <div className="detail-tasks">
              {tasks.map((task) => {
                const meta = priorityMeta(task.priority)
                const overdue = isOverdue(task)
                return (
                  <div className="detail-task" key={task.id}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => onToggleTask?.(project.id, task.id)}
                    />
                    <div className="detail-task-main">
                      <div className={`detail-task-title${task.completed ? ' is-done' : ''}`}>
                        {task.title}
                      </div>
                      <div className="detail-task-meta">
                        <Tag color={meta.color}>{meta.label}</Tag>
                        {task.dueDate ? (
                          <span className={overdue ? 'text-danger' : 'detail-task-date'}>
                            {shortDate(task.dueDate)}
                            {overdue ? ` · ${dueText(task.dueDate)}` : ''}
                          </span>
                        ) : (
                          <span className="detail-task-date">未设截止</span>
                        )}
                      </div>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onRemoveTask?.(project.id, task.id)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </>
      ) : null}
    </Drawer>
  )
}
