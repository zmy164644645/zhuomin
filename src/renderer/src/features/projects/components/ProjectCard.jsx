import { Button, Card, Popconfirm, Progress, Space, Tag, message } from 'antd'
import { DeleteOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons'
import { selectProjectStats } from '../../../store/selectors'

/** 未关联目录时的占位文案，与 store 工厂、持久化的默认值保持一致 */
const UNSET_FOLDER = '待关联本地文件夹'

/**
 * 用系统文件管理器打开项目目录。
 * 优先走 Electron 主进程的 shell.openPath，失败时给出明确反馈。
 */
async function openFolder(folderPath) {
  const bridge = window.api
  if (!bridge?.openFolder) {
    message.warning('当前环境不支持打开本地目录')
    return
  }
  try {
    const result = await bridge.openFolder(folderPath)
    if (result && result.ok === false) {
      message.error(`目录打开失败：${result.message || '路径不存在或无访问权限'}`)
    }
  } catch (error) {
    console.error('[projects] 打开目录失败', error)
    message.error('打开目录失败，请检查路径是否存在')
  }
}

/** 单个项目卡片：展示简介、进度与目录，可点开详情，可删除 */
export default function ProjectCard({ project, onOpen, onDelete }) {
  const stats = selectProjectStats(project)
  const hasFolder = Boolean(project.folderPath) && project.folderPath !== UNSET_FOLDER

  return (
    <Card
      hoverable
      className="project-card"
      title={<span className="project-card-title">{project.name}</span>}
      style={{ height: '100%' }}
      onClick={() => onOpen?.(project.id)}
      extra={
        <Space size={4} onClick={(event) => event.stopPropagation()}>
          <Popconfirm
            title="删除该项目？"
            description="项目下的所有任务会一并删除，且无法撤销。"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete?.(project.id)}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      }
    >
      <p className="project-desc">{project.description}</p>

      <div className="project-meta-row">
        <Tag color="blue">{project.course}</Tag>
        <span className="project-date">创建于 {project.createdAt}</span>
      </div>

      <div className="project-progress-row">
        <div className="project-progress-label">
          <span>任务进度</span>
          <span>
            {stats.completed}/{stats.total}
            {stats.overdue > 0 ? <em className="text-danger"> · {stats.overdue} 项逾期</em> : null}
          </span>
        </div>
        <Progress percent={stats.percent} size="small" strokeColor="#2563eb" showInfo={false} />
      </div>

      <div className="project-folder">
        <FolderOutlined />
        <span className="project-folder-path" title={project.folderPath}>
          {project.folderPath}
        </span>
        {/* 已关联目录才显示入口，避免对占位文案做无效操作 */}
        {hasFolder ? (
          <Button
            type="link"
            size="small"
            className="project-folder-open"
            icon={<FolderOpenOutlined />}
            onClick={(event) => {
              event.stopPropagation()
              openFolder(project.folderPath)
            }}
          >
            打开目录
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
