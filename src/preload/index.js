import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  /**
   * 打开系统文件夹选择对话框
   * @param {string} [defaultPath] 对话框默认定位到的目录
   * @returns {Promise<{ canceled: boolean, path: string }>}
   */
  selectFolder: (defaultPath) => ipcRenderer.invoke('dialog:select-folder', defaultPath),

  /**
   * 用系统文件管理器打开指定目录
   * @param {string} folderPath 目标目录的绝对路径
   * @returns {Promise<{ ok: boolean, message: string }>}
   */
  openFolder: (folderPath) => ipcRenderer.invoke('shell:open-folder', folderPath)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
