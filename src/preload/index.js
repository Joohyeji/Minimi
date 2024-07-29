import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getBrightness: () => ipcRenderer.invoke('get-brightness'),
  setBrightness: (level) => ipcRenderer.invoke('set-brightness', level),
  getVolume: () => ipcRenderer.invoke('get-volume'),
  setVolume: (level) => ipcRenderer.invoke('set-volume', level),
  setMuted: (mute) => ipcRenderer.invoke('set-muted', mute),
  getWallpaper: () => ipcRenderer.invoke('get-wallpaper'),
  setWallpaper: (url) => ipcRenderer.invoke('set-wallpaper', url),
  getExecutables: () => ipcRenderer.invoke('get-executables'),
  runExecutables: (paths) => ipcRenderer.invoke('run-executables', paths),
  getBookmarks: (browser) => ipcRenderer.invoke('get-bookmarks', browser),
  updateBookmarks: (browser, bookmarks) =>
    ipcRenderer.invoke('update-bookmarks', browser, bookmarks)
}

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
