<script setup>
import { ref, onMounted, watch } from 'vue'
import { personList } from '@/api/person'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'
import { personImgUrl, onImgError } from '@/utils/image'

const { scrollReveal, ScrollTrigger } = useGsap()
const persons = ref([])
const loading = ref(true)
const activeDynasty = ref('全部')
const dynasties = ['全部', '汉', '唐', '宋', '元', '明', '清', '民国', '近代']
const keyword = ref('')

async function load() {
  loading.value = true
  try {
    const params = {}
    if (activeDynasty.value !== '全部') params.dynasty = activeDynasty.value
    if (keyword.value.trim()) params.name = keyword.value.trim()
    persons.value = (await personList(params)) || []
  } catch (e) { console.error(e) } finally {
    loading.value = false
    setTimeout(() => { scrollReveal('.reveal-item'); ScrollTrigger.refresh() }, 50)
  }
}

onMounted(load)
watch(activeDynasty, load)
</script>

<template>
  <div class="page">
    <PageHero title="历史人物" subtitle="认识那些塑造南昌历史的千古风流人物" :bread="[{ label: '历史人物' }]" />

    <section class="section">
      <div class="container">
        <div class="toolbar reveal-item">
          <div class="filters">
            <button
              v-for="d in dynasties"
              :key="d"
              class="filter-pill"
              :class="{ 'is-active': activeDynasty === d }"
              @click="activeDynasty = d"
            >{{ d }}</button>
          </div>
          <div class="search-box">
            <input v-model="keyword" placeholder="搜索人物姓名" @keyup.enter="load" />
            <button class="btn btn-primary btn-sm" @click="load">搜索</button>
          </div>
        </div>

        <div v-if="loading" class="grid">
          <div v-for="i in 8" :key="i" class="skel-card">
            <div class="skeleton" style="height:200px;border-radius:14px"></div>
          </div>
        </div>

        <div v-else-if="!persons.length" class="empty"><p>暂无人物数据</p></div>

        <div v-else class="grid">
          <RouterLink
            v-for="(p, i) in persons"
            :key="p.personId"
            :to="`/figure/${p.personId}`"
            class="card person-card reveal-item"
            :style="{ transitionDelay: (i % 8) * 0.05 + 's' }"
          >
            <div class="cover">
              <img :src="personImgUrl(p.cover, p.name)" :alt="p.name" loading="lazy" @error="onImgError" />
            </div>
            <div class="body">
              <h3 class="font-serif">{{ p.name }}</h3>
              <p class="meta">{{ p.dynasty }}<span v-if="p.birthDeath"> · {{ p.birthDeath }}</span></p>
              <p class="desc line-clamp-2">{{ p.biography }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; }
.filters { display: flex; flex-wrap: wrap; gap: 10px; }
.search-box { display: flex; gap: 8px; }
.search-box input { padding: 8px 16px; border: 1.5px solid var(--nc-line); border-radius: var(--r-full); width: 220px; outline: none; transition: border-color .2s; }
.search-box input:focus { border-color: var(--nc-red); }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.person-card .cover { height: 220px; overflow: hidden; }
.person-card .cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
.person-card:hover .cover img { transform: scale(1.08); }
.person-card .body { padding: 18px; }
.person-card .body h3 { font-size: 18px; font-weight: 700; color: var(--nc-ink); }
.person-card .meta { margin-top: 4px; font-size: 12px; color: var(--nc-gold-dark); }
.person-card .desc { margin-top: 10px; font-size: 13px; color: var(--nc-text-sub); line-height: 1.6; }
.skel-card { background: #fff; border-radius: var(--r-lg); padding: 16px; border: 1px solid var(--nc-line-soft); }
.empty { text-align: center; padding: 80px 0; color: var(--nc-text-mute); }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } .toolbar { flex-direction: column; align-items: stretch; } .search-box input { width: 100%; } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr 1fr; } }
</style>
