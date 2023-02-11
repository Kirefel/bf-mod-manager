import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createWriteStream, existsSync, readFile, writeFile, rmSync } from 'fs'
import decompress from 'decompress'
import { get } from 'https'
import { autoUpdater } from 'electron-updater'
import { execFile } from 'child_process'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1976D2',
      symbolColor: '#ffffff'
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
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

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()
})

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
const { ipcMain, dialog } = require('electron');

ipcMain.handle('OPEN_FILE_DIALOG', event => {
  return new Promise(resolve => {
    dialog.showOpenDialog({ properties: ['openFile']}).then(x => {
      resolve({ ...x });
    })
  })
});

ipcMain.handle('OPEN_FOLDER_DIALOG', event => {
  return new Promise(resolve => {
    dialog.showOpenDialog({ properties: ['openDirectory']}).then(x => {
      resolve({ ...x });
    })
  })
});

ipcMain.on('SAVE_SETTINGS', (event, data) => {
  const path = join(app.getPath('userData'), 'config.json')
  writeFile(path, JSON.stringify(data), err => {
    if (err) {
      console.log(err)
    }
  })
})

ipcMain.handle('LOAD_SETTINGS', event => {
  const path = join(app.getPath('userData'), 'config.json')
  return new Promise(resolve => {
    readFile(path, (err, data) => {
      if (!err && data) {
        const json = JSON.parse(data.toString())
        resolve(json)
      } else {
        resolve(null)
      }
    })
  })
})

ipcMain.on('SAVE_MOD_STATE', (event, { path, data }) => {
  const file = join(path, 'manifest.json')
  writeFile(file, JSON.stringify(data, null, 2), err => {
    if (err) {
      console.log(err)
    }
  })
})

ipcMain.handle('LOAD_MOD_STATE', (event, path) => {
  const file = join(path, 'manifest.json')

  return new Promise(resolve => {
    readFile(file, (err, data) => {
      if (!err && data) {
        const json = JSON.parse(data.toString())
        resolve(json)
      } else {
        resolve(null)
      }
    })

  })
})

ipcMain.on('LAUNCH', (event, { exePath, modsPath, autoClose }) => {
  const injectorExe = join(modsPath, 'ModLoader', 'Injector.exe')

  const command = `"${injectorExe}" "${exePath}"`

  console.log(`Executing ${command}`)

  var proc = execFile(injectorExe, [ exePath ], {
    cwd: join(modsPath, 'ModLoader')
  })

  // TODO if debug mode, attach stdout and log
  proc.stdout.on('data', s => {
    console.log(s)
  })

  if (autoClose) {
    setTimeout(() => {
      app.quit()
    }, 5000);
  }
})

function download(url, destination) {
  return new Promise((resolve, reject) => {
    get(url, res => {
      if (res.statusCode === 200) {
        const stream = createWriteStream(destination)
        res.on('close', resolve)
        res.on('error', reject)
        res.pipe(stream)
      } else if (res.statusCode == 302) {
        console.log(`Redirect to ${res.headers.location}`)
        resolve(download(res.headers.location, destination))
      } else {
        reject(`Failed to download ${url}: ${res.statusCode} ${res.statusMessage}`)
      }
    }).on('error', () => {
      reject()
    })
  })
}

ipcMain.handle('DOWNLOAD_TO_DIRECTORY', (event, { downloadUrl, modsPath, modName }) => {
  const outputDir = join(modsPath, modName)

  const tmp = require('tmp')

  console.log(`Will download ${downloadUrl} to ${outputDir}`)
  
  return new Promise((resolve, reject) => {

    tmp.file((err, path, fd, removeCallback) => {

      if (err) {
        console.log(err)
        reject(err)
        return
      }

      console.log(`Downloading ${path}`)

      download(downloadUrl, path).then(() => {
        
        console.log('Downloaded!')

        if (existsSync(outputDir)) {
          console.log('Removing existing install')
          // Delete the old one if it exists
          rmSync(outputDir, { recursive: true, force: true })
        }
    
        // extract to new location
        console.log(`Decompressing ${path} to ${outputDir}`)

        decompress(path, outputDir).then(() => {
          console.log('Successfully installed ' + modName)
          removeCallback()
          resolve()
          return
        }).catch(reason => {
          console.log(reason)
          reject(reason)
          return
        })

      }).catch(err => {
        reject(err)
      })
    
    })
  })
})

ipcMain.handle('DELETE_MOD', (event, { modsPath, modName }) => {
  const modDir = join(modsPath, modName)
  return new Promise((resolve) => {

    if (existsSync(modDir)) {
      console.log('Removing ' + modDir)
      rmSync(modDir, { recursive: true, force: true })
    }

    resolve()
  })
})

ipcMain.handle('DOWNLOAD_MODLIST', (event, { url }) => {

  return new Promise((resolve) => {
    get(url, res => {

      let data = []
      console.log('Status Code:', res.statusCode)
    
      res.on('data', chunk => {
        data.push(chunk)
      });
    
      res.on('end', () => {
        console.log('Response ended: ')
        resolve(JSON.parse(Buffer.concat(data).toString()).mods)
      });
      
    }).on('error', err => {
      console.log('Error: ', err.message);
    });
  })
})