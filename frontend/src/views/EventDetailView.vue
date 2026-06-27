<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { eventDetail, eventRelatedPersons } from '@/api/event'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'
import { normalizeImgUrl, personImgUrl, onImgError } from '@/utils/image'

const route = useRoute()
const { gsap, scrollReveal, ScrollTrigger } = useGsap()
const event = ref(null)
const related = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  const id = route.params.id
  try {
    const res = await eventDetail(id)
    event.value = res
    if (res) related.value = (await eventRelatedPersons(id)) || []
  } catch (e) {
    error.value = '加载失败或事件不存在'
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

    <div v-else-if="error || !event" class="container empty">
      <p>{{ error || '事件不存在' }}</p>
      <RouterLink to="/events" class="btn btn-primary" style="margin-top:16px">返回事件列表</RouterLink>
    </div>

    <template v-else>
      <!-- 详情头部 -->
      <section class="detail-hero" :style="event.cover ? { backgroundImage: `linear-gradient(135deg, rgba(26,22,20,0.85), rgba(155,44,44,0.65)), url('${normalizeImgUrl(event.cover)}')` } : {}">
        <div class="container hero-inner">
          <span class="tag tag-gold">{{ event.dynasty }}</span>
          <h1 class="font-serif">{{ event.eventName }}</h1>
          <div class="hero-meta">
            <span v-if="event.occurTime">📅 {{ event.occurTime }}</span>
            <span v-if="event.location">📍 {{ event.location }}</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container detail-grid">
          <div class="detail-main">
            <article v-if="event.background" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">壹</span>历史背景</h2>
              <p>{{ event.background }}</p>
            </article>
            <article v-if="event.process" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">贰</span>事件经过</h2>
              <p>{{ event.process }}</p>
            </article>
            <article v-if="event.significance" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">叁</span>历史意义</h2>
              <p>{{ event.significance }}</p>
            </article>
            <article v-if="event.relatedPerson" class="detail-section card-glass">
              <h2 class="font-serif"><span class="num">肆</span>相关人物</h2>
              <p>{{ event.relatedPerson }}</p>
            </article>
          </div>

          <aside class="detail-side">
            <div class="side-card card-glass reveal-item">
              <h3>事件信息</h3>
              <ul class="info-list">
                <li><span>朝代</span><b>{{ event.dynasty || '—' }}</b></li>
                <li><span>时间</span><b>{{ event.occurTime || '—' }}</b></li>
                <li><span>地点</span><b>{{ event.location || '—' }}</b></li>
                <li v-if="event.source"><span>出处</span><b>{{ event.source }}</b></li>
              </ul>
            </div>
            <div v-if="related.length" class="side-card card-glass reveal-item">
              <h3>相关人物</h3>
              <div class="related-list">
                <RouterLink v-for="p in related" :key="p.personId" :to="`/figure/${p.personId}`" class="related-item">
                  <img :src="personImgUrl(p.cover, p.name)" :alt="p.name" @error="onImgError" />
                  <div>
                    <p class="r-name">{{ p.name }}</p>
                    <p class="r-dynasty">{{ p.dynasty }}</p>
                  </div>
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
.detail-hero { background: var(--grad-hero); background-size: cover; background-position: center; padding: 120px 0 60px; color: #fff; }
.hero-inner { max-width: 800px; }
.hero-inner .tag { margin-bottom: 16px; }
.hero-inner h1 { font-size: 42px; font-weight: 900; letter-spacing: 2px; line-height: 1.2; }
.hero-meta { margin-top: 18px; display: flex; gap: 24px; flex-wrap: wrap; font-size: 15px; opacity: 0.9; }
.detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }
.detail-main { display: flex; flex-direction: column; gap: 24px; }
.detail-section { padding: 32px; }
.detail-section h2 { font-size: 22px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
.detail-section .num { font-size: 28px; color: var(--nc-red); font-weight: 900; }
.detail-section p { font-size: 15px; line-height: 2; color: var(--nc-text); white-space: pre-wrap; }
.detail-side { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 80px; }
.side-card { padding: 24px; }
.side-card h3 { font-size: 17px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--nc-line); }
.info-list li { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
.info-list li span { color: var(--nc-text-sub); }
.info-list li b { color: var(--nc-text); font-weight: 600; }
.related-list { display: flex; flex-direction: column; gap: 12px; }
.related-item { display: flex; gap: 12px; align-items: center; padding: 8px; border-radius: var(--r-sm); transition: background .2s; }
.related-item:hover { background: var(--nc-red-bg); }
.related-item img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.r-name { font-size: 14px; font-weight: 600; color: var(--nc-text); }
.r-dynasty { font-size: 12px; color: var(--nc-text-mute); }
.empty { text-align: center; padding: 120px 24px; color: var(--nc-text-mute); }
@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } .detail-side { position: static; } .hero-inner h1 { font-size: 30px; } }
</style>
