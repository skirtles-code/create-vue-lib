<script setup lang="ts">
import { ExampleComponent, MyPanel } from '@scopedPackageName@'
</script>

<style scoped>
.panel {
  margin: 20px 0;
}
</style>

# Introduction

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
