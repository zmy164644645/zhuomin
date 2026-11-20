import { Progress } from 'antd'
import { selectProjectStats } from '../../../store/selectors'

/** 各项目完成进度（工作台左侧卡片） */
export default function ProjectProgressList({ projects, onSelect }) {
  if (!projects.length) {
    return <div className="progress-empty">还没有项目，先新建一个吧</div>
  }

  return (
    <div className="project-progress">
      {projects.map((project) => {
        const stats = selectProjectStats(project)
        return (
          <div
            className="project-progress-item"
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(project.id)}
            onKeyDown={(event) => event.key === 'Enter' && onSelect?.(project.id)}
          >
            <div className="project-progress-head">
              <span className="project-progress-name">{project.name}</span>
              <span className="project-progress-count">
                {stats.completed}/{stats.total}
              </span>
            </div>
            <Progress percent={stats.percent} size="small" strokeColor="#2563eb" showInfo={false} />
          </div>
        )
      })}
    </div>
  )
}
