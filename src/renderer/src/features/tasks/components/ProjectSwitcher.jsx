import { Select, Space } from 'antd'
import { ProjectOutlined } from '@ant-design/icons'

/** 项目下拉切换器 */
export default function ProjectSwitcher({ projectList, value, onChange }) {
  return (
    <Space>
      <span style={{ fontSize: '14px', color: 'var(--text-2)', fontWeight: 500 }}>
        <ProjectOutlined style={{ marginRight: 6 }} />
        切换所属项目：
      </span>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: 260 }}
        options={projectList.map((item) => ({
          label: item.name,
          value: item.id
        }))}
      />
    </Space>
  )
}
