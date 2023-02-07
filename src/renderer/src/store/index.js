import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {
      steam: false,
      gamePath: "",
      debugMode: false
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setSetting(state, { settingName, value }) {
      state.settings[settingName] = value
    }
  },
  actions: {
    
  }
})
