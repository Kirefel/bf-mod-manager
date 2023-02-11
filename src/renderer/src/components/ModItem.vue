<template>
  <q-item>
    <q-item-section side top>
      <q-checkbox :disable="mod.required || !isInstalled" v-model="enabled" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ mod.name }}</q-item-label>
      <q-item-label caption lines="2"> {{ mod.description }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn-group flat>
        <q-icon v-if="isInstalled" class="downloaded-icon" name="done" title="Up to date" />
        <q-btn v-if="!isInstalled" icon="file_download" title="Download" @click="download" :loading="$store.getters.isDownloading(modID)">
          <q-badge v-if="modID === 'ModLoader'" floating rounded color="blue">
            <!-- <q-icon name="info" /> -->
          </q-badge>
        </q-btn>
        <q-btn icon="launch" :title="mod.url" :href="mod.url" target="_blank" />
      </q-btn-group>
    </q-item-section>
  </q-item>
</template>

<script>
// TODO delete mods from disk with a button
export default {
  name: 'mod-item',

  props: {
    modID: String
  },

  methods: {
    download() {
      this.$store.dispatch('installMod', { id: this.modID, version: 'latest' })
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