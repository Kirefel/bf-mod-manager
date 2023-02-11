import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {
      steam: false,
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
    setInstalled(state, { id, installed }) {
      if (state.installed[id] === undefined && installed) {
        state.installed[id] = {
          enabled: id === "ModLoader"
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
      
      const modInfo = this.state.modList[id]
      if (modInfo === undefined) {
        return
      }
      
      this.commit('setInstalling', { id, value: true })
      console.log(`Installing ${modInfo.name}`)

      return new Promise(resolve => {
        setTimeout(() => {
          this.commit('setInstalling', { id, value: false })
          this.commit('setInstalled', { id, installed: true })
          
          this.dispatch('saveInstallState')

          resolve()
        }, 5000);
      })
    },
    loadList(context) {
      console.log(`Beginning load from ${context.state.settings.modsSource}`)
      this.commit('setLoading', true);
      
      setTimeout(() => {
        this.commit('setModList', {
          ModLoader: {
            name: "Mod Loader",
            description: "(Required) Enables modding of the game",
            required: true,
            url: "https://github.com/ori-community/bf-modloader"
          },
          QoL: {
            name: "Quality of Life",
            description: "Adds many QoL and accessibility features such as screen shake reduction and more save slots",
            url: "https://github.com/Kirefel/OriDeQol"
          },
          InputConfig: {
            name: "Input Binding",
            description: "Adds input binding in-game and also allows rebinding controllers",
            url: "https://github.com/Kirefel/OriDeInputMod"
          },
          DebugEnhanced: {
            name: "Enhanced Debug",
            description: "Adds more debug features",
            url: "https://github.com/ori-community/bf-modloader"
          },
          Rando: {
            name: "Rando",
            description: "You know what this is",
            url: "https://github.com/ori-community/bf-modloader"
          },
          RandoBeta: {
            name: "Rando Beta",
            description: "Upcoming rando releases. Don't use alongside the release version of rando.",
            url: "https://github.com/ori-community/bf-modloader"
          },
          SceneExplorer: {
            name: "Scene Explorer",
            description: "A utility for exploring the Unity objects and components",
            url: "https://github.com/Kirefel/OriSceneExplorer"
          },
          SRDC: {
            name: "Speedrun.com",
            description: "Replaces the in-game leaderboards with ones sourced from speedrun.com",
            url: "https://github.com/Kirefel/OriDeSRDC"
          }
        })
        
        this.commit('setLoading', false);
      }, 500);
    },
    saveSettings(context) {
      console.log('saving the settings!')
      window.ipc.send('SAVE_SETTINGS', { ...context.state.settings })
    },
    saveInstallState(context) {
      console.log('saving the installed mods!')
      window.ipc.send('SAVE_MOD_STATE', { path: this.state.settings.modsPath, data: JSON.parse(JSON.stringify(this.state.installed)) })
    }
  }
})
