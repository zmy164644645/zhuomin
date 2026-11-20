import { useMemo, useState } from 'react'
import { Empty, Input, Segmented, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useProject, useProjectActions, useProjects, useTaskStats } from '../../hooks/useProjects'
import { filterTasks, sortTasks } from '../../store/selectors'
import ProjectSwitcher from './components/ProjectSwitcher'
import TaskComposer from './components/TaskComposer'
import TaskList from './components/TaskList'
import TaskProgressPanel from './components/TaskProgressPanel'

/** 空列表用常量占位，避免每次渲染都产生新数组导致 useMemo 失效 */
const EMPTY_TASKS = []

const STATUS_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'done' }
]

const SORT_OPTIONS = [
  { label: '默认顺序', value: 'default' },
  { label: '按优先级', value: 'priority' },
  { label: '按截止日期', value: 'dueDate' }
]

/** 任务管理页：容器组件，只做取数、筛选、派生、事件分发 */
export default function TasksPage() {
  const projectList = useProjects()
  const { addTask, toggleTask, removeTask } = useProjectActions()

  // 当前选中项目 id（页面级 UI 状态，不需要进全局 store）
  const [selectedProjectId, setSelectedProjectId] = useState(() => projectList[0]?.id || '')
  // 录入表单
  const [taskInput, setTaskInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState(null)
  // 列表筛选与排序
  const [status, setStatus] = useState('all')
  const [sortKey, setSortKey] = useState('default')
  const [keyword, setKeyword] = useState('')

  const currentProject = useProject(selectedProjectId)
  const tasks = currentProject?.tasks || EMPTY_TASKS
  const stats = useTaskStats(tasks)

  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, { status, keyword }), sortKey),
    [tasks, status, keyword, sortKey]
  )

  const handleAddTask = ({ title, priority: nextPriority, dueDate: nextDueDate }) => {
    addTask(selectedProjectId, { title, priority: nextPriority, dueDate: nextDueDate })
    setTaskInput('')
    setDueDate(null)
  }

  const hasFilter = status !== 'all' || keyword.trim() !== ''
  const emptyText = hasFilter ? '没有符合筛选条件的任务，试试调整筛选或关键词' : undefined

  // 如果系统里面没有任何项目，友好提示先去创建
  if (!projectList.length || !currentProject) {
    return (
      <div className="renwuguanli">
        <h2>任务管理清单</h2>
        <Empty
          style={{ marginTop: 60 }}
          description="系统暂无可用任务，请先前往左侧【项目管理】创建项目"
        />
      </div>
    )
  }

  return (
    <div className="renwuguanli">
      {/* 1. 顶部操作栏与项目选择器 */}
      <div className="page-header">
        <div>
          <h2>任务管理清单</h2>
          <span className="page-sub">拆解实训阶段目标，标记完成情况并实时统计进度</span>
        </div>
        <ProjectSwitcher
          projectList={projectList}
          value={currentProject.id}
          onChange={setSelectedProjectId}
        />
      </div>

      {/* 2. 当前选中项目的基本信息与实时进度看板 */}
      <TaskProgressPanel project={currentProject} stats={stats} />

      {/* 3. 任务录入：标题 + 优先级 + 截止日期 */}
      <TaskComposer
        value={taskInput}
        priority={priority}
        dueDate={dueDate}
        onTitleChange={setTaskInput}
        onPriorityChange={setPriority}
        onDueDateChange={setDueDate}
        onSubmit={handleAddTask}
      />

      {/* 4. 筛选 / 搜索 / 排序 */}
      <div className="task-toolbar">
        <Segmented
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          className="task-segmented"
        />
        <Space wrap>
          <Input
            allowClear
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            prefix={<SearchOutlined style={{ color: 'var(--text-3)' }} />}
            placeholder="搜索任务标题"
            style={{ width: 200 }}
          />
          <Select
            value={sortKey}
            onChange={setSortKey}
            style={{ width: 136 }}
            options={SORT_OPTIONS}
          />
        </Space>
      </div>

      {/* 5. 任务清单列表 */}
      <TaskList
        tasks={visibleTasks}
        emptyText={emptyText}
        onToggle={(taskId) => toggleTask(selectedProjectId, taskId)}
        onDelete={(taskId) => removeTask(selectedProjectId, taskId)}
      />
    </div>
  )
}
