import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {
      steam: false,
      gamePath: "",
      modsPath: "",
      debugMode: false,
      modsSource: ""
    }
  },
  mutations: {
    setSetting(state, { settingName, value }) {
      state.settings[settingName] = value
    }
  },
  actions: {
    
  }
})
