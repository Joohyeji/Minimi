import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getUserExecutables } from './utils/fileUtils'
import icon from '../../resources/icon.png'

import brightness from 'brightness'
import loudness from 'loudness'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'
import sqlite3 from 'sqlite3'
import plist from 'plist'
import { execFile } from 'child_process'

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
    },
    icon: path.join(__dirname, '../../resources/icon.png')
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

  ipcMain.handle('get-wallpaper', async () => {
    try {
      const { getWallpaper } = await import('wallpaper')
      const currentWallpaper = await getWallpaper()
      return currentWallpaper
    } catch (error) {
      console.error('Error getting wallpaper:', error)
      return null
    }
  })

  ipcMain.handle('set-wallpaper', async (event, imageUrl) => {
    try {
      let imagePath

      if (imageUrl.startsWith('https://firebasestorage')) {
        imagePath = await downloadImage(imageUrl)
      } else {
        imagePath = imageUrl
      }

      const { setWallpaper } = await import('wallpaper')
      await setWallpaper(imagePath)

      return true
    } catch (error) {
      console.error('Error setting wallpaper:', error)
      return false
    }
  })

  ipcMain.handle('get-executables', async () => {
    try {
      return await getUserExecutables()
    } catch (error) {
      console.error('Error getting user executables:', error)
      return []
    }
  })

  ipcMain.handle('run-executables', (event, executablePaths) => {
    if (Array.isArray(executablePaths)) {
      executablePaths.forEach((executablePath) => {
        if (fs.existsSync(executablePath)) {
          execFile(executablePath, (err, data) => {
            if (err) {
              console.error(`Error executing file ${executablePath}:`, err)
            } else {
              console.log(`Executable output from ${executablePath}:`, data)
            }
          })
        } else {
          console.error(`Executable path does not exist: ${executablePath}`)
        }
      })
    } else {
      console.error('Invalid argument: executablePaths should be an array')
    }
  })

  ipcMain.handle('get-bookmarks', async (event, browser) => {
    if (!browser) {
      return
    }
    try {
      let bookmarks
      const platform = os.platform()

      if (browser === 'chrome' || browser === 'edge') {
        let bookmarksPath
        if (platform === 'win32') {
          bookmarksPath = path.join(
            os.homedir(),
            'AppData',
            'Local',
            browser === 'chrome' ? 'Google' : 'Microsoft',
            browser === 'chrome' ? 'Chrome' : 'Edge',
            'User Data',
            'Default',
            'Bookmarks'
          )
        } else if (platform === 'darwin') {
          bookmarksPath = path.join(
            os.homedir(),
            'Library',
            'Application Support',
            browser === 'chrome' ? 'Google' : 'Microsoft',
            browser === 'chrome' ? 'Chrome' : 'Edge',
            'Default',
            'Bookmarks'
          )
        } else if (platform === 'linux') {
          bookmarksPath = path.join(
            os.homedir(),
            '.config',
            browser === 'chrome' ? 'google-chrome' : 'microsoft-edge',
            'Default',
            'Bookmarks'
          )
        } else {
          throw new Error('Unsupported platform')
        }

        const data = fs.readFileSync(bookmarksPath, 'utf-8')
        bookmarks = JSON.parse(data).roots.bookmark_bar.children
      } else if (browser === 'firefox') {
        let profileDir
        if (platform === 'win32') {
          profileDir = path.join(
            os.homedir(),
            'AppData',
            'Roaming',
            'Mozilla',
            'Firefox',
            'Profiles'
          )
        } else if (platform === 'darwin' || platform === 'linux') {
          profileDir = path.join(
            os.homedir(),
            'Library',
            'Application Support',
            'Firefox',
            'Profiles'
          )
        } else {
          throw new Error('Unsupported platform')
        }

        const profiles = fs.readdirSync(profileDir)
        const profilePath = path.join(profileDir, profiles[0])
        const dbPath = path.join(profilePath, 'places.sqlite')

        const db = new sqlite3.Database(dbPath)
        const rows = await new Promise((resolve, reject) => {
          db.all(
            'SELECT moz_bookmarks.title, moz_places.url FROM moz_bookmarks JOIN moz_places ON moz_bookmarks.fk = moz_places.id WHERE moz_bookmarks.type = 1',
            (err, rows) => {
              if (err) {
                reject(err)
              } else {
                resolve(rows)
              }
            }
          )
        })

        db.close()
        bookmarks = rows
      } else if (browser === 'safari') {
        if (platform !== 'darwin') {
          throw new Error('Safari bookmarks can only be accessed on macOS')
        }

        const bookmarksPath = path.join(os.homedir(), 'Library', 'Safari', 'Bookmarks.plist')
        const data = fs.readFileSync(bookmarksPath, 'utf-8')
        bookmarks = plist.parse(data).Children
      } else if (browser === 'whale') {
        let bookmarksPath
        if (platform === 'win32') {
          bookmarksPath = path.join(
            os.homedir(),
            'AppData',
            'Local',
            'Naver',
            'Naver Whale',
            'User Data',
            'Default',
            'Bookmarks'
          )
        } else if (platform === 'darwin') {
          bookmarksPath = path.join(
            os.homedir(),
            'Library',
            'Application Support',
            'Naver',
            'Naver Whale',
            'Default',
            'Bookmarks'
          )
        } else if (platform === 'linux') {
          bookmarksPath = path.join(os.homedir(), '.config', 'Naver Whale', 'Default', 'Bookmarks')
        } else {
          throw new Error('Unsupported platform')
        }

        const data = fs.readFileSync(bookmarksPath, 'utf-8')
        bookmarks = JSON.parse(data).roots.bookmark_bar.children
      } else {
        throw new Error('Unsupported browser')
      }

      return bookmarks
    } catch (error) {
      console.error(`Error getting bookmarks for ${browser}:`, error)
      throw error
    }
  })

  ipcMain.handle('update-bookmarks', async (event, browser, newBookmarks) => {
    try {
      let bookmarksPath
      const platform = os.platform()

      if (browser === 'chrome' || browser === 'edge') {
        bookmarksPath = path.join(
          os.homedir(),
          platform === 'win32'
            ? `AppData\\Local\\${browser === 'chrome' ? 'Google\\Chrome\\User Data\\Default\\Bookmarks' : 'Microsoft\\Edge\\User Data\\Default\\Bookmarks'}`
            : platform === 'darwin'
              ? `Library/Application Support/${browser === 'chrome' ? 'Google/Chrome/Default/Bookmarks' : 'Microsoft/Edge/Default/Bookmarks'}`
              : `.config/${browser === 'chrome' ? 'google-chrome/Default/Bookmarks' : 'microsoft-edge/Default/Bookmarks'}`
        )
      } else {
        throw new Error('Unsupported browser for update')
      }

      const bookmarksData = {
        checksum: '',
        roots: {
          bookmark_bar: {
            children: newBookmarks.map((bookmark) => ({
              date_added: bookmark.date_added || new Date().getTime().toString(),
              date_last_used: bookmark.date_last_used || new Date().getTime().toString(),
              guid: bookmark.guid || '',
              id: bookmark.id || new Date().getTime().toString(),
              meta_info: bookmark.meta_info || {},
              name: bookmark.name,
              type: bookmark.type || 'url',
              url: bookmark.url || ''
            })),
            date_added: new Date().getTime().toString(),
            date_modified: new Date().getTime().toString(),
            id: '1',
            name: 'Bookmarks Bar',
            type: 'folder'
          },
          other: {
            children: [],
            id: '2',
            name: 'Other Bookmarks',
            type: 'folder'
          },
          synced: {
            children: [],
            id: '3',
            name: 'Mobile Bookmarks',
            type: 'folder'
          }
        },
        version: 1
      }

      fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarksData, null, 2), 'utf-8')
      return { success: true }
    } catch (error) {
      console.error(`Error updating bookmarks for ${browser}:`, error)
      throw error
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
