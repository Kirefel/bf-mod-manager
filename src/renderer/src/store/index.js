import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {
      steam: true,
      gamePath: "",
      modsPath: "",
      debugMode: false,
      modsSource: "https://github.com/Kirefel/OriDeMods/index.json"
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
      
      setTimeout(() => {
        this.commit('setModList', {
          ModLoader: {
            name: "Mod Loader",
            description: "(Required) Enables modding of the game",
            required: true,
            url: "https://github.com/ori-community/bf-modloader",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          QoL: {
            name: "Quality of Life",
            description: "Adds many QoL and accessibility features such as screen shake reduction and more save slots",
            url: "https://github.com/Kirefel/OriDeQol",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          InputConfig: {
            name: "Input Binding",
            description: "Adds input binding in-game and also allows rebinding controllers",
            url: "https://github.com/Kirefel/OriDeInputMod",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          DebugEnhanced: {
            name: "Enhanced Debug",
            description: "Adds more debug features",
            url: "https://github.com/ori-community/bf-modloader",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          Rando: {
            name: "Rando",
            description: "You know what this is",
            url: "https://github.com/ori-community/bf-modloader",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          RandoBeta: {
            name: "Rando Beta",
            description: "Upcoming rando releases. Don't use alongside the release version of rando.",
            url: "https://github.com/ori-community/bf-modloader",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          SceneExplorer: {
            name: "Scene Explorer",
            description: "A utility for exploring the Unity objects and components",
            url: "https://github.com/Kirefel/OriSceneExplorer",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          },
          SRDC: {
            name: "Speedrun.com",
            description: "Replaces the in-game leaderboards with ones sourced from speedrun.com",
            url: "https://github.com/Kirefel/OriDeSRDC",
            versions: [
              {
                "version": "0.6.0-alpha",
                "url": "https://github.com/ori-community/bf-modloader/releases/download/v0.6.0-alpha/OriDeModLoader.zip"
              }
            ]
          }
        })
        
        context.commit('setLoading', false);
      }, 500);
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
