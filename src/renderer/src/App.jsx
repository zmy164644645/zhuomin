import { useState } from 'react'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import DashboardPage from './features/dashboard/DashboardPage'
import ProjectsPage from './features/projects/ProjectsPage'
import TasksPage from './features/tasks/TasksPage'
import { DEFAULT_PAGE } from './app/navigation'

const { Header, Content } = Layout

/**
 * 页面注册表：key 与侧边栏菜单项的 key 一一对应。
 * 以后加页面只需两处改动——这里加一条、navigation.jsx 加一条菜单项。
 */
const PAGES = {
  dashboard: DashboardPage,
  projects: ProjectsPage,
  tasks: TasksPage
}

export default function App() {
  // 当前页面由布局层持有，项目/任务数据统一由 ProjectsProvider 提供
  const [current, setCurrent] = useState(DEFAULT_PAGE)
  const CurrentPage = PAGES[current] || PAGES[DEFAULT_PAGE]

  return (
    <Layout className="zhuomianbuju">
      <Sidebar current={current} onMenuChange={setCurrent} />
      <Layout>
        <Header className="dingbutoubu">
          <span>USY 项目制教学桌面工作平台</span>
        </Header>
        <Content className="neirongquyu">
          <CurrentPage onNavigate={setCurrent} />
        </Content>
      </Layout>
    </Layout>
  )
}
