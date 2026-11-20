// src/renderer/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import App from './App'
import './App.css'

/**
 * 深色科技风主题：
 * - algorithm: darkAlgorithm 让 antd 全组件切到暗色基底
 * - token: 统一控制主色、底色、圆角、字号，避免各处零散写死颜色
 * - components: 针对 Layout / Menu / Card / Modal 做定点微调
 */
const darkConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#38bdf8',
    colorInfo: '#38bdf8',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#f87171',

    colorBgBase: '#080c11',
    colorBgLayout: '#080c11',
    colorBgContainer: '#0e151d',
    colorBgElevated: '#141d28',

    colorText: '#e6edf3',
    colorTextSecondary: '#9fb0c3',
    colorTextTertiary: '#6b7c8f',
    colorTextQuaternary: '#4d5b6b',

    colorBorder: 'rgba(255, 255, 255, 0.10)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.07)',

    borderRadius: 10,
    fontSize: 14,
    controlHeight: 36,
    wireframe: false,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },
  components: {
    Layout: {
      headerBg: 'transparent',
      bodyBg: 'transparent',
      siderBg: 'transparent',
      headerHeight: 58,
      headerPadding: '0 24px'
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemColor: '#9fb0c3',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.05)',
      darkItemSelectedBg: 'rgba(56, 189, 248, 0.14)',
      darkItemSelectedColor: '#e0f2fe',
      itemBorderRadius: 10,
      itemHeight: 42,
      itemMarginInline: 0
    },
    Card: {
      headerBg: 'transparent',
      colorBgContainer: 'rgba(255, 255, 255, 0.03)',
      borderRadiusLG: 14
    },
    Modal: {
      contentBg: '#141d28',
      headerBg: 'transparent'
    },
    Progress: {
      remainingColor: 'rgba(255, 255, 255, 0.08)'
    },
    List: {
      colorSplit: 'rgba(255, 255, 255, 0.08)'
    }
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={darkConfig}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
