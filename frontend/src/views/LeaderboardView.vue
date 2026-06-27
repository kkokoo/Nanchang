<script setup>
import { ref, onMounted } from 'vue'
import { leaderboard } from '@/api/question'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'

const { gsap, scrollReveal, ScrollTrigger } = useGsap()
const list = ref([])
const loading = ref(true)

const medals = ['🥇', '🥈', '🥉']

onMounted(async () => {
  try {
    const res = await leaderboard(20)
    list.value = res.data || res || []
  } catch (e) { console.error(e) } finally {
    loading.value = false
    setTimeout(() => { scrollReveal('.reveal-item'); ScrollTrigger.refresh() }, 50)
  }
})
</script>

<template>
  <div class="page">
    <PageHero title="积分排行榜" subtitle="向历史知识达人致敬" :bread="[{ label: '排行榜' }]" />

    <section class="section">
      <div class="container lb-wrap">
        <div v-if="loading" class="loading-tip">加载中…</div>

        <!-- 前三名 -->
        <div v-else-if="list.length >= 3" class="podium reveal-item">
          <div v-for="(u, i) in list.slice(0, 3)" :key="i" class="podium-item" :class="['rank-' + (i + 1)]" :style="{ order: i === 0 ? 2 : i === 1 ? 1 : 3 }">
            <div class="podium-medal">{{ medals[i] }}</div>
            <div class="podium-avatar">{{ (u.username || '?').charAt(0) }}</div>
            <p class="podium-name">{{ u.username }}</p>
            <div class="podium-score font-serif">{{ u.points }}</div>
            <div class="podium-bar"></div>
          </div>
        </div>

        <!-- 列表 -->
        <div class="lb-list">
          <div
            v-for="(u, i) in list.slice(3)"
            :key="i"
            class="lb-row reveal-item card-glass"
            :style="{ transitionDelay: i * 0.04 + 's' }"
          >
            <span class="lb-rank">{{ i + 4 }}</span>
            <span class="lb-avatar">{{ (u.username || '?').charAt(0) }}</span>
            <span class="lb-name">{{ u.username }}</span>
            <span class="lb-score font-serif">{{ u.points }} 分</span>
          </div>
          <div v-if="list.length <= 3 && !loading" class="empty">暂无更多排名数据</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lb-wrap { max-width: 720px; margin: 0 auto; }
.loading-tip, .empty { text-align: center; padding: 60px 0; color: var(--nc-text-mute); }
.podium { display: flex; align-items: flex-end; justify-content: center; gap: 20px; margin-bottom: 48px; }
.podium-item { text-align: center; display: flex; flex-direction: column; align-items: center; }
.podium-medal { font-size: 36px; }
.podium-avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--grad-red); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; margin: 8px 0; box-shadow: var(--shadow-md); }
.podium-name { font-size: 16px; font-weight: 600; color: var(--nc-ink); }
.podium-score { font-size: 24px; font-weight: 900; color: var(--nc-red); margin-top: 4px; }
.podium-bar { width: 100px; border-radius: var(--r-md) var(--r-md) 0 0; margin-top: 12px; }
.rank-1 .podium-bar { height: 120px; background: var(--grad-gold); }
.rank-1 .podium-avatar { width: 80px; height: 80px; font-size: 32px; }
.rank-2 .podium-bar { height: 90px; background: linear-gradient(135deg, #d1d5db, #9ca3af); }
.rank-3 .podium-bar { height: 70px; background: linear-gradient(135deg, #d97706, #92400e); }
.lb-list { display: flex; flex-direction: column; gap: 10px; }
.lb-row { display: flex; align-items: center; gap: 16px; padding: 16px 24px; }
.lb-rank { width: 32px; text-align: center; font-weight: 700; color: var(--nc-text-mute); }
.lb-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--nc-paper-warm); color: var(--nc-text-sub); display: flex; align-items: center; justify-content: center; font-weight: 700; }
.lb-name { flex: 1; font-weight: 600; color: var(--nc-text); }
.lb-score { font-weight: 700; color: var(--nc-red); }
@media (max-width: 600px) { .podium { gap: 10px; } .podium-bar { width: 70px; } }
</style>
