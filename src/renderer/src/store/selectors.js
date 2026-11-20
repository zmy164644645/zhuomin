import { isOverdue } from '../shared/date'
import { priorityRank } from '../shared/constants/taskPriority'

/**
 * 派生数据（selector）：只做计算，不持有状态。
 *
 * 组件不自己去 find/filter/sort，而是调用这里，
 * 好处是同一个口径只写一次，工作台、项目页、任务页看到的数据永远一致。
 */

export function selectProjectById(projects, projectId) {
  return projects.find((project) => project.id === projectId) || null
}

export function selectProjectTasks(project) {
  return project?.tasks || []
}

/** 任务统计：总数 / 已完成 / 待推进 / 完成百分比 / 逾期数 */
export function selectTaskStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  return {
    total,
    completed,
    pending: total - completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    overdue: tasks.filter(isOverdue).length
  }
}

export function selectProjectStats(project) {
  return selectTaskStats(selectProjectTasks(project))
}

/** 全局汇总：工作台顶部统计卡用 */
export function selectOverview(projects) {
  const allTasks = projects.flatMap((project) => project.tasks || [])
  return {
    projectCount: projects.length,
    activeProjectCount: projects.filter((project) =>
      (project.tasks || []).some((task) => !task.completed)
    ).length,
    ...selectTaskStats(allTasks)
  }
}

/** 把任务打平并带上所属项目，便于跨项目排序与展示 */
export function selectFlattenedTasks(projects) {
  return projects.flatMap((project) =>
    (project.tasks || []).map((task) => ({
      ...task,
      projectId: project.id,
      projectName: project.name,
      course: project.course
    }))
  )
}

function compareDueDate(a, b) {
  if (a.dueDate === b.dueDate) return 0
  if (!a.dueDate) return 1
  if (!b.dueDate) return -1
  return a.dueDate < b.dueDate ? -1 : 1
}

/**
 * 任务排序
 * @param {'default'|'priority'|'dueDate'} sortKey
 */
export function sortTasks(tasks, sortKey) {
  if (sortKey === 'default') return tasks
  const sorted = [...tasks]
  if (sortKey === 'priority') {
    sorted.sort(
      (a, b) => priorityRank(a.priority) - priorityRank(b.priority) || compareDueDate(a, b)
    )
  } else if (sortKey === 'dueDate') {
    sorted.sort(
      (a, b) => compareDueDate(a, b) || priorityRank(a.priority) - priorityRank(b.priority)
    )
  }
  return sorted
}

/**
 * 任务筛选
 * @param {{ status?: 'all'|'active'|'done', keyword?: string }} options
 */
export function filterTasks(tasks, { status = 'all', keyword = '' } = {}) {
  const text = keyword.trim().toLowerCase()
  return tasks.filter((task) => {
    if (status === 'active' && task.completed) return false
    if (status === 'done' && !task.completed) return false
    if (text && !task.title.toLowerCase().includes(text)) return false
    return true
  })
}

/** 工作台待办：所有未完成任务，按截止日期从近到远 */
export function selectTodoTasks(projects, limit = 5) {
  return selectFlattenedTasks(projects)
    .filter((task) => !task.completed)
    .sort((a, b) => compareDueDate(a, b) || priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, limit)
}

/** 最近项目：按创建时间倒序 */
export function selectRecentProjects(projects, limit = 3) {
  return [...projects]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
    .slice(0, limit)
}

/** 项目关键词匹配：名称 / 课程 / 简介 */
export function matchesProjectKeyword(project, keyword) {
  const text = keyword.trim().toLowerCase()
  if (!text) return true
  return [project.name, project.course, project.description]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(text))
}
