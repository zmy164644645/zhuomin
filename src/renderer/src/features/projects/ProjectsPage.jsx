import { useMemo, useState } from 'react'
import { Button, Col, Empty, Input, Row, Space } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useProjectActions, useProjects } from '../../hooks/useProjects'
import { matchesProjectKeyword } from '../../store/selectors'
import ProjectCard from './components/ProjectCard'
import ProjectCreateModal from './components/ProjectCreateModal'
import ProjectDetailDrawer from './components/ProjectDetailDrawer'

/** 项目管理页：搜索、新建、删除、查看详情 */
export default function ProjectsPage({ onNavigate }) {
  const projectList = useProjects()
  const { addProject, removeProject, toggleTask, removeTask } = useProjectActions()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [detailId, setDetailId] = useState(null)

  const filteredProjects = useMemo(
    () => projectList.filter((project) => matchesProjectKeyword(project, keyword)),
    [projectList, keyword]
  )

  // 详情抽屉始终读最新数据，任务勾选后能实时更新
  const detailProject = useMemo(
    () => projectList.find((project) => project.id === detailId) || null,
    [projectList, detailId]
  )

  const handleCreateProject = (values) => {
    addProject(values)
  }

  const handleDeleteProject = (projectId) => {
    if (projectId === detailId) setDetailId(null)
    removeProject(projectId)
  }

  return (
    <div className="xiangmuguanli">
      {/* 顶部操作栏 */}
      <div className="page-header">
        <div>
          <h2>我的教学项目</h2>
          <span className="page-sub">
            共 {projectList.length} 个项目
            {keyword.trim() ? ` · 匹配 ${filteredProjects.length} 个` : ''}
          </span>
        </div>
        <Space wrap>
          <Input
            allowClear
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            prefix={<SearchOutlined style={{ color: 'var(--text-3)' }} />}
            placeholder="搜索项目 / 课程 / 简介"
            style={{ width: 240 }}
          />
          <Button onClick={() => setIsModalOpen(true)} type="primary" icon={<PlusOutlined />}>
            新增项目
          </Button>
        </Space>
      </div>

      {filteredProjects.length === 0 ? (
        <Empty
          style={{ marginTop: 60 }}
          description={
            keyword.trim() ? `没有匹配「${keyword.trim()}」的项目` : '还没有项目，点击右上角新建'
          }
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProjects.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <ProjectCard project={item} onOpen={setDetailId} onDelete={handleDeleteProject} />
            </Col>
          ))}
        </Row>
      )}

      {/* 新建项目 modal 对话框 */}
      <ProjectCreateModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* 项目详情抽屉 */}
      <ProjectDetailDrawer
        project={detailProject}
        open={Boolean(detailProject)}
        onClose={() => setDetailId(null)}
        onNavigate={onNavigate}
        onToggleTask={toggleTask}
        onRemoveTask={removeTask}
      />
    </div>
  )
}
