<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { eventList } from '@/api/event'
import { personList } from '@/api/person'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'

const { gsap } = useGsap()
const keyword = ref('')
const events = ref([])
const persons = ref([])
const loading = ref(false)
const searched = ref(false)

async function search() {
  const k = keyword.value.trim()
  if (!k) return
  loading.value = true
  searched.value = true
  try {
    const [es, ps] = await Promise.all([
      eventList().catch(() => []),
      personList({ name: k }).catch(() => [])
    ])
    const allEvents = es || []
    events.value = allEvents.filter(e => (e.eventName || '').includes(k) || (e.background || '').includes(k))
    persons.value = ps || []
  } catch (e) { console.error(e) } finally {
    loading.value = false
    gsap.from('.result-item', { y: 30, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' })
  }
}
</script>

<template>
  <div class="page">
    <PageHero title="搜索" subtitle="搜索南昌历史事件与人物" :bread="[{ label: '搜索' }]" />

    <section class="section">
      <div class="container search-wrap">
        <div class="search-bar">
          <input v-model="keyword" placeholder="输入关键词，如：八一、灌婴、滕王阁…" @keyup.enter="search" />
          <button class="btn btn-primary" @click="search" :disabled="loading">
            {{ loading ? '搜索中…' : '搜索' }}
          </button>
        </div>

        <div v-if="searched && !loading" class="results">
          <div v-if="events.length" class="result-group">
            <h3 class="font-serif">历史事件（{{ events.length }}）</h3>
            <RouterLink v-for="e in events" :key="e.eventId" :to="`/event/${e.eventId}`" class="result-item card-glass">
              <h4 class="font-serif">{{ e.eventName }}</h4>
              <p class="line-clamp-2">{{ e.background }}</p>
              <span class="tag tag-gold">{{ e.dynasty }}</span>
            </RouterLink>
          </div>

          <div v-if="persons.length" class="result-group">
            <h3 class="font-serif">历史人物（{{ persons.length }}）</h3>
            <RouterLink v-for="p in persons" :key="p.personId" :to="`/figure/${p.personId}`" class="result-item card-glass">
              <h4 class="font-serif">{{ p.name }}</h4>
              <p class="line-clamp-2">{{ p.biography }}</p>
              <span class="tag tag-gold">{{ p.dynasty }}</span>
            </RouterLink>
          </div>

          <div v-if="!events.length && !persons.length" class="empty">
            <p>未找到与“{{ keyword }}”相关的内容</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-wrap { max-width: 800px; margin: 0 auto; }
.search-bar { display: flex; gap: 12px; margin-bottom: 32px; }
.search-bar input { flex: 1; padding: 14px 22px; border: 1.5px solid var(--nc-line); border-radius: var(--r-full); font-size: 15px; outline: none; transition: border-color .2s; }
.search-bar input:focus { border-color: var(--nc-red); }
.result-group { margin-bottom: 36px; }
.result-group h3 { font-size: 18px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; }
.result-item { display: block; padding: 20px; margin-bottom: 12px; transition: transform .2s; }
.result-item:hover { transform: translateX(6px); }
.result-item h4 { font-size: 17px; font-weight: 700; color: var(--nc-ink); margin-bottom: 8px; }
.result-item p { font-size: 14px; color: var(--nc-text-sub); line-height: 1.6; }
.result-item .tag { margin-top: 10px; }
.empty { text-align: center; padding: 60px 0; color: var(--nc-text-mute); }
</style>
