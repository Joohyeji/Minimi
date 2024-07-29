const updateComputerSetting = async (brightness, volume, wallpaper, executables, bookmarks) => {
  if (brightness !== null) {
    await window.api.setBrightness(brightness * 0.01)
  }
  if (volume !== null) {
    if (volume == 0) {
      await window.api.setMuted(true)
    } else {
      await window.api.setMuted(false)
    }
    await window.api.setVolume(volume)
  }
  if (wallpaper !== null) {
    await window.api.setWallpaper(wallpaper)
  }
  if (executables !== null) {
    await window.api.runExecutables(executables)
  }
  if (bookmarks) {
    const { bookmarks: minimiBookmarks, selectedBrowser: minimiBrowser } = bookmarks
    await window.api.updateBookmarks(minimiBrowser, minimiBookmarks)
  }
}

export default updateComputerSetting
