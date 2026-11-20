import { DEFAULT_PRIORITY, PRIORITY_MAP } from '../shared/constants/taskPriority'

/**
 * 实体工厂：负责生成 id、补齐默认字段。
 *
 * 放在 reducer 之外，是为了让 reducer 保持纯函数（同输入必得同输出），
 * 时间戳与自增序号这类"不确定性"全部收敛到这里，便于单元测试。
 */

let seq = 0

function createId(prefix) {
  seq += 1
  return `${prefix}_${Date.now().toString(36)}${seq.toString(36)}`
}

/** 表单值 → 项目实体 */
export function createProject(values) {
  const folderPath = typeof values.folderPath === 'string' ? values.folderPath.trim() : ''
  return {
    id: createId('p'),
    name: values.name,
    course: values.course,
    description: values.description || '暂无简介',
    createdAt: new Date().toISOString().split('T')[0],
    // 未选择目录时沿用原来的占位文案，便于卡片统一判断"是否已关联"
    folderPath: folderPath || '待关联本地文件夹',
    tasks: []
  }
}

/**
 * 任务 → 实体
 * @param {string} title
 * @param {{ priority?: string, dueDate?: string }} [options]
 */
export function createTask(title, options = {}) {
  const priority = PRIORITY_MAP[options.priority] ? options.priority : DEFAULT_PRIORITY
  return {
    id: createId('t'),
    title: title.trim(),
    completed: false,
    priority,
    dueDate: options.dueDate || ''
  }
}
