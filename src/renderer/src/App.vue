<template>

  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Ori Launcher
        </q-toolbar-title>
        <q-btn icon="settings" flat round @click="settingsVisible = true" />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="settingsVisible">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Settings</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-checkbox>Use Steam</q-checkbox>

            <q-input label="Game path" spellcheck="false">
              <template v-slot:append>
                <q-btn flat>...</q-btn>
              </template>
            </q-input>
          <q-checkbox>Debug mode</q-checkbox>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container>
      <q-list class="listclass" bordered separator>
        <mod-item modTitle="Mod Loader" description="(Required) Enabled modding of the game" required installed enabled />
        <mod-item modTitle="Quality of Life" description="Adds many QoL and accessibility features such as screen shake reduction and more save slots" installed />
        <mod-item modTitle="Enhanced Debug" description="Adds more debug features" />
        <mod-item modTitle="Rando" description="You know what this is" installed enabled />
        <mod-item modTitle="Scene Explorer" description="A utility for exploring the Unity objects and components" />
        <mod-item modTitle="Speedrun.com" description="Replaces the in-game leaderboards with ones sourced from speedrun.com" />
      </q-list>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-space />
        <q-btn color="green">
          Launch
        </q-btn>
        <q-space />
      </q-toolbar>
    </q-footer>

  </q-layout>

</template>

<script>
import ModItem from './components/ModItem.vue'
import { ref } from 'vue'

export default {
  components: {
    ModItem
  },

  setup() {
    return {
      settingsVisible: ref(false)
    }
  }
}
</script>

<style scoped lang="scss">

.listclass {

}

</style>
