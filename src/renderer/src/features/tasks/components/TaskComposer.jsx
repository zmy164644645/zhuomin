import { Button, DatePicker, Input, Select, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PRIORITY_OPTIONS } from '../../../shared/constants/taskPriority'

/**
 * 任务快速录入：标题 + 优先级 + 截止日期。
 * 受控组件，状态全部由页面持有，方便提交后统一清空。
 */
export default function TaskComposer({
  value,
  priority,
  dueDate,
  onTitleChange,
  onPriorityChange,
  onDueDateChange,
  onSubmit
}) {
  const handleSubmit = () => {
    const title = (value || '').trim()
    if (!title) return
    onSubmit({
      title,
      priority,
      dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : ''
    })
  }

  return (
    <Space.Compact style={{ width: '100%', marginBottom: '16px' }} className="task-composer">
      <Input
        size="large"
        placeholder="输入实训待办任务，例如：完成前端页面开发与组件封装（回车快速添加）"
        value={value}
        onChange={(event) => onTitleChange(event.target.value)}
        onPressEnter={handleSubmit}
        style={{ flex: 1 }}
      />
      <Select
        size="large"
        value={priority}
        onChange={onPriorityChange}
        style={{ width: 108 }}
        options={PRIORITY_OPTIONS.map((item) => ({ label: item.full, value: item.value }))}
      />
      <DatePicker
        size="large"
        value={dueDate}
        onChange={onDueDateChange}
        placeholder="截止日期"
        style={{ width: 150 }}
      />
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleSubmit}>
        添加任务
      </Button>
    </Space.Compact>
  )
}
