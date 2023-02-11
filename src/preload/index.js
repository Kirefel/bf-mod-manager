import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// // Custom APIs for renderer
// const api = {}

// // Use `contextBridge` APIs to expose Electron APIs to
// // renderer only if context isolation is enabled, otherwise
// // just add to the DOM global.
// if (process.contextIsolated) {
//   try {
//     contextBridge.exposeInMainWorld('electron', electronAPI)
//     contextBridge.exposeInMainWorld('api', api)
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   window.electron = electronAPI
//   window.api = api
// }

const validChannels = [ 
  'OPEN_FILE_DIALOG',
  'OPEN_FOLDER_DIALOG',
  'SAVE_SETTINGS',
  'LOAD_SETTINGS',
  'SAVE_MOD_STATE',
  'LOAD_MOD_STATE',
  'DOWNLOAD_TO_DIRECTORY'
];
contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    invoke: (channel, args) => {
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args)
      }
    }
  },
);
