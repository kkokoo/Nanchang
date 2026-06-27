<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { eventList } from '@/api/event'
import { useGsap } from '@/composables/useGsap'
import { normalizeImgUrl, onImgError } from '@/utils/image'

const { gsap, ScrollTrigger, heroReveal, scrollReveal, countUp } = useGsap()

const featured = ref([])
const loading = ref(true)
const stats = [
  { label: '建城历史(年)', end: 2200, suffix: '+' },
  { label: '重点历史事件', end: 128 },
  { label: '开国元勋相关', end: 56 },
  { label: '红色文化遗址', end: 15, suffix: '+' }
]

onMounted(async () => {
  document.body.classList.add('home-page')

  // Hero 入场动画
  heroReveal(['.hero-tag', '.hero-title', '.hero-desc', '.hero-actions'])

  // 数字计数
  stats.forEach((_, i) => {
    const el = document.querySelectorAll('.stat-num')[i]
    if (el) countUp(el, stats[i].end)
  })

  // 滚动揭示
  scrollReveal('.reveal-item')

  // 加载精选事件
  try {
    const res = await eventList()
    featured.value = (res || []).slice(0, 6)
  } catch (e) {
    console.error('加载事件失败', e)
  } finally {
    loading.value = false
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }
})

onUnmounted(() => {
  document.body.classList.remove('home-page')
})

function dynastyColor(d) {
  const map = { '汉': 'tag-gold', '唐': 'tag-gold', '宋': 'tag-gold', '明': 'tag-red', '清': 'tag-ink', '民国': 'tag-red', '近代': 'tag-red' }
  return map[d] || 'tag-light'
}
</script>

<template>
  <div class="home">
    <!-- 固定背景 -->
    <div class="fixed-bg"></div>
    <div class="fixed-bg-overlay"></div>

    <!-- Hero 横幅 -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-pattern"></div>
      <div class="container hero-content">
        <span class="hero-tag">一城风华 · 千载史章</span>
        <h1 class="hero-title font-serif">
          英雄城南昌<br/><span class="title-accent">打响第一枪的地方</span>
        </h1>
        <p class="hero-desc">
          从公元前 202 年灌婴筑城，到 1927 年八一南昌起义，<br/>
          这座城市承载了无尽的红色基因与文化脉络。
        </p>
        <div class="hero-actions">
          <RouterLink to="/special-81" class="btn btn-primary btn-lg">
            进入八一专题
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </RouterLink>
          <RouterLink to="/timeline" class="btn btn-outline-light btn-lg">浏览历史长河</RouterLink>
        </div>
      </div>
      <div class="hero-scroll-hint">
        <span></span>
      </div>
      <div class="hero-decoration hero-deco-left"></div>
      <div class="hero-decoration hero-deco-right"></div>
    </section>

    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="(s, i) in stats" :key="i" class="stat-card reveal-item" :style="{ transitionDelay: i * 0.08 + 's' }">
            <div class="stat-icon-wrap">
              <div class="stat-icon"></div>
            </div>
            <div class="stat-num-wrap">
              <div class="stat-num">0</div>
              <div class="stat-suffix" v-if="s.suffix">{{ s.suffix }}</div>
            </div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 精选史话 -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal-item">
          <div>
            <h2 class="section-title">精选<span class="accent">史话</span></h2>
            <p class="section-sub">穿越两千年时光，触摸南昌的历史脉搏</p>
          </div>
          <RouterLink to="/events" class="more-link">
            查看全部事件
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </RouterLink>
        </div>

        <div v-if="loading" class="events-grid">
          <div v-for="i in 3" :key="i" class="skeleton-card">
            <div class="skeleton" style="height:180px"></div>
            <div class="skeleton" style="height:20px;width:60%;margin-top:16px"></div>
            <div class="skeleton" style="height:14px;margin-top:10px"></div>
            <div class="skeleton" style="height:14px;margin-top:8px"></div>
          </div>
        </div>

        <div v-else class="events-grid">
          <RouterLink
            v-for="(e, i) in featured"
            :key="e.eventId"
            :to="`/event/${e.eventId}`"
            class="event-card reveal-item"
            :style="{ transitionDelay: i * 0.08 + 's' }"
          >
            <div class="event-cover">
              <img :src="normalizeImgUrl(e.cover)" :alt="e.eventName" loading="lazy" @error="onImgError" />
              <div class="event-cover-overlay"></div>
              <span class="tag" :class="dynastyColor(e.dynasty)">{{ e.dynasty || '历史' }}</span>
            </div>
            <div class="event-body">
              <h3 class="event-title font-serif">{{ e.eventName }}</h3>
              <p class="event-time">{{ e.occurTime || e.dynasty }}</p>
              <p class="event-desc line-clamp-2">{{ e.background || e.significance }}</p>
              <span class="event-more">了解更多 →</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 主题导览 -->
    <section class="section theme-section">
      <div class="section-bg-deco"></div>
      <div class="container">
        <div class="section-head reveal-item" style="text-align:center;justify-content:center">
          <div>
            <h2 class="section-title" style="margin:0 auto">主题<span class="accent">导览</span></h2>
            <p class="section-sub">多维度探索南昌历史</p>
          </div>
        </div>
        <div class="theme-grid">
          <RouterLink to="/timeline" class="theme-card reveal-item" :style="{ backgroundImage: `linear-gradient(135deg, rgba(26,22,20,0.85), rgba(155,44,44,0.7)), url('/images/history/洪都之战.jpg')` }">
            <div class="theme-card-border"></div>
            <div class="theme-card-body">
              <div class="theme-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              </div>
              <h3 class="font-serif">历史长河</h3>
              <p>沿时间长河溯源南昌两千年建城史</p>
              <span class="theme-go">进入 →</span>
            </div>
          </RouterLink>
          <RouterLink to="/figures" class="theme-card reveal-item" :style="{ backgroundImage: `linear-gradient(135deg, rgba(26,22,20,0.85), rgba(140,105,20,0.7)), url('/images/history/滕王阁始建.jpg')` }">
            <div class="theme-card-border"></div>
            <div class="theme-card-body">
              <div class="theme-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </div>
              <h3 class="font-serif">英雄人物</h3>
              <p>认识那些塑造南昌历史的千古风流人物</p>
              <span class="theme-go">进入 →</span>
            </div>
          </RouterLink>
          <RouterLink to="/quiz" class="theme-card reveal-item" :style="{ backgroundImage: `linear-gradient(135deg, rgba(26,22,20,0.85), rgba(197,48,48,0.7)), url('/images/history/石破天惊.jpg')` }">
            <div class="theme-card-border"></div>
            <div class="theme-card-body">
              <div class="theme-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M11 7.05V4.5a2 2 0 013.88-.66l1.77-.84a4 4 0 00-7.55 1.79v2.26A9.003 9.003 0 003 15a9 9 0 0018 0 9.003 9.003 0 00-6.1-8.51l.01-.01L13 7.05zM12 19a4 4 0 01-4-4h2a2 2 0 004 0h2a4 4 0 01-4 4z"/></svg>
              </div>
              <h3 class="font-serif">互动问答</h3>
              <p>在趣味答题中检验你的历史知识储备</p>
              <span class="theme-go">进入 →</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 固定背景 — 滚动时内容覆盖上来 */
.fixed-bg {
  position: fixed; inset: 0; z-index: -2;
  background: url('/images/history/英雄城南昌.jpg') no-repeat center;
  background-size: cover;
  filter: saturate(1.1);
}
.fixed-bg-overlay {
  position: fixed; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(197,48,48,0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(201,162,39,0.15) 0%, transparent 50%),
    linear-gradient(180deg, rgba(26,22,20,0.2) 0%, rgba(26,22,20,0.05) 50%, rgba(250,248,245,0) 100%);
}

/* Hero */
.hero {
  position: relative; z-index: 1;
  min-height: 100vh;
  padding-top: var(--nav-h);
  display: flex; align-items: center; overflow: hidden;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(26,22,20,0.5) 0%, rgba(155,44,44,0.4) 50%, rgba(26,22,20,0.6) 100%);
}
.hero-pattern {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(230,197,88,0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(220,38,38,0.1) 0%, transparent 40%);
  pointer-events: none;
}
.hero-content { position: relative; z-index: 2; color: #fff; max-width: 780px; padding-top: 40px; }
.hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; color: var(--nc-gold-light);
  letter-spacing: 5px; margin-bottom: 20px; padding: 8px 22px;
  border: 1px solid rgba(230,197,88,0.5); border-radius: var(--r-full);
  backdrop-filter: blur(10px);
  background: rgba(230,197,88,0.08);
}
.hero-tag::before {
  content: ''; display: inline-block; width: 6px; height: 6px;
  background: var(--nc-gold-light); border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}
.hero-title {
  font-size: 64px; font-weight: 900; line-height: 1.15; letter-spacing: 3px;
  text-shadow: 0 6px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
}
.title-accent {
  color: var(--nc-gold-light); font-size: 0.5em; font-weight: 700;
  display: inline-block; margin-top: 10px; letter-spacing: 6px;
  position: relative; padding: 0 16px;
}
.title-accent::before, .title-accent::after {
  content: ''; position: absolute; top: 50%; width: 30px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--nc-gold-light));
}
.title-accent::before { right: 100%; }
.title-accent::after { left: 100%; background: linear-gradient(90deg, var(--nc-gold-light), transparent); }
.hero-desc {
  margin-top: 24px; font-size: 16px; line-height: 2; color: rgba(255,255,255,0.9);
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  letter-spacing: 0.5px;
}
.hero-actions { margin-top: 36px; display: flex; gap: 16px; flex-wrap: wrap; }
.hero-actions .btn-primary {
  background: linear-gradient(135deg, #E53E3E 0%, #9B2C2C 100%);
  box-shadow: 0 8px 30px rgba(197,48,48,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
}
.hero-actions .btn-outline-light {
  background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4);
  backdrop-filter: blur(10px);
}
.hero-actions .btn-outline-light:hover {
  background: rgba(255,255,255,0.95); color: var(--nc-red-dark);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* Hero 装饰角 */
.hero-decoration {
  position: absolute; width: 160px; height: 160px;
  border: 2px solid rgba(230,197,88,0.12);
  pointer-events: none;
}
.hero-deco-left {
  top: calc(var(--nav-h) + 40px); left: 40px;
  border-right: none; border-bottom: none;
}
.hero-deco-right {
  bottom: 120px; right: 40px;
  border-left: none; border-top: none;
}

.hero-scroll-hint {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 2;
  width: 26px; height: 42px; border: 2px solid rgba(255,255,255,0.4); border-radius: 14px;
  display: flex; justify-content: center; padding-top: 8px;
  backdrop-filter: blur(4px);
}
.hero-scroll-hint span { width: 4px; height: 8px; background: #fff; border-radius: 2px; animation: scroll-hint 1.8s infinite; }
@keyframes scroll-hint { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(14px); opacity: 0; } }

/* Stats */
.stats-section {
  position: relative; z-index: 2;
  margin-top: -70px;
  padding-bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(250,248,245,0.6) 25%, #FAF8F5 70%);
}
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card {
  background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.8); border-radius: var(--r-lg);
  padding: 26px 18px 22px; text-align: center;
  box-shadow: 0 12px 40px rgba(120,60,30,0.1);
  display: flex; flex-direction: column; align-items: center;
  position: relative; overflow: hidden;
  transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s;
}
.stat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--nc-red), var(--nc-gold), var(--nc-red));
}
.stat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(120,60,30,0.15); }
.stat-icon-wrap {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--nc-red-bg), rgba(201,162,39,0.12));
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}
.stat-icon {
  width: 20px; height: 20px;
  background: linear-gradient(135deg, var(--nc-red), var(--nc-gold-dark));
  border-radius: 3px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.stat-num-wrap { display: flex; align-items: baseline; justify-content: center; }
.stat-num { font-size: 38px; font-weight: 900; color: var(--nc-red-dark); font-family: var(--font-serif); line-height: 1; }
.stat-suffix { font-size: 22px; font-weight: 800; color: var(--nc-red-dark); margin-left: 2px; }
.stat-label { margin-top: 8px; font-size: 13px; color: var(--nc-text-sub); letter-spacing: 0.5px; font-weight: 500; }

/* Section head */
.section-head { display: flex; justify-content: space-between; align-items: flex-end; }

/* 内容区域 — 纯色背景覆盖固定背景 */
.section { position: relative; z-index: 2; background: #FAF8F5; padding-top: 40px; padding-bottom: 50px; }

/* Events */
.events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.event-card {
  background: #fff; border-radius: var(--r-lg); overflow: hidden;
  border: 1px solid var(--nc-line-soft);
  box-shadow: 0 4px 16px rgba(120,60,30,0.06);
  transition: transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s, border-color .3s;
  position: relative;
}
.event-card::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: var(--grad-red); transform: scaleX(0); transform-origin: left;
  transition: transform .4s ease;
}
.event-card:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(120,60,30,0.13); border-color: var(--nc-red-soft); }
.event-card:hover::after { transform: scaleX(1); }
.event-cover { position: relative; height: 190px; overflow: hidden; background: var(--nc-paper-warm); }
.event-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.4,0,.2,1); }
.event-card:hover .event-cover img { transform: scale(1.08); }
.event-cover-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(26,22,20,0.25) 100%);
  opacity: 0; transition: opacity .3s;
}
.event-card:hover .event-cover-overlay { opacity: 1; }
.event-cover .tag { position: absolute; top: 12px; left: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.event-body { padding: 20px; }
.event-title { font-size: 18px; font-weight: 700; color: var(--nc-ink); line-height: 1.4; transition: color .25s; }
.event-card:hover .event-title { color: var(--nc-red-dark); }
.event-time { margin-top: 6px; font-size: 13px; color: var(--nc-gold-dark); font-weight: 500; }
.event-desc { margin-top: 10px; font-size: 14px; color: var(--nc-text-sub); line-height: 1.7; }
.event-more {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 14px; font-size: 13px; font-weight: 600; color: var(--nc-red);
  transition: gap .25s;
}
.event-card:hover .event-more { gap: 8px; }

.skeleton-card { background: #fff; border-radius: var(--r-lg); padding: 16px; border: 1px solid var(--nc-line-soft); }

/* Theme section */
.theme-section {
  background: linear-gradient(180deg, #FAF8F5 0%, #F5EFE4 40%, #EDE4D5 100%);
  position: relative; z-index: 2; overflow: hidden;
  padding-top: 50px; padding-bottom: 40px;
}
.section-bg-deco {
  position: absolute; top: -100px; right: -200px; width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(197,48,48,0.05) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
}
.section-bg-deco::after {
  content: ''; position: absolute; bottom: -200px; left: -300px; width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 70%);
  border-radius: 50%;
}
.theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; position: relative; z-index: 1; }
.theme-card {
  position: relative; height: 280px; border-radius: var(--r-lg);
  background-size: cover; background-position: center; overflow: hidden;
  display: flex; align-items: flex-end; transition: transform .45s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  cursor: pointer;
}
.theme-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%);
  transition: opacity .35s;
}
.theme-card:hover { transform: translateY(-8px) scale(1.015); box-shadow: 0 18px 45px rgba(0,0,0,0.22); }
.theme-card:hover::before { background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(155,44,44,0.75) 100%); }
.theme-card-border {
  position: absolute; inset: 10px; border: 1px solid rgba(255,255,255,0.2);
  border-radius: calc(var(--r-lg) - 4px); pointer-events: none;
  opacity: 0; transition: opacity .35s;
}
.theme-card:hover .theme-card-border { opacity: 1; }
.theme-card-body {
  padding: 28px; color: #fff; position: relative; z-index: 2;
  transform: translateY(8px); transition: transform .35s;
}
.theme-card:hover .theme-card-body { transform: translateY(0); }
.theme-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px; color: var(--nc-gold-light);
  transition: background .35s, transform .35s;
}
.theme-card:hover .theme-icon {
  background: rgba(197,48,48,0.9); transform: scale(1.08) rotate(-5deg);
  border-color: rgba(255,255,255,0.3);
}
.theme-card-body h3 { font-size: 24px; font-weight: 800; margin-bottom: 8px; letter-spacing: 2px; }
.theme-card-body p { font-size: 14px; opacity: 0.85; line-height: 1.7; }
.theme-go {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 14px; font-size: 13px; color: var(--nc-gold-light); font-weight: 600;
  letter-spacing: 1px; transition: gap .3s;
}
.theme-card:hover .theme-go { gap: 10px; color: #fff; }

.more-link {
  display: flex; align-items: center; gap: 6px;
  color: var(--nc-red); font-weight: 600; font-size: 14px;
  padding: 8px 16px; border-radius: var(--r-md);
  transition: all .25s;
}
.more-link:hover { gap: 10px; background: var(--nc-red-bg); }

@media (max-width: 900px) {
  .hero { min-height: auto; padding-bottom: 120px; }
  .hero-title { font-size: 44px; letter-spacing: 2px; }
  .title-accent { font-size: 0.5em; letter-spacing: 4px; }
  .title-accent::before, .title-accent::after { width: 16px; }
  .hero-decoration { display: none; }
  .events-grid, .theme-grid { grid-template-columns: 1fr 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .stat-card { padding: 20px 14px 18px; }
  .stat-num { font-size: 32px; }
  .theme-card-body h3 { font-size: 20px; }
  .stats-section { margin-top: -50px; padding-bottom: 40px; }
}
@media (max-width: 600px) {
  .hero { padding-bottom: 100px; }
  .hero-content { padding-top: 20px; }
  .hero-title { font-size: 34px; }
  .hero-desc { font-size: 15px; margin-top: 16px; }
  .hero-actions { margin-top: 24px; flex-direction: column; }
  .hero-actions .btn { width: 100%; justify-content: center; }
  .events-grid, .theme-grid, .stats-grid { grid-template-columns: 1fr; }
  .section-head { flex-direction: column; align-items: flex-start; gap: 12px; }
  .theme-card { height: 240px; }
  .hero-scroll-hint { bottom: 90px; }
}
</style>

<style>
body.home-page .footer { margin-top: 0; }
</style>
