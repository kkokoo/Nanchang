<script setup>
import { ref, onMounted, watch } from 'vue'
import { eventList } from '@/api/event'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'
import { normalizeImgUrl, onImgError } from '@/utils/image'

const { scrollReveal, ScrollTrigger } = useGsap()
const events = ref([])
const loading = ref(true)
const activeDynasty = ref('全部时期')
const dynasties = ['全部时期', '汉', '唐', '宋', '元', '明', '清', '民国', '近代']

async function load() {
  loading.value = true
  try {
    const d = activeDynasty.value === '全部时期' ? null : activeDynasty.value
    events.value = (await eventList(d)) || []
  } catch (e) { console.error(e) } finally {
    loading.value = false
    setTimeout(() => { scrollReveal('.reveal-item'); ScrollTrigger.refresh() }, 50)
  }
}

onMounted(load)
watch(activeDynasty, load)

function dynastyColor(d) {
  const map = { '汉': 'tag-gold', '唐': 'tag-gold', '宋': 'tag-gold', '明': 'tag-red', '清': 'tag-ink', '民国': 'tag-red', '近代': 'tag-red' }
  return map[d] || 'tag-light'
}
</script>

<template>
  <div class="page">
    <PageHero title="历史事件" subtitle="穿越千年时光，回望南昌城那些塑造历史的关键时刻" :bread="[{ label: '历史事件' }]" />

    <section class="section">
      <div class="container">
        <div class="filters reveal-item">
          <button
            v-for="d in dynasties"
            :key="d"
            class="filter-pill"
            :class="{ 'is-active': activeDynasty === d }"
            @click="activeDynasty = d"
          >{{ d }}</button>
        </div>

        <div v-if="loading" class="grid">
          <div v-for="i in 6" :key="i" class="skel-card">
            <div class="skeleton" style="height:180px;border-radius:14px"></div>
            <div class="skeleton" style="height:20px;width:60%;margin-top:16px"></div>
            <div class="skeleton" style="height:14px;margin-top:10px"></div>
          </div>
        </div>

        <div v-else-if="!events.length" class="empty">
          <p>暂无该时期的事件数据</p>
        </div>

        <div v-else class="grid">
          <RouterLink
            v-for="(e, i) in events"
            :key="e.eventId"
            :to="`/event/${e.eventId}`"
            class="card event-card reveal-item"
            :style="{ transitionDelay: (i % 6) * 0.06 + 's' }"
          >
            <div class="cover">
              <img :src="normalizeImgUrl(e.cover)" :alt="e.eventName" loading="lazy" @error="onImgError" />
              <span class="tag" :class="dynastyColor(e.dynasty)">{{ e.dynasty || '历史' }}</span>
            </div>
            <div class="body">
              <h3 class="font-serif">{{ e.eventName }}</h3>
              <p class="time">{{ e.occurTime }}<span v-if="e.location"> · {{ e.location }}</span></p>
              <p class="desc line-clamp-2">{{ e.background }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.event-card .cover { position: relative; height: 190px; overflow: hidden; }
.event-card .cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
.event-card:hover .cover img { transform: scale(1.1); }
.event-card .cover .tag { position: absolute; top: 12px; left: 12px; }
.event-card .body { padding: 22px; }
.event-card .body h3 { font-size: 19px; font-weight: 700; color: var(--nc-ink); }
.event-card .time { margin-top: 6px; font-size: 13px; color: var(--nc-gold-dark); }
.event-card .desc { margin-top: 12px; font-size: 14px; color: var(--nc-text-sub); line-height: 1.7; }
.skel-card { background: #fff; border-radius: var(--r-lg); padding: 16px; border: 1px solid var(--nc-line-soft); }
.empty { text-align: center; padding: 80px 0; color: var(--nc-text-mute); }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
</style>
