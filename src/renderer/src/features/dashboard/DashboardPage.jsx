import { Button, Card, Col, Popconfirm, Progress, Row, Space, Tag } from 'antd'
import { CheckSquareOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useOverview, useProjectActions, useProjects, useTodoTasks } from '../../hooks/useProjects'
import { greeting, todayLabel } from '../../shared/date'
import StatCard from './components/StatCard'
import ProjectProgressList from './components/ProjectProgressList'
import TodoList from './components/TodoList'

/** 工作台首页：只读汇总 + 快捷入口 */
export default function DashboardPage({ onNavigate }) {
  const projects = useProjects()
  const overview = useOverview()
  const todoTasks = useTodoTasks(6)
  const { resetProjects } = useProjectActions()

  const goProjects = () => onNavigate?.('projects')
  const goTasks = () => onNavigate?.('tasks')

  return (
    <div className="dashboard">
      {/* 1. 页头：问候 + 快捷操作 */}
      <div className="dashboard-header">
        <div>
          <h2>工作台首页</h2>
          <span className="dashboard-sub">
            {greeting()}，今天是 {todayLabel()}
          </span>
        </div>
        <Space wrap>
          <Popconfirm
            title="恢复示例数据？"
            description="当前所有项目与任务会被示例数据替换，且无法撤销。"
            okText="恢复"
            cancelText="取消"
            onConfirm={resetProjects}
          >
            <Button icon={<ReloadOutlined />}>恢复示例数据</Button>
          </Popconfirm>
          <Button icon={<PlusOutlined />} onClick={goProjects}>
            新建项目
          </Button>
          <Button type="primary" icon={<CheckSquareOutlined />} onClick={goTasks}>
            去管理任务
          </Button>
        </Space>
      </div>

      {/* 2. 统计卡 */}
      <Row gutter={[16, 16]} className="stat-row">
        <Col xs={12} lg={6}>
          <StatCard
            label="教学项目"
            value={overview.projectCount}
            suffix="个"
            hint={`其中 ${overview.activeProjectCount} 个还有待办`}
            tone="accent"
          />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard
            label="任务总数"
            value={overview.total}
            suffix="项"
            hint={`已完成 ${overview.completed} 项`}
          />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard
            label="待推进"
            value={overview.pending}
            suffix="项"
            hint={overview.overdue > 0 ? `其中 ${overview.overdue} 项已逾期` : '暂无逾期任务'}
            tone={overview.overdue > 0 ? 'danger' : 'success'}
          />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard
            label="整体完成率"
            value={overview.percent}
            suffix="%"
            hint={`${overview.completed} / ${overview.total} 项任务`}
            tone="success"
          />
        </Col>
      </Row>

      {/* 3. 进度 + 待办 */}
      <Row gutter={[16, 16]} className="dashboard-body">
        <Col xs={24} lg={15}>
          <Card title="整体完成进度" className="dashboard-card">
            <div className="progress-hero">
              <Progress
                type="circle"
                percent={overview.percent}
                size={124}
                strokeColor="#2563eb"
                strokeWidth={8}
              />
              <div className="progress-meta">
                <div className="progress-meta-line">
                  已完成 <b>{overview.completed}</b> / {overview.total} 项任务
                </div>
                <div className="progress-meta-line progress-meta-line--muted">
                  还有 {overview.pending} 项待推进
                  {overview.overdue > 0 ? (
                    <span className="text-danger">，{overview.overdue} 项已逾期</span>
                  ) : null}
                </div>
                <Space size={4} wrap className="progress-tags">
                  <Tag color="blue">进行中 {overview.pending}</Tag>
                  <Tag color="green">已完成 {overview.completed}</Tag>
                  {overview.overdue > 0 ? <Tag color="red">逾期 {overview.overdue}</Tag> : null}
                </Space>
              </div>
            </div>
            <div className="progress-divider" />
            <div className="progress-list-head">
              <span>项目进度</span>
              <a onClick={goProjects}>查看全部项目</a>
            </div>
            <ProjectProgressList projects={projects} onSelect={goTasks} />
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="最近待办"
            className="dashboard-card"
            extra={<a onClick={goTasks}>全部任务</a>}
          >
            <TodoList tasks={todoTasks} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
