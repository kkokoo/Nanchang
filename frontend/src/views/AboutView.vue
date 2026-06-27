<script setup>
import { RouterLink } from 'vue-router'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'

const { scrollReveal, ScrollTrigger } = useGsap()
import { onMounted } from 'vue'

onMounted(() => {
  scrollReveal('.reveal-item')
  setTimeout(() => ScrollTrigger.refresh(), 50)
})

const stack = [
  { name: 'Spring Boot 3.2', desc: '后端框架' },
  { name: 'Vue 3 + Vite', desc: '前端框架' },
  { name: 'GSAP', desc: '动画引擎' },
  { name: 'MySQL 8', desc: '数据存储' },
  { name: 'JPA / Hibernate', desc: 'ORM' },
  { name: '智谱 AI', desc: '智能问答' }
]
</script>

<template>
  <div class="page">
    <PageHero title="关于项目" subtitle="一城风华，千载史章" :bread="[{ label: '关于' }]" />

    <section class="section">
      <div class="container about-wrap">
        <div class="about-card card-glass reveal-item">
          <h2 class="font-serif">项目简介</h2>
          <p>「南昌历史云志」是一个致力于挖掘与传播南昌红色文化与千年历史的项目。从公元前 202 年灌婴筑城，到 1927 年八一南昌起义打响第一枪，这座城市承载了无尽的红色基因与文化脉络。</p>
          <p>我们希望通过现代 Web 技术，让历史走出书本，以更生动、互动的方式呈现在用户面前。</p>
        </div>

        <div class="about-card card-glass reveal-item">
          <h2 class="font-serif">团队</h2>
          <p>课程项目：不报错全队</p>
        </div>

        <div class="about-card card-glass reveal-item">
          <h2 class="font-serif">技术栈</h2>
          <div class="stack-grid">
            <div v-for="s in stack" :key="s.name" class="stack-item">
              <h4>{{ s.name }}</h4>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>

        <div class="about-cta reveal-item">
          <RouterLink to="/" class="btn btn-primary btn-lg">返回首页</RouterLink>
          <RouterLink to="/quiz" class="btn btn-ghost btn-lg">开始答题</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-wrap { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.about-card { padding: 32px; }
.about-card h2 { font-size: 22px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; }
.about-card p { font-size: 15px; line-height: 1.9; color: var(--nc-text-sub); }
.about-card p + p { margin-top: 12px; }
.stack-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stack-item { padding: 18px; background: var(--nc-paper); border-radius: var(--r-sm); text-align: center; }
.stack-item h4 { font-size: 15px; font-weight: 700; color: var(--nc-red); }
.stack-item p { font-size: 13px; color: var(--nc-text-sub); margin-top: 4px; }
.about-cta { display: flex; gap: 16px; justify-content: center; }
@media (max-width: 600px) { .stack-grid { grid-template-columns: 1fr 1fr; } }
</style>
