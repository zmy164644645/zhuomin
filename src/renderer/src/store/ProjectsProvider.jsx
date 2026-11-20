import { useEffect, useMemo, useReducer } from 'react'
import { ACTIONS, initialState, projectsReducer } from './projectsReducer'
import { ProjectsActionsContext, ProjectsStateContext } from './contexts'
import { createProject, createTask } from './factories'
import { loadProjects, saveProjects } from './persistence'

/** 初始化：优先读本地存档，读不到就用示例数据 */
function createInitialState() {
  const saved = loadProjects()
  return saved ? { projects: saved } : initialState
}

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(projectsReducer, undefined, createInitialState)

  // 任何数据变化都写回本地，刷新/重启不丢
  useEffect(() => {
    saveProjects(state.projects)
  }, [state.projects])

  // dispatch 引用恒定，因此 actions 只创建一次，所有方法保持稳定引用。
  // 只调用动作、不读数据的组件不会因为任务勾选而重渲染。
  const actions = useMemo(
    () => ({
      addProject(values) {
        dispatch({ type: ACTIONS.PROJECT_ADD, payload: createProject(values) })
      },
      removeProject(projectId) {
        dispatch({ type: ACTIONS.PROJECT_REMOVE, payload: { projectId } })
      },
      /**
       * 新增任务
       * @param {string} projectId
       * @param {string | { title: string, priority?: string, dueDate?: string }} input
       */
      addTask(projectId, input) {
        const values = typeof input === 'string' ? { title: input } : input || {}
        const title = (values.title || '').trim()
        if (!title) return
        dispatch({
          type: ACTIONS.TASK_ADD,
          payload: { projectId, task: createTask(title, values) }
        })
      },
      toggleTask(projectId, taskId) {
        dispatch({ type: ACTIONS.TASK_TOGGLE, payload: { projectId, taskId } })
      },
      removeTask(projectId, taskId) {
        dispatch({ type: ACTIONS.TASK_REMOVE, payload: { projectId, taskId } })
      },
      resetProjects() {
        dispatch({ type: ACTIONS.RESET })
      }
    }),
    []
  )

  return (
    <ProjectsStateContext.Provider value={state}>
      <ProjectsActionsContext.Provider value={actions}>{children}</ProjectsActionsContext.Provider>
    </ProjectsStateContext.Provider>
  )
}
