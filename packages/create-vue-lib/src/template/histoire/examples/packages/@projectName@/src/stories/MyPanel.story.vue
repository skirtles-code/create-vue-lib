<script lang="ts" setup>
import MyPanel from '../components/MyPanel.vue'
</script>

<template>
  <Story
    title="MyPanel"
    :layout="{
      type: 'grid',
      width: 300
    }"
  >
    <Variant title="Header and footer">
      <MyPanel title="Panel title" footer="Panel footer">
        Header and footer
      </MyPanel>
    </Variant>
    <Variant title="Just a header">
      <MyPanel title="Panel title">
        Just a header
      </MyPanel>
    </Variant>
    <Variant title="Just a footer">
      <MyPanel footer="Panel footer">
        Just a footer
      </MyPanel>
    </Variant>
    <Variant title="No header or footer">
      <MyPanel>
        No header or footer
      </MyPanel>
    </Variant>
  </Story>
</template>
