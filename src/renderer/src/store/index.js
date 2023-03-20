import { createStore } from 'vuex'
import { latestReleasedVersion, isBeta } from '../modFuncs'

export default createStore({
  state: {
    settings: {
      steam: true,
      gamePath: "",
      modsPath: "",
      autoClose: true,
      debugMode: false,
      doorstop: true,
      modsSource: "https://raw.githubusercontent.com/Kirefel/ori-bf-mod-index/main/mods.json"
    },
    loading: false,
    modList: { },
    installed: { },
    inProgressDownloads: []
  },
  getters: {
    anyDownloads: state => {
      return state.inProgressDownloads.length > 0
    },
    isDownloading: state => id => {
      return state.inProgressDownloads.indexOf(id) !== -1
    },
    isInstalled: state => id => {
      return state.installed[id] !== undefined
    }
  },
  mutations: {
    setSetting(state, { settingName, value }) {
      state.settings[settingName] = value
    },
    setAllSettings(state, settings) {
      state.settings = { ...settings }
    },
    setLoading(state, value) {
      state.loading = value
    },
    setModList(state, value) {
      state.modList = value
    },
    setInstallState(state, value) {
      state.installed = value
    },
    setInstalled(state, { id, installed, version }) {
      if (state.installed[id] === undefined && installed) {
        state.installed[id] = {
          enabled: true,
          version
        }
      } else if (installed) {
        state.installed[id].version = version
      } else {
        delete state.installed[id]
      }
    },
    enableMod(state, { id, enabled }) {
      if (state.installed[id] === undefined) {
        state.installed[id] = {
          enabled
        }
      } else {
        state.installed[id].enabled = enabled
      }
    },
    setInstalling(state, { id, value }) {
      const index = state.inProgressDownloads.indexOf(id)
      if (!value) {
        if (index !== -1) {
          state.inProgressDownloads.splice(index, 1)
        }
      } else {
        if (index === -1) {
          state.inProgressDownloads.push(id)
        }
      }
    }
  },
  actions: {
    installMod(context, { id, version }) {
      
      const modInfo = context.state.modList[id]
      if (modInfo === undefined) {
        return
      }
      
      context.commit('setInstalling', { id, value: true })
      
      // Install latest version if currently on a beta version
      //  otherwise only install the latest stable version
      const versionID = version !== 'latest'
         ? version
         : context.state.installed[id] !== undefined && isBeta(context.state.installed[id].version)
            ? modInfo.versions[0].version
            : latestReleasedVersion(modInfo)

      console.log(`Installing ${modInfo.name} ${versionID}`)

      return new Promise((resolve, reject) => {
        window.ipc.invoke('DOWNLOAD_TO_DIRECTORY', { 
          downloadUrl: modInfo.versions.find(v => v.version == versionID).url,
          modsPath: context.state.settings.modsPath,
          modName: id
        }).then(() => {
          context.commit('setInstalling', { id, value: false })
          context.commit('setInstalled', { id, installed: true, version: versionID })
          
          context.dispatch('saveInstallState')
  
          resolve()
        }).catch(err => {
          context.commit('setInstalling', { id, value: false })
  
          reject(err)
        })
      })
    },
    uninstallMod(context, id) {
      context.commit('setInstalling', { id, value: true })
      return new Promise((resolve) => {
        window.ipc.invoke('DELETE_MOD', {
          modsPath: context.state.settings.modsPath,
          modName: id
        }).then(() => {
          context.commit('setInstalling', { id, value: false })
          context.commit('setInstalled', { id, installed: false })
          context.dispatch('saveInstallState')
          resolve()
        })
      })
    },
    loadList(context) {
      console.log(`Beginning load from ${context.state.settings.modsSource}`)
      context.commit('setLoading', true);
      
      window.ipc.invoke('DOWNLOAD_MODLIST', {
        url: context.state.settings.modsSource
      }).then(list => {
        context.commit('setModList', list)
        context.commit('setLoading', false)
      }).catch(() => {
        context.commit('setModList', {})
        context.commit('setLoading', false)
      })
    },
    saveSettings(context) {
      console.log('saving the settings!')
      window.ipc.send('SAVE_SETTINGS', { ...context.state.settings })
    },
    saveInstallState(context) {
      console.log('saving the installed mods!')
      window.ipc.send('SAVE_MOD_STATE', { path: context.state.settings.modsPath, data: JSON.parse(JSON.stringify(context.state.installed)) })
    }
  }
})
