<template>
  <q-item>
    <q-item-section side top v-if="isInstalled">
      <q-checkbox :disable="mod.required" v-model="enabled" :title="mod.required ? 'This mod is required and can\'t be disabled': ''" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ mod.name }} <q-badge v-if="isInstalled" :label="install.version" rounded /></q-item-label>
      <q-item-label caption lines="2"> {{ mod.description }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn-group flat>
        <q-btn v-if="!isInstalled || !upToDate" icon="file_download" :title="upToDate ? 'Download' : 'Update available'" @click="download('latest')" :loading="$store.getters.isDownloading(modID)">
          <q-badge v-if="!upToDate" floating rounded color="blue" />
        </q-btn>
        <q-btn icon="delete" title="Uninstall mod" v-if="isInstalled" @click="deleteDialog = true" />
        <q-btn icon="launch" :title="mod.url" :href="mod.url" target="_blank" />
      </q-btn-group>
    </q-item-section>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you wish to delete {{ mod.name }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Delete" color="negative" v-close-popup @click="uninstall" />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-menu touch-position context-menu v-if="!$store.getters.isDownloading(modID)">
      <q-list dense>
        <q-item clickable v-close-popup v-if="!isInstalled" @click="download('latest')">
          <q-item-section>Install latest</q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="isInstalled && !upToDate" @click="download('latest')">
          <q-item-section>Install update</q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="isInstalled" @click="download(install.version)">
          <q-item-section>Reinstall</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="downloadVersionDialog = true">
          <q-item-section>Install version...</q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="isInstalled" @click="deleteDialog = true">
          <q-item-section>Uninstall</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup :href="mod.url" target="_blank">
          <q-item-section>Open in browser</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <q-dialog v-model="downloadVersionDialog">
      <q-card class="download-dialog">
        <q-card-section>
          <q-select label="Version" :options="availableVersions" v-model="selectedVersion" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Install" v-close-popup :disable="selectedVersion === null" @click="download(selectedVersion)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<script>
import { ref } from 'vue'
import { age } from '../modFuncs'
import { useQuasar } from 'quasar'

export default {
  name: 'mod-item',

  props: {
    modID: String
  },

  setup() {
    return {
      deleteDialog: ref(false),
      downloadVersionDialog: ref(false),
      selectedVersion: ref(null),
      quasar: useQuasar()
    }
  },

  methods: {
    download(selected) {
      this.$store.dispatch('installMod', { id: this.modID, version: selected })
        .catch(err => {
          this.quasar.notify({ 
            type: 'negative',
            message: 'Error downloading mod: ' + err
          })
        })
    },
    uninstall() {
      this.$store.dispatch('uninstallMod', this.modID)
    }
  },

  computed: {
    mod() {
      return this.$store.state.modList[this.modID]
    },
    install() {
      return this.$store.state.installed[this.modID]
    },
    isInstalled() {
      return this.install !== undefined;
    },
    enabled: {
      get() {
        return this.mod.required || (this.isInstalled && this.install.enabled);
      },
      set(value) {
        this.$store.commit('enableMod', { id: this.modID, enabled: value })
      }
    },
    upToDate() {
      if (!this.isInstalled)
        return true
      
      return age(this.mod, this.install.version) === 0
    },
    availableVersions() {
      return this.mod.versions.map(x => x.version)
    }
  }
}
</script>
<style scoped>
.downloaded-icon {
  font-size: 1.715em;
  top: 7px;
  right: 16px;
}

.download-dialog {
  padding: 10px;
  width: 300px;
  max-width: 80vw;
}
</style>