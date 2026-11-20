import { useState } from 'react'
import { Card, Row, Col, Button, Modal, Form, Input, Tag } from 'antd'
import { PlusOutlined, FolderOutlined } from '@ant-design/icons'

export default function Projects({ projectList = [], onAddProject }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleFormFinish = (values) => {
    console.log('++++++++++', values)
    const newProject = {
      id: `p_${Date.now()}`,
      name: values.name,
      course: values.course,
      description: values.description || '暂无简介',
      createdAt: new Date().toISOString().split('T')[0],
      folderPath: '待关联本地文件夹'
    }
    if (onAddProject) {
      onAddProject(newProject)
    }
    setIsModalOpen(false)
    form.resetFields()
  }

  return (
    <div className="xiangmuguanli">
      {/* 顶部操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>我的教学项目</h2>
          <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>共 {projectList.length} 个项目</span>
        </div>
        <Button onClick={handleOpenModal} type="primary" icon={<PlusOutlined />}>
          新增项目
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {projectList.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              title={<span style={{ fontWeight: 'bold' }}>{item.name}</span>}
              style={{ height: '100%' }}
              extra={<Tag color="blue">{item.course}</Tag>}
            >
              {/* 项目简介 */}
              <p
                style={{
                  color: 'var(--text-2)',
                  minHeight: '42px',
                  lineHeight: '21px',
                  margin: '0 0 12px 0'
                }}
              >
                {item.description}
              </p>
              {/* 本地目录状态预存 */}
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FolderOutlined />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.folderPath}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {/* 新建项目 modal 对话框 */}
      <Modal
        title="新建教学实训项目"
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} onFinish={handleFormFinish} layout="vertical">
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="例如：金融数据上链存证系统" />
          </Form.Item>
          <Form.Item
            name="course"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="例如：区块链技术原理及应用" />
          </Form.Item>
          <Form.Item
            name="description"
            label="项目简介"
            rules={[{ required: true, message: '请输入项目简介' }]}
          >
            <Input.TextArea rows={3} placeholder="简要描述项目的核心目标，技术栈或者成果要求" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

