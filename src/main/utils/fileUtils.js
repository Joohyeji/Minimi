import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

const getTargetPathFromLnk = async (filePath) => {
  try {
    const { stdout } = await execPromise(
      `powershell -command "((New-Object -ComObject WScript.Shell).CreateShortcut('${filePath}')).TargetPath"`
    )
    return stdout.trim()
  } catch (error) {
    console.error('Error reading .lnk file:', error)
    return null
  }
}

const getUserExecutables = async () => {
  const options = []
  const startMenuPaths = [
    path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
    path.join(process.env.PROGRAMDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs')
  ]

  for (const startMenuPath of startMenuPaths) {
    if (fs.existsSync(startMenuPath)) {
      try {
        const files = fs.readdirSync(startMenuPath)

        for (const file of files) {
          const fullPath = path.join(startMenuPath, file)
          const stats = fs.statSync(fullPath)

          if (stats.isFile() && file.endsWith('.lnk')) {
            const targetPath = await getTargetPathFromLnk(fullPath)
            if (targetPath) {
              options.push({
                value: targetPath,
                label: path.basename(targetPath).replace(/\.exe$/i, ''),
                path: targetPath
              })
            }
          }
        }
      } catch (err) {
        console.error('Error reading Start Menu directory:', err)
      }
    }
  }

  return options
}

export { getUserExecutables }
