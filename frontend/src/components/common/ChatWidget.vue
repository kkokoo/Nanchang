<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGsap } from '@/composables/useGsap'
import { onImgError } from '@/utils/image'

const router = useRouter()
const { gsap } = useGsap()
const bounce = ref(true)
const botImg = '/images/hongxiaoxing.png'

function goChat() {
  bounce.value = false
  router.push('/chatbot')
}

function onEnter(el) {
  gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' })
}
</script>

<template>
  <button class="chat-fab" @click="goChat" @mouseenter="onEnter" title="洪小星 · 南昌历史小管家">
    <img :src="botImg" alt="洪小星" class="fab-img" :class="{ bounce }" @error="onImgError" />
    <span class="fab-tip">有问题问我～</span>
  </button>
</template>

<style scoped>
.chat-fab {
  position: fixed; right: 24px; bottom: 24px; z-index: 900;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.fab-img { width: 96px; height: auto; filter: drop-shadow(0 8px 16px rgba(197,48,48,0.3)); }
.fab-img.bounce { animation: fab-bounce 2.4s infinite ease-in-out; }
@keyframes fab-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}
.fab-tip {
  font-size: 12px; color: #fff; background: var(--grad-red);
  padding: 4px 12px; border-radius: var(--r-full);
  box-shadow: var(--shadow-red); white-space: nowrap;
  opacity: 0; transform: translateY(6px); transition: all .3s;
}
.chat-fab:hover .fab-tip { opacity: 1; transform: translateY(0); }
.chat-fab:hover .fab-img { animation-play-state: paused; }
@media (max-width: 600px) {
  .fab-img { width: 72px; }
}
</style>
