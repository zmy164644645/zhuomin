/** 日期工具：全部基于本地时区的 'YYYY-MM-DD' 字符串，避免时区换算带来的偏差 */

export function toDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function today() {
  return toDateString(new Date())
}

/** 相对今天偏移 n 天，用于生成示例数据 */
export function offsetDays(n) {
  const date = new Date()
  date.setDate(date.getDate() + n)
  return toDateString(date)
}

/** 距今天还有几天（负数表示已过期） */
export function daysUntil(dateString) {
  if (!dateString) return null
  const target = new Date(`${dateString}T00:00:00`)
  const now = new Date(`${today()}T00:00:00`)
  return Math.round((target - now) / 86400000)
}

/** 任务是否逾期：未完成 + 有截止日期 + 日期已过 */
export function isOverdue(task) {
  if (!task || task.completed || !task.dueDate) return false
  return task.dueDate < today()
}

/** 到期文案，例如「逾期 2 天」「今天到期」「还剩 3 天」 */
export function dueText(dateString) {
  const days = daysUntil(dateString)
  if (days === null) return ''
  if (days < 0) return `逾期 ${Math.abs(days)} 天`
  if (days === 0) return '今天到期'
  if (days === 1) return '明天到期'
  return `还剩 ${days} 天`
}

/** 2026-11-09 → 11月9日 */
export function shortDate(dateString) {
  if (!dateString) return ''
  const [, month, day] = dateString.split('-')
  return `${Number(month)}月${Number(day)}日`
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

/** 2026年11月9日 星期一 */
export function todayLabel(date = new Date()) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEKDAYS[date.getDay()]}`
}

/** 按小时返回问候语 */
export function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}
