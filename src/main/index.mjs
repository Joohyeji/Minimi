import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import brightness from 'brightness'
import loudness from 'loudness'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

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

const downloadImage = async (imageUrl) => {
  const userDataPath = app.getPath('userData')
  const downloadsPath = path.join(userDataPath, 'downloads')

  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath, { recursive: true })
  }

  const imagePath = path.join(downloadsPath, 'downloaded_wallpaper.jpg')

  const writer = fs.createWriteStream(imagePath)

  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(imagePath))
      writer.on('error', reject)
    })
  } catch (error) {
    console.error('Error downloading image:', error)
    throw error
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

  ipcMain.handle('set-wallpaper', async (event, imageUrl) => {
    try {
      const imagePath = await downloadImage(imageUrl)
      const { setWallpaper } = await import('wallpaper')

      await setWallpaper(imagePath)

      return true
    } catch (error) {
      console.error('Error setting wallpaper:', error)
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
