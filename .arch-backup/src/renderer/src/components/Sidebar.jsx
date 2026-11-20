// src/renderer/src/components/Sidebar.jsx
import { Layout, Menu } from 'antd'
import { DashboardOutlined, ProjectOutlined, CheckSquareOutlined } from '@ant-design/icons'
import logoPic from '../assets/pic2.png'

const { Sider } = Layout

export default function Sidebar({ current, onMenuChange }) {
  const caidanXiang = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '工作台首页',
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
    },
    {
      key: 'tasks',
      icon: <CheckSquareOutlined />,
      label: '任务管理',
    },
  ]

  const handleMenuClick = ({ key }) => {
    if (onMenuChange) {
      onMenuChange(key)
    }
  }

  return (
    <Sider className="zuocecaidan" width={228} theme="light">
      <div className="caidanlogo">
        <img className="logoqutupian" src={logoPic} alt="USY logo" />
        <span>USY Studio</span>
      </div>
      <Menu
        theme="light"
        mode="inline"
        items={caidanXiang}
        selectedKeys={[current]}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}
