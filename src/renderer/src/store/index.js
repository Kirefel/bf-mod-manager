import { createStore } from 'vuex'

export default createStore({
  state: {
    settings: {
      steam: false,
      gamePath: "",
      modsPath: "",
      debugMode: false,
      modsSource: ""
    },
    loading: false,
    modList: { }
  },
  mutations: {
    setSetting(state, { settingName, value }) {
      state.settings[settingName] = value
    },
    setLoading(state, value) {
      state.loading = value
    }
  },
  actions: {
    loadList(context) {
      console.log(`Beginning load from ${context.state.settings.modsSource}`)
      this.commit('setLoading', true);
      
      setTimeout(() => {
        this.commit('setLoading', false);
      }, 2000);
    }
  }
})
