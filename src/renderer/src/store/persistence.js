import { DEFAULT_PRIORITY, PRIORITY_MAP } from '../shared/constants/taskPriority'

/**
 * 本地持久化：把项目数据存到 localStorage。
 *
 * 桌面端更彻底的做法是走主进程写用户目录下的 JSON 文件（IPC + preload），
 * 这里先用 localStorage——无需改主进程、和渲染层同生命周期，刷新与重启都不丢。
 */
const STORAGE_KEY = 'usy-project-studio:state'
const SCHEMA_VERSION = 2

/** 兼容旧数据：缺字段的补默认值，脏数据直接丢弃 */
function normalizeTask(task) {
  if (!task || typeof task.title !== 'string') return null
  return {
    id: task.id || `t_${Math.random().toString(36).slice(2, 9)}`,
    title: task.title,
    completed: Boolean(task.completed),
    priority: PRIORITY_MAP[task.priority] ? task.priority : DEFAULT_PRIORITY,
    dueDate: typeof task.dueDate === 'string' ? task.dueDate : ''
  }
}

function normalizeProject(project) {
  if (!project || typeof project.name !== 'string') return null
  return {
    id: project.id || `p_${Math.random().toString(36).slice(2, 9)}`,
    name: project.name,
    course: project.course || '未填写课程',
    description: project.description || '暂无简介',
    createdAt: project.createdAt || new Date().toISOString().split('T')[0],
    folderPath: project.folderPath || '待关联本地文件夹',
    tasks: Array.isArray(project.tasks) ? project.tasks.map(normalizeTask).filter(Boolean) : []
  }
}

/** 读取存档；没有存档或版本不匹配时返回 null（由调用方回退到示例数据） */
export function loadProjects() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.projects)) return null
    const projects = parsed.projects.map(normalizeProject).filter(Boolean)
    return projects.length > 0 ? projects : null
  } catch (error) {
    console.warn('[persistence] 本地数据解析失败，已回退到示例数据', error)
    return null
  }
}

export function saveProjects(projects) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        projects
      })
    )
  } catch (error) {
    console.warn('[persistence] 本地数据写入失败', error)
  }
}

export function clearProjects() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('[persistence] 本地数据清除失败', error)
  }
}
