<script setup>
import { RouterLink } from 'vue-router'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'
import { onMounted } from 'vue'

const { gsap } = useGsap()

onMounted(() => {
  gsap.fromTo('.model-frame', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
})
</script>

<template>
  <div class="page">
    <PageHero title="3D 文物展示" subtitle="近距离观赏雕塑《石破天惊》" :bread="[{ label: '3D 展示' }]" />

    <section class="section">
      <div class="container model-wrap">
        <div class="model-frame card-glass">
          <div class="frame-head">
            <h3 class="font-serif">雕塑《石破天惊》</h3>
            <RouterLink to="/special-81" class="btn btn-ghost btn-sm">返回八一专题</RouterLink>
          </div>
          <iframe src="/3d2.html" title="3D 模型展示" class="model-iframe"></iframe>
          <p class="model-tip">使用鼠标拖动旋转，滚轮缩放，全方位观赏雕塑细节。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.model-wrap { max-width: 1000px; margin: 0 auto; }
.model-frame { padding: 0; overflow: hidden; }
.frame-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--nc-line); background: var(--nc-paper); }
.frame-head h3 { font-size: 18px; font-weight: 700; color: var(--nc-ink); }
.model-iframe { width: 100%; height: 600px; border: 0; display: block; background: #1a1a1a; }
.model-tip { padding: 16px 24px; font-size: 13px; color: var(--nc-text-sub); text-align: center; background: var(--nc-paper); }
@media (max-width: 600px) { .model-iframe { height: 420px; } }
</style>
