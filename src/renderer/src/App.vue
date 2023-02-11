<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Ori Launcher</q-toolbar-title>
        <q-btn icon="refresh" flat round title="Refresh" @click="refresh" />
        <q-btn icon="settings" flat round title="Open Settings" @click="settingsVisible = true" />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="settingsVisible" @hide="saveSettings">
      <settings />
    </q-dialog>

    <q-page-container>
      <q-list bordered separator>

        <q-inner-loading :showing="$store.state.loading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="!$store.state.loading">
          <q-item-label header>Installed</q-item-label>
          <q-separator spaced />
          <mod-item v-for="id in installedMods" :key="id" :modID="id" />
          <q-item-label header>Available</q-item-label>
          <q-separator spaced />
          <mod-item v-for="id in availableMods" :key="id" :modID="id" />
        </div>
      </q-list>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-space />
        <q-btn color="green" :loading="$store.getters.anyDownloads" @click="launch">
          <span>Launch</span>
          <template v-slot:loading>
            <q-spinner-dots />
          </template>
        </q-btn>
        <q-space />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import ModItem from './components/ModItem.vue'
import Settings from './components/Settings.vue'
import { ref } from 'vue'

export default {
  components: {
    ModItem,
    Settings
  },

  setup() {
    return {
      settingsVisible: ref(false)
    }
  },

  mounted() {
    window.ipc.on('LOAD_SETTINGS', payload => {
      if (payload !== null) {
        this.$store.commit('setAllSettings', payload)
      }

      this.refresh()
    })

    window.ipc.on('LOAD_MOD_STATE', payload => {
      if (payload !== null) {
        this.$store.commit('setInstallState', payload)
      }
    })

    window.ipc.send('LOAD_SETTINGS')
  },

  computed: {
    installedMods() {
      return Object.keys(this.$store.state.modList).filter(x => this.$store.getters.isInstalled(x))
    },
    availableMods() {
      return Object.keys(this.$store.state.modList).filter(x => !this.$store.getters.isInstalled(x))
    }
  },

  methods: {
    saveSettings() {
      this.$store.dispatch('saveSettings')
    },
    refresh() {
      // TODO default value for mod install path
      window.ipc.send('LOAD_MOD_STATE', this.$store.state.settings.modsPath)
      this.$store.dispatch('loadList')
    },
    launch() {
      // if mod loader is not installed, do it now
      // then do the actual launch
      if (this.$store.state.installed.ModLoader === undefined) {
        this.$store.dispatch('installMod', { id: 'ModLoader', version: 'latest' })
          .then(() => {
            this.$store.dispatch('saveInstallState')
            console.log("LAUNCHING!")
            //   window.ipc.send('LAUNCH') // TODO launch params
          })
      } else {
        this.$store.dispatch('saveInstallState')
        console.log("LAUNCHING!")
        // window.ipc.send('LAUNCH')
      }
    }
  }
}
</script>

<style lang="scss">
body {
  user-select: none;
}
</style>
