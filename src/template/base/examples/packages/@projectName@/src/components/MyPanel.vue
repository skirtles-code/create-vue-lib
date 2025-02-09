<script setup lang="ts">
import MyPanelSection from './MyPanelSection.vue'

defineProps<{
  title?: string
  footer?: string
}>()
</script>

<template>
  <div class="panel">
    <slot name="header">
      <MyPanelSection v-if="title" class="panel-header">{{ title }}</MyPanelSection>
    </slot>
    <slot name="body">
      <MyPanelSection class="panel-body">
        <slot />
      </MyPanelSection>
    </slot>
    <slot name="footer">
      <MyPanelSection v-if="footer" class="panel-footer">{{ footer }}</MyPanelSection>
    </slot>
  </div>
</template>

<style scoped>
.panel {
  border: 1px solid #34495e;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

.panel > * + * {
  border-top: 1px solid #34495e;
}

.panel-header, .panel-footer {
  background: #34495e;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  color: #fff;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
}

.panel-section:first-child {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.panel-section:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.panel-body {
  flex: auto;
  overflow: auto;
}
</style>
