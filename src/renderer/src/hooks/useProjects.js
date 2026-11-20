import { useContext, useMemo } from 'react'
import { ProjectsActionsContext, ProjectsStateContext } from '../store/contexts'
import {
  selectOverview,
  selectProjectById,
  selectRecentProjects,
  selectTaskStats,
  selectTodoTasks
} from '../store/selectors'

function useRequiredContext(context, hookName) {
  const value = useContext(context)
  if (!value) {
    throw new Error(`${hookName} 必须在 <ProjectsProvider> 内部使用`)
  }
  return value
}

/** 全部项目列表 */
export function useProjects() {
  return useRequiredContext(ProjectsStateContext, 'useProjects').projects
}

/** 全部业务动作：addProject / removeProject / addTask / toggleTask / removeTask / resetProjects */
export function useProjectActions() {
  return useRequiredContext(ProjectsActionsContext, 'useProjectActions')
}

/** 按 id 查单个项目（找不到返回 null） */
export function useProject(projectId) {
  const projects = useProjects()
  return useMemo(() => selectProjectById(projects, projectId), [projects, projectId])
}

/** 任务统计，随任务列表变化自动重算 */
export function useTaskStats(tasks) {
  return useMemo(() => selectTaskStats(tasks), [tasks])
}

/** 全局汇总（工作台统计卡） */
export function useOverview() {
  const projects = useProjects()
  return useMemo(() => selectOverview(projects), [projects])
}

/** 最近待办（工作台清单） */
export function useTodoTasks(limit = 5) {
  const projects = useProjects()
  return useMemo(() => selectTodoTasks(projects, limit), [projects, limit])
}

/** 最近项目 */
export function useRecentProjects(limit = 3) {
  const projects = useProjects()
  return useMemo(() => selectRecentProjects(projects, limit), [projects, limit])
}
