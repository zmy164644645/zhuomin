/** 任务优先级：值、展示文案、antd Tag 颜色、排序权重 */

export const PRIORITY_OPTIONS = [
  { value: 'high', label: '高', full: '高优先级', color: 'red', rank: 0 },
  { value: 'medium', label: '中', full: '中优先级', color: 'gold', rank: 1 },
  { value: 'low', label: '低', full: '低优先级', color: 'default', rank: 2 }
]

export const DEFAULT_PRIORITY = 'medium'

export const PRIORITY_MAP = PRIORITY_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item
  return acc
}, {})

export function priorityMeta(value) {
  return PRIORITY_MAP[value] || PRIORITY_MAP[DEFAULT_PRIORITY]
}

/** 排序权重：高 → 中 → 低 */
export function priorityRank(value) {
  return priorityMeta(value).rank
}
