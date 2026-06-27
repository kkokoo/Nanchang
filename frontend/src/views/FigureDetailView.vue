<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { personDetail, personRelatedEvents } from '@/api/person'
import { useGsap } from '@/composables/useGsap'
import { personImgUrl, onImgError } from '@/utils/image'

const route = useRoute()
const { gsap, scrollReveal, ScrollTrigger } = useGsap()
const person = ref(null)
const related = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  const id = route.params.id
  try {
    person.value = await personDetail(id)
    if (person.value) related.value = (await personRelatedEvents(id)) || []
  } catch (e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
    setTimeout(() => {
      gsap.from('.detail-section', { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' })
      scrollReveal('.reveal-item')
      ScrollTrigger.refresh()
    }, 50)
  }
}

onMounted(load)
watch(() => route.params.id, load)
</script>

<template>
  <div class="page">
    <div v-if="loading" class="container" style="padding:80px 24px">
      <div class="skeleton" style="height:400px;border-radius:20px"></div>
    </div>

    <div v-else-if="error || !person" class="container empty">
      <p>{{ error || '人物不存在' }}</p>
      <RouterLink to="/figures" class="btn btn-primary" style="margin-top:16px">返回人物列表</RouterLink>
    </div>

    <template v-else>
      <section class="p-hero">
        <div class="container p-hero-inner">
          <div class="p-cover">
            <img :src="personImgUrl(person.cover, person.name)" :alt="person.name" @error="onImgError" />
          </div>
          <div class="p-info">
            <span class="tag tag-gold">{{ person.dynasty }}</span>
            <h1 class="font-serif">{{ person.name }}</h1>
            <p v-if="person.birthDeath" class="p-life">{{ person.birthDeath }}</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container detail-grid">
          <div class="detail-main">
            <article v-if="person.biography" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">壹</span>生平简介</h2>
              <p>{{ person.biography }}</p>
            </article>
            <article v-if="person.contribution" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">贰</span>主要贡献</h2>
              <p>{{ person.contribution }}</p>
            </article>
            <article v-if="person.relatedEvent" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">叁</span>相关事件</h2>
              <p>{{ person.relatedEvent }}</p>
            </article>
          </div>
          <aside class="detail-side">
            <div v-if="related.length" class="side-card card-glass reveal-item">
              <h3>参与事件</h3>
              <div class="related-list">
                <RouterLink v-for="e in related" :key="e.eventId" :to="`/event/${e.eventId}`" class="related-item">
                  <div class="r-info">
                    <p class="r-name">{{ e.eventName }}</p>
                    <p class="r-meta">{{ e.dynasty }}<span v-if="e.occurTime"> · {{ e.occurTime }}</span></p>
                  </div>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                </RouterLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.p-hero { background: var(--grad-paper); padding: 120px 0 48px; border-bottom: 1px solid var(--nc-line); position: relative; overflow: hidden; }
.p-hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--nc-gold), var(--nc-red), var(--nc-gold)); }
.p-hero-inner { display: flex; gap: 36px; align-items: center; }
.p-cover { width: 180px; height: 220px; border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-lg); flex-shrink: 0; border: 4px solid #fff; }
.p-cover img { width: 100%; height: 100%; object-fit: cover; }
.p-info .tag { margin-bottom: 14px; }
.p-info h1 { font-size: 40px; font-weight: 900; color: var(--nc-ink); letter-spacing: 2px; }
.p-life { margin-top: 10px; font-size: 15px; color: var(--nc-gold-dark); }
.detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }
.detail-main { display: flex; flex-direction: column; gap: 24px; }
.detail-section { padding: 32px; }
.detail-section h2 { font-size: 22px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
.detail-section .num { font-size: 28px; color: var(--nc-red); font-weight: 900; }
.detail-section p { font-size: 15px; line-height: 2; color: var(--nc-text); white-space: pre-wrap; }
.detail-side { position: sticky; top: 80px; }
.side-card { padding: 24px; }
.side-card h3 { font-size: 17px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--nc-line); }
.related-list { display: flex; flex-direction: column; gap: 8px; }
.related-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: var(--r-sm); transition: background .2s; color: var(--nc-text-sub); }
.related-item:hover { background: var(--nc-red-bg); color: var(--nc-red); }
.r-name { font-size: 14px; font-weight: 600; color: var(--nc-text); }
.r-meta { font-size: 12px; color: var(--nc-text-mute); margin-top: 2px; }
.empty { text-align: center; padding: 120px 24px; color: var(--nc-text-mute); }
@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } .detail-side { position: static; } .p-hero-inner { flex-direction: column; text-align: center; } .p-info h1 { font-size: 28px; } }
</style>
