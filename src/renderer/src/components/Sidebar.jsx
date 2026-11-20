// src/renderer/src/components/Sidebar.jsx
import { Layout, Menu } from 'antd'
import { NAV_ITEMS } from '../app/navigation'
import logoPic from '../assets/pic2.png'

const { Sider } = Layout

export default function Sidebar({ current, onMenuChange }) {
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
        items={NAV_ITEMS}
        selectedKeys={[current]}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}
