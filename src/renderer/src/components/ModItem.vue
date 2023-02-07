<template>
  <q-item>
    <q-item-section side top>
      <q-checkbox :disable="required" :model-value="false" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ modTitle }}</q-item-label>
      <q-item-label caption lines="2"> {{ description }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn-group flat>
        <q-btn icon="file_download" title="Download" />
        <q-btn icon="launch" title="View in Browser" href="https://github.com" target="_blank" />
      </q-btn-group>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'mod-item',

  props: {
    modTitle: String,
    description: String,
    required: Boolean
  }
}
</script>