import { useState } from 'react'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import './App.css'

const { Header, Content } = Layout

export default function App() {
  // 当前默认进入的首页是任务管理页面
  const [current, setCurrent] = useState('tasks')

  // 项目列表及任务进度前端mock数据
  const [projects, setProjects] = useState([
    {
      id: 'p_1',
      name: '金融数据上链存证系统',
      course: '区块链技术及应用',
      description: '基于区块链技术的金融数据上链存证系统',
      createdAt: '2023-01-01',
      folderPath: 'D:\\USY-Projects\\finance-chain',
      tasks: [
        { id: 't_1', title: '撰写开题报告和需求分析说明书', completed: true },
        { id: 't_2', title: '搭建 FISCO-BCOS/Hardhat 以太坊底层区块链网络', completed: true },
        { id: 't_3', title: '编写存证智能合约及单元测试', completed: true },
        { id: 't_4', title: '开发前端可视化交互页面与接口联调', completed: false }
      ]
    },
    {
      id: 'p_2',
      name: '三亚紫金矿业文本采集与分析平台',
      course: '动态网站开发技术',
      description: '基于动态网站开发技术的紫金矿业文本采集与分析平台',
      createdAt: '2023-01-02',
      folderPath: 'D:\\USY-Projects\\text-analysis',
      tasks: [
        { id: 't_201', title: '撰写开题报告和需求分析说明书', completed: true },
        { id: 't_202', title: '设计网站架构', completed: true },
        { id: 't_203', title: '开发前端可视化交互页面与接口联调', completed: false }
      ]
    }
  ])

  // 新增项目处理函数
  const handleAddProject = (newProject) => {
    console.log(newProject, '***************')
    const projectWithTasks = {
      ...newProject,
      tasks: newProject.tasks || []
    }
    setProjects([projectWithTasks, ...projects])
  }

  // 新增任务处理函数
  const handleAddTask = (projectId, taskTitle) => {
    console.log('----------', '主组件接收到新增任务：', { projectId, taskTitle })
    const newTask = {
      id: `t_${Date.now()}`,
      title: taskTitle,
      completed: false
    }
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            tasks: [...(item.tasks || []), newTask]
          }
        }
        return item
      })
    )
  }

  // 切换任务完成状态函数(勾选/取消勾选)
  const handleToggleTask = (projectId, taskId) => {
    console.log('----------', '主组件切换任务完成状态：', { projectId, taskId })
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            tasks: (item.tasks || []).map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        }
        return item
      })
    )
  }

  // 删除任务处理函数
  const handleDeleteTask = (projectId, taskId) => {
    console.log('----------', '主组件删除任务：', { projectId, taskId })
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            tasks: (item.tasks || []).filter((task) => task.id !== taskId)
          }
        }
        return item
      })
    )
  }

  const handleMenuChange = (key) => {
    setCurrent(key)
  }

  return (
    <Layout className="zhuomianbuju">
      <Sidebar current={current} onMenuChange={handleMenuChange}></Sidebar>
      <Layout>
        <Header className="dingbutoubu">
          <span>USY 项目制教学桌面工作平台</span>
        </Header>
        <Content className="neirongquyu">
          {current === 'dashboard' && <Dashboard />}
          {current === 'projects' && (
            <Projects projectList={projects} onAddProject={handleAddProject} />
          )}
          {current === 'tasks' && (
            <Tasks
              projectList={projects}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}


