<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ChatWidget from '@/components/common/ChatWidget.vue'
</script>

<template>
  <AppNavbar />
  <main class="app-main">
    <RouterView v-slot="{ Component }">
      <Transition name="route-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
  <ChatWidget />
</template>

<style>
.app-main { min-height: 100vh; }
</style>
