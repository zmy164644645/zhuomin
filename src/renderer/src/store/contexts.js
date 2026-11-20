import { createContext } from 'react'

/**
 * context 单独放在这个文件里：
 * 1) 组件文件只导出组件，开启 Fast Refresh 时热更新不会整页刷新；
 * 2) hooks 与 Provider 都从这里取，不会产生循环依赖。
 */
export const ProjectsStateContext = createContext(null)
export const ProjectsActionsContext = createContext(null)
