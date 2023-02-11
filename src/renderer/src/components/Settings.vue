<template>
  <q-card class="dialog">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Settings</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <q-checkbox v-model="steam" label="Use Steam" />

      <q-input v-model="gamePath" label="Game path" spellcheck="false" :disable="$store.state.settings.steam">
        <template v-slot:append>
          <q-btn flat @click="browseFile">...</q-btn>
        </template>
      </q-input>
      <q-input v-model="modsPath" label="Mods Directory" spellcheck="false">
        <template v-slot:append>
          <q-btn flat @click="browseFolder">...</q-btn>
        </template>
      </q-input>
      <q-input v-model="modsSource" label="Mods Source" spellcheck="false" />
      <q-checkbox v-model="autoClose" label="Automatically close after launching game" />
      <q-space />
      <q-checkbox v-model="debugMode" label="Debug mode" />
    </q-card-section>
  </q-card>
</template>

<script>

export default {
  name: 'settings-card',
  
  computed: {
    steam: {
      get() { return this.$store.state.settings.steam },
      set(value) { this.$store.commit('setSetting', { settingName: 'steam', value }) }
    },
    debugMode: {
      get() { return this.$store.state.settings.debugMode },
      set(value) { this.$store.commit('setSetting', { settingName: 'debugMode', value }) }
    },
    gamePath: {
      get() { return this.$store.state.settings.gamePath },
      set(value) { this.$store.commit('setSetting', { settingName: 'gamePath', value }) }
    },
    modsPath: {
      get() { return this.$store.state.settings.modsPath },
      set(value) { this.$store.commit('setSetting', { settingName: 'modsPath', value }) }
    },
    modsSource: {
      get() { return this.$store.state.settings.modsSource },
      set(value) { this.$store.commit('setSetting', { settingName: 'modsSource', value }) }
    },
    autoClose: {
      get() { return this.$store.state.settings.autoClose },
      set(value) { this.$store.commit('setSetting', { settingName: 'autoClose', value }) }
    }
  },

  methods: {
    browseFile() {
      window.ipc.invoke('OPEN_FILE_DIALOG').then(payload => {
        if (payload.canceled || payload.filePaths === undefined || payload.filePaths.length === 0)
          return;
        
        this.gamePath = payload.filePaths[0];
      })
    },
    browseFolder() {
      window.ipc.invoke('OPEN_FOLDER_DIALOG').then(payload => {
        if (payload.canceled || payload.filePaths === undefined || payload.filePaths.length === 0)
          return;
        
        this.modsPath = payload.filePaths[0];
      })
    }
  }
}
</script>

<style scoped>
.dialog {
  padding: 10px;
  width: 700px;
  max-width: 80vw;
}
</style>