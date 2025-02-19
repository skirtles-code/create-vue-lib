<script setup lang="ts">
import { ref } from 'vue'

if (__DEV__) {
  console.log('dev: creating ExampleComponent')
}

const msg = ref('Hello world!')
</script>

<template>
  <div class="outer">
    <input v-model="msg">
    <p>{{ msg }}</p>
  </div>
</template>

<style scoped>
.outer {
  border: 1px solid green;
  padding: 20px;
}

.outer input {
  border: 1px solid #777;
  padding: 2px 4px;
}
</style>
