<script setup>
import { RouterLink } from 'vue-router'
import { useGsap } from '@/composables/useGsap'
import { onMounted } from 'vue'

const { gsap } = useGsap()
onMounted(() => {
  gsap.from('.nf-content > *', { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' })
})
</script>

<template>
  <div class="nf-page">
    <div class="nf-bg"></div>
    <div class="container nf-content">
      <div class="nf-code font-serif">404</div>
      <h1 class="font-serif">页面走失在历史长河中</h1>
      <p>你寻找的页面似乎已被岁月尘封，让我们带你回到起点。</p>
      <RouterLink to="/" class="btn btn-primary btn-lg">返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.nf-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding-top: var(--nav-h); position: relative; }
.nf-bg { position: fixed; inset: 0; background: linear-gradient(135deg, rgba(155,44,44,0.1), rgba(26,22,20,0.6)), url('/images/history/英雄城南昌.jpg'); background-size: cover; background-position: center; z-index: -1; }
.nf-content { text-align: center; color: #fff; }
.nf-code { font-size: 140px; font-weight: 900; color: var(--nc-red); line-height: 1; text-shadow: 0 6px 40px rgba(197,48,48,0.4); }
.nf-content h1 { font-size: 32px; font-weight: 800; margin-top: 12px; }
.nf-content p { margin: 16px 0 32px; font-size: 16px; opacity: 0.85; }
</style>
