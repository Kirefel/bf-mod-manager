<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Settings</div>
      <q-space />
      <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
    </q-card-section>

    <q-card-section>
      <q-checkbox v-model="steam" label="Use Steam" />

      <q-input v-model="gamePath" label="Game path" spellcheck="false">
        <template v-slot:append>
          <q-btn flat>...</q-btn>
        </template>
      </q-input>
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
    }
  }
}
</script>

<style>
</style>