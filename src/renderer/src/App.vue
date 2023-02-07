<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Ori Launcher</q-toolbar-title>
        <q-btn icon="refresh" flat round title="Refresh" @click="refresh" />
        <q-btn icon="settings" flat round title="Open Settings" @click="settingsVisible = true" />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="settingsVisible">
      <settings />
    </q-dialog>

    <q-page-container>
      <q-list bordered separator>

        <q-inner-loading :showing="$store.state.loading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="!$store.state.loading">
          <mod-item v-for="id in Object.keys($store.state.modList)" :key="id" :modID="id" />
        </div>
      </q-list>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-space />
        <q-btn color="green">Launch</q-btn>
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

  methods: {
    refresh() {
      this.$store.dispatch('loadList')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
