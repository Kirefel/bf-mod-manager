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
    installed: { }
  },
  mutations: {
    setSetting(state, { settingName, value }) {
      state.settings[settingName] = value
    },
    setLoading(state, value) {
      state.loading = value
    },
    setModList(state, value) {
      state.modList = value
    },
    setInstalled(state, value) {
      state.installed = value
    },
    enableMod(state, { id, enabled }) {
      if (state.installed[id] === undefined) {
        state.installed[id] = {
          enabled
        }
      } else {
        state.installed[id].enabled = enabled
      }
    }
  },
  actions: {
    loadList(context) {
      console.log(`Beginning load from ${context.state.settings.modsSource}`)
      this.commit('setLoading', true);
      
      setTimeout(() => {

        this.commit('setInstalled', {
          ModLoader: {
            enabled: true
          },
          QoL: {
            enabled: true
          },
          Rando: {
            enabled: false
          }
        })

        this.commit('setModList', {
          ModLoader: {
            name: "Mod Loader",
            description: "(Required) Enables modding of the game",
            required: true
          },
          QoL: {
            name: "Quality of Life",
            description: "Adds many QoL and accessibility features such as screen shake reduction and more save slots"
          },
          DebugEnhanced: {
            name: "Enhanced Debug",
            description: "Adds more debug features"
          },
          Rando: {
            name: "Rando",
            description: "You know what this is"
          },
          RandoBeta: {
            name: "Rando Beta",
            description: "Upcoming rando releases"
          },
          SceneExplorer: {
            name: "Scene Explorer",
            description: "A utility for exploring the Unity objects and components"
          },
          SRDC: {
            name: "Speedrun.com",
            description: "Replaces the in-game leaderboards with ones sourced from speedrun.com"
          }
        })

        this.commit('setLoading', false);
      }, 500);
    }
  }
})
