<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  bread: { type: Array, default: () => [] }
})
</script>

<template>
  <section class="page-hero">
    <div class="container">
      <h1 class="page-hero-title font-serif">{{ title }}</h1>
      <p v-if="subtitle" class="page-hero-sub">{{ subtitle }}</p>
      <div v-if="bread.length" class="page-hero-bread">
        <RouterLink to="/">首页</RouterLink>
        <template v-for="(b, i) in bread" :key="i">
          <span class="sep">/</span>
          <RouterLink v-if="b.to" :to="b.to">{{ b.label }}</RouterLink>
          <span v-else class="current">{{ b.label }}</span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sep { margin: 0 6px; color: var(--nc-text-mute); }
.current { color: var(--nc-text-sub); }
</style>
