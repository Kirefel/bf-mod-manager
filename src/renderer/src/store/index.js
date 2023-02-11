import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {
      steam: true,
      gamePath: "",
      modsPath: "",
      autoClose: true,
      debugMode: false,
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
          enabled: id === "ModLoader",
          version
        }
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
      console.log(`Installing ${modInfo.name}`)

      const versionID = version !== 'latest' ? version : modInfo.versions[0].version

      return new Promise((resolve, reject) => {
        window.ipc.invoke('DOWNLOAD_TO_DIRECTORY', { 
          downloadUrl: modInfo.versions.find(v => v.version == versionID).url,
          modsPath: context.state.settings.modsPath,
          modName: id
        }).catch(err => {
          console.log('rejecting')
          context.commit('setInstalling', { id, value: false })
          // context.commit('setInstalled', { id, installed: true, version: versionID })
          
          context.dispatch('saveInstallState')
  
          reject(err)
        }).then(() => {
          console.log('resolving')
          context.commit('setInstalling', { id, value: false })
          context.commit('setInstalled', { id, installed: true, version: versionID })
          
          context.dispatch('saveInstallState')
  
          resolve()
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
      
      // fetch(context.state.settings.modsSource).then(res => res.json()).then(list => {
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
