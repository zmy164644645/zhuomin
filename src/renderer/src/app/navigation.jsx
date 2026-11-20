import { DashboardOutlined, ProjectOutlined, CheckSquareOutlined } from '@ant-design/icons'

/** 默认落地页：打开应用先进工作台 */
export const DEFAULT_PAGE = 'dashboard'

/**
 * 侧边栏菜单配置。
 * key 同时也是页面映射的键，Sidebar 只负责渲染，不再写死菜单项。
 */
export const NAV_ITEMS = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '工作台首页' },
  { key: 'projects', icon: <ProjectOutlined />, label: '项目管理' },
  { key: 'tasks', icon: <CheckSquareOutlined />, label: '任务管理' }
]
