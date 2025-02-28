<script setup>
import { useRouter, withBase } from 'vitepress'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  router.go(withBase('/introduction'))
})
</script>

Redirecting to the [Introduction](/introduction)...
