<template>
  <q-item>
    <q-item-section side top v-if="isInstalled">
      <q-checkbox :disable="mod.required || !isInstalled" v-model="enabled" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ mod.name }}</q-item-label>
      <q-item-label caption lines="2"> {{ mod.description }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn-group flat>
        <q-btn v-if="!isInstalled" icon="file_download" title="Download" @click="download" :loading="$store.getters.isDownloading(modID)">
          <q-badge v-if="modID === 'ModLoader'" floating rounded color="blue">
            <!-- <q-icon name="info" /> -->
          </q-badge>
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
  </q-item>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'mod-item',

  props: {
    modID: String
  },

  setup() {
    return {
      deleteDialog: ref(false)
    }
  },

  methods: {
    download() {
      this.$store.dispatch('installMod', { id: this.modID, version: 'latest' })
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
      return this.isInstalled;
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
</style>