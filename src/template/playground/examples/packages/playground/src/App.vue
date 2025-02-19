<script setup lang="ts">
import { ExampleComponent, MyPanel } from '@scopedPackageName@'
</script>

<template>
  <div class="main">
    <ExampleComponent />
    <MyPanel title="Panel title" footer="Panel footer">
      Header and footer
    </MyPanel>
    <MyPanel title="Panel title">
      Just a header
    </MyPanel>
    <MyPanel footer="Panel footer">
      Just a footer
    </MyPanel>
    <MyPanel>
      No header or footer
    </MyPanel>
  </div>
</template>

<style scoped>
.main > * + * {
  margin-top: 10px;
  max-width: 300px;
}
</style>
