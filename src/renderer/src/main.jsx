// src/renderer/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import App from './App'
import { ProjectsProvider } from './store/ProjectsProvider'
// 样式按层拆分，由 styles/index.css 统一按原顺序引入
import './styles/index.css'

/**
 * 浅色极简主题：
 * - algorithm: defaultAlgorithm 走 antd 官方浅色基底，不再依赖大量 !important 覆盖
 * - token: 只保留一套蓝(#2563eb)作为强调色，其余全部为中性灰阶
 * - components: 去掉阴影与发光，靠 1px 描线和留白区分层级
 */
const lightConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#2563eb',
    colorInfo: '#2563eb',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',

    colorBgBase: '#ffffff',
    colorBgLayout: '#f7f8fa',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgSpotlight: '#1f2328',

    colorText: '#1f2328',
    colorTextSecondary: '#57606a',
    colorTextTertiary: '#8b949e',
    colorTextQuaternary: '#b3bac4',

    colorBorder: '#e6e8ec',
    colorBorderSecondary: '#eef0f3',
    colorFillQuaternary: '#f4f5f7',

    borderRadius: 8,
    borderRadiusLG: 10,
    fontSize: 14,
    controlHeight: 34,
    wireframe: false,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },
  components: {
    Layout: {
      headerBg: 'transparent',
      bodyBg: 'transparent',
      siderBg: 'transparent',
      headerHeight: 56,
      headerPadding: '0 24px'
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemColor: '#57606a',
      itemHoverBg: '#f2f4f7',
      itemHoverColor: '#1f2328',
      itemSelectedBg: '#eef4ff',
      itemSelectedColor: '#1d4ed8',
      itemBorderRadius: 7,
      itemHeight: 40,
      itemMarginInline: 0,
      iconMarginInlineEnd: 10
    },
    Card: {
      headerBg: 'transparent',
      colorBgContainer: '#ffffff',
      borderRadiusLG: 10,
      headerFontSize: 14
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: 'transparent'
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      fontWeight: 500
    },
    Progress: {
      remainingColor: '#eef0f3',
      defaultColor: '#2563eb'
    },
    List: {
      colorSplit: '#eef0f3'
    },
    Tag: {
      defaultBg: '#f4f5f7',
      defaultColor: '#57606a',
      borderRadiusSM: 5
    }
  }
}

// 日期组件的中文显示依赖 dayjs 自身的 locale，和 antd 的 zhCN 是两套
dayjs.locale('zh-cn')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={lightConfig} locale={zhCN}>
      {/* 全局数据层：项目与任务的状态、动作都从这里下发 */}
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </ConfigProvider>
  </StrictMode>
)
