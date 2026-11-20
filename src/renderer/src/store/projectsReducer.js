import { seedProjects } from './seedProjects'

/**
 * 状态形状：
 *   { projects: Project[] }
 *
 * 之所以包一层对象而不是直接放数组，是为了以后加 selectedProjectId、
 * filter、sort 之类的全局 UI 状态时不用改 context 的消费者。
 */
export const initialState = {
  projects: seedProjects
}

export const ACTIONS = {
  PROJECT_ADD: 'project/add',
  PROJECT_REMOVE: 'project/remove',
  TASK_ADD: 'task/add',
  TASK_TOGGLE: 'task/toggle',
  TASK_REMOVE: 'task/remove',
  RESET: 'app/reset'
}

/**
 * 把"只改动某个项目的 tasks"这段重复逻辑收成一处。
 * updater: (tasks) => nextTasks
 */
function withProjectTasks(state, projectId, updater) {
  return {
    ...state,
    projects: state.projects.map((project) =>
      project.id === projectId ? { ...project, tasks: updater(project.tasks || []) } : project
    )
  }
}

export function projectsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.PROJECT_ADD:
      return {
        ...state,
        projects: [action.payload, ...state.projects]
      }

    case ACTIONS.PROJECT_REMOVE:
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload.projectId)
      }

    case ACTIONS.TASK_ADD:
      return withProjectTasks(state, action.payload.projectId, (tasks) => [
        ...tasks,
        action.payload.task
      ])

    case ACTIONS.TASK_TOGGLE:
      return withProjectTasks(state, action.payload.projectId, (tasks) =>
        tasks.map((task) =>
          task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task
        )
      )

    case ACTIONS.TASK_REMOVE:
      return withProjectTasks(state, action.payload.projectId, (tasks) =>
        tasks.filter((task) => task.id !== action.payload.taskId)
      )

    case ACTIONS.RESET:
      return initialState

    default:
      return state
  }
}
