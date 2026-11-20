import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    // 浅色主题：窗口底色同步为页面底色，避免启动时闪黑
    backgroundColor: '#f7f8fa',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 本地项目目录：打开系统文件夹选择对话框
  // 返回 { canceled: boolean, path: string }，渲染层据此回填表单
  ipcMain.handle('dialog:select-folder', async (event, defaultPath) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const options = {
      title: '选择本地实训项目所在文件夹',
      defaultPath: typeof defaultPath === 'string' && defaultPath ? defaultPath : undefined,
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: '选择文件夹'
    }
    // 有窗口时挂到窗口上（模态），否则退化为无父窗口对话框
    const result = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options)
    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, path: '' }
    }
    return { canceled: false, path: result.filePaths[0] }
  })

  // 用系统文件管理器打开项目目录
  ipcMain.handle('shell:open-folder', async (_event, folderPath) => {
    if (typeof folderPath !== 'string' || !folderPath.trim()) {
      return { ok: false, message: '目录路径为空' }
    }
    const error = await shell.openPath(folderPath)
    // openPath 成功时返回空字符串，失败时返回错误描述
    return error ? { ok: false, message: error } : { ok: true, message: '' }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
