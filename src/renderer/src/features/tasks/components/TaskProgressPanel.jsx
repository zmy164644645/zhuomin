import { Card, Progress, Tag } from 'antd'

/** 当前项目信息与实时进度看板 */
export default function TaskProgressPanel({ project, stats }) {
  return (
    <Card
      className="task-board"
      style={{ marginBottom: '16px' }}
      styles={{ body: { padding: '20px' } }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>
            {project.name}
          </span>
          <Tag color="blue">{project.course}</Tag>
        </div>
        <div className="progress-numbers">
          <span>
            总任务：<b>{stats.total}</b> 项
          </span>
          <span className="progress-numbers-divider">|</span>
          <span style={{ color: 'var(--c-success)' }}>
            已完成：<b>{stats.completed}</b> 项
          </span>
          <span className="progress-numbers-divider">|</span>
          <span style={{ color: 'var(--c-warning)' }}>
            待推进：<b>{stats.pending}</b> 项
          </span>
          {stats.overdue > 0 ? (
            <>
              <span className="progress-numbers-divider">|</span>
              <span style={{ color: 'var(--c-danger)' }}>
                已逾期：<b>{stats.overdue}</b> 项
              </span>
            </>
          ) : null}
        </div>
      </div>
      <Progress
        percent={stats.percent}
        status={stats.percent >= 100 ? 'success' : 'normal'}
        strokeColor="#2563eb"
      />
    </Card>
  )
}
