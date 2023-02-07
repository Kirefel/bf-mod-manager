<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Ori Launcher</q-toolbar-title>
        <q-btn icon="settings" flat round @click="settingsVisible = true" />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="settingsVisible">
      <settings />
    </q-dialog>

    <q-page-container>
      <q-list bordered separator>
        <mod-item
          modTitle="Mod Loader"
          description="(Required) Enabled modding of the game"
          required
          installed
          enabled
        />
        <mod-item
          modTitle="Quality of Life"
          description="Adds many QoL and accessibility features such as screen shake reduction and more save slots"
          installed
        />
        <mod-item modTitle="Enhanced Debug" description="Adds more debug features" />
        <mod-item modTitle="Rando" description="You know what this is" installed enabled />
        <mod-item
          modTitle="Scene Explorer"
          description="A utility for exploring the Unity objects and components"
        />
        <mod-item
          modTitle="Speedrun.com"
          description="Replaces the in-game leaderboards with ones sourced from speedrun.com"
        />
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
  }
}
</script>

<style scoped lang="scss">
</style>
