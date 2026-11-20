import { Button, Form, Input, Modal, Space, message } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'

/** 渲染层统一的目录选择入口：优先走 Electron IPC，浏览器环境下降级提示 */
async function pickFolder(defaultPath) {
  const bridge = window.api
  if (!bridge?.selectFolder) {
    message.warning('当前环境不支持选择本地文件夹，请手动输入路径')
    return null
  }
  try {
    const result = await bridge.selectFolder(defaultPath)
    if (!result || result.canceled) return null
    return result.path
  } catch (error) {
    console.error('[projects] 选择文件夹失败', error)
    message.error('打开文件夹对话框失败，请手动输入路径')
    return null
  }
}

/**
 * 新建项目弹窗。
 * 只负责收集表单值，实体怎么造（id、创建日期）交给 store 的工厂函数。
 */
export default function ProjectCreateModal({ open, onCancel, onSubmit }) {
  const [form] = Form.useForm()

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleFinish = (values) => {
    onSubmit(values)
    form.resetFields()
    onCancel()
  }

  // 选择文件夹后回填到表单，用户仍可手动修改路径
  const handleSelectFolder = async () => {
    const current = form.getFieldValue('folderPath')
    const selected = await pickFolder(current)
    if (selected) {
      form.setFieldsValue({ folderPath: selected })
    }
  }

  return (
    <Modal
      title="新建教学实训项目"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="创建"
      cancelText="取消"
      width={560}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
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
        <Form.Item label="本地项目目录">
          {/* Form.Item 直接包 Space.Compact 会导致 value/onChange 不落到 Input 上，
              所以把受控字段放在内部的 noStyle Form.Item 里 */}
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="folderPath" noStyle>
              <Input placeholder="选择或输入项目所在的文件夹" />
            </Form.Item>
            <Button icon={<FolderOpenOutlined />} onClick={handleSelectFolder}>
              选择文件夹
            </Button>
          </Space.Compact>
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
  )
}
