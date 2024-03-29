<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white q-electron-drag">
      <q-toolbar>
        <span style="width: 65px" v-if="platform == 'darwin'" />
        <avatar-icon />
        <q-toolbar-title>Ori and the Blind Forest Mod Manager</q-toolbar-title>
        <q-btn icon="refresh" flat round title="Refresh" @click="refresh" :disable="$store.state.loading" />
        <q-btn icon="settings" flat round title="Open Settings" @click="settingsVisible = true" />
        <span style="width: 150px" v-if="platform == 'win32'" />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="settingsVisible" @hide="saveSettings">
      <settings />
    </q-dialog>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="column full-height">
            <q-scroll-area class="col" style="padding:0;">
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
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="text-white">
      <q-toolbar>
        <q-space />
        <q-btn color="green" :loading="$store.getters.anyDownloads" @click="clickLaunch" :disable="launchNotConfigured" :title="launchNotConfigured ? 'Open settings to configure launch' : ''">
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
import AvatarIcon from './components/AvatarIcon.vue'
import { ref } from 'vue'

export default {
  components: {
    ModItem,
    Settings,
    AvatarIcon
  },

  setup() {
    return {
      settingsVisible: ref(false)
    }
  },

  mounted() {
    window.ipc.invoke('LOAD_SETTINGS').then(payload => {
      if (payload !== null) {
        this.$store.commit('setAllSettings', payload)
      }

      this.refresh()
    })
  },

  computed: {
    platform() {
      return window.api.platform()
    },
    installedMods() {
      return Object.keys(this.$store.state.modList).filter(x => this.$store.getters.isInstalled(x))
    },
    availableMods() {
      return Object.keys(this.$store.state.modList).filter(x => !this.$store.getters.isInstalled(x))
    },
    launchNotConfigured() {
      const exePath = this.$store.state.settings.gamePath
      return !this.$store.state.settings.steam && (exePath === undefined || exePath === '')
    }
  },

  methods: {
    saveSettings() {
      this.$store.dispatch('saveSettings')
    },
    refresh() {
      // TODO default value for mod install path
      window.ipc.invoke('LOAD_MOD_STATE', this.$store.state.settings.modsPath).then(payload => {
        if (payload !== null) {
          this.$store.commit('setInstallState', payload)
        }
      })

      this.$store.dispatch('loadList')
    },
    clickLaunch() {
      // if mod loader is not installed, do it now
      // then do the actual launch
      if (this.$store.state.installed.ModLoader === undefined) {
        this.$store.dispatch('installMod', { id: 'ModLoader', version: 'latest' })
          .catch(err => {
            this.$q.notify({ 
              type: 'negative',
              message: 'Error downloading Mod Loader: ' + err
            })
          })
          .then(() => {
            this.launch()
          })
      } else {
        this.launch()
      }
    },
    launch() {
      this.$store.dispatch('saveInstallState')
      console.log("LAUNCHING!")
      window.ipc.send('LAUNCH', {
        exePath: this.$store.state.settings.steam ? 'steam://run/387290' : this.$store.state.settings.gamePath,
        modsPath: this.$store.state.settings.modsPath,
        autoClose: this.$store.state.settings.autoClose,
        debug: this.$store.state.settings.debugMode,
        doorstop: this.$store.state.settings.doorstop
      })
    }
  }
}
</script>

<style lang="scss">
body {
  user-select: none;
}

footer {
  background: linear-gradient(0deg, rgba(36,31,87,1) 0%, rgba(36,31,86,1) 100%);
}
// header {
//   background: linear-gradient(0deg, rgba(216,92,46,1) 0%, rgba(249,142,88,1) 100%);
// }
</style>
