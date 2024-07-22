import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import brightness from 'brightness'
import loudness from 'loudness'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  })

  mainWindow.loadURL('https://localhost:5173')
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation') {
      callback(true)
    } else {
      callback(false)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('get-brightness', async () => {
    try {
      const currentBrightness = await brightness.get()
      return currentBrightness
    } catch (error) {
      console.error('Error getting brightness:', error)
      return null
    }
  })

  ipcMain.handle('set-brightness', async (event, level) => {
    try {
      await brightness.set(level)
      return true
    } catch (error) {
      console.error('Error setting brightness:', error)
      return false
    }
  })

  ipcMain.handle('get-volume', async () => {
    try {
      const currentVolume = await loudness.getVolume()
      return currentVolume
    } catch (error) {
      console.error('Error getting volume:', error)
      return null
    }
  })

  ipcMain.handle('set-volume', async (event, level) => {
    try {
      await loudness.setVolume(level)
      return true
    } catch (error) {
      console.error('Error setting volume:', error)
      return false
    }
  })

  ipcMain.handle('set-muted', async (event, level) => {
    try {
      await loudness.setMuted(level)
      return true
    } catch (error) {
      console.error('Error setting volume:', error)
      return false
    }
  })

  ipcMain.on('ping', () => console.log('pong'))

  process.env.GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
