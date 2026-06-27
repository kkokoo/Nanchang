<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { timelineList } from '@/api/timeline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const list = ref([])
const loading = ref(true)
const trackRef = ref(null)
const sectionRef = ref(null)
const innerRef = ref(null)

let ctx = null

onMounted(async () => {
  try {
    list.value = (await timelineList()) || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    await nextTick()
    setupHorizontalScroll()
  }
})

function setupHorizontalScroll() {
  if (!trackRef.value || !innerRef.value || !list.value.length) return

  const inner = innerRef.value

  // 计算需要横向移动的距离
  const getScrollAmount = () => {
    const trackWidth = inner.scrollWidth
    const viewportWidth = window.innerWidth
    return -(trackWidth - viewportWidth)
  }

  // 使用 gsap.context 确保动画和 ScrollTrigger 可以统一清理
  ctx = gsap.context(() => {
    gsap.to(inner, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })
  }, sectionRef.value)

  // 等待布局完成后刷新
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

onUnmounted(() => {
  if (ctx) ctx.revert()
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="page timeline-page">
    <!-- 固定背景 -->
    <div class="tl-bg"></div>

    <!-- 标题区 -->
    <div class="tl-header" v-if="!loading && list.length">
      <h1 class="tl-title font-serif">南昌历史云志・八一发展脉络</h1>
      <p class="tl-subtitle">英雄城・一九二七・风云激荡</p>
      <div class="tl-scroll-hint">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 17l5-5-5-5v10zm2-15a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" opacity="0.5"/></svg>
        <span>向下滚动，沿时间长河溯源南昌历史</span>
      </div>
    </div>

    <!-- 加载/空状态 -->
    <div v-if="loading" class="tl-loading">加载中…</div>
    <div v-else-if="!list.length" class="tl-empty">暂无时间线数据</div>

    <!-- GSAP 横向滚动区 -->
    <section v-else ref="sectionRef" class="tl-section">
      <div ref="trackRef" class="tl-track">
        <div ref="innerRef" class="tl-inner">
          <!-- 波浪曲线 -->
          <div class="tl-wave"></div>

          <!-- 时间节点 -->
          <div
            v-for="(item, i) in list"
            :key="item.nodeId"
            class="tl-node"
            :class="{ 'is-top': i % 2 === 0, 'is-bottom': i % 2 === 1 }"
          >
            <div class="tl-card">
              <div class="tl-time">{{ item.timePoint }}</div>
              <div class="tl-name">{{ item.eventName || '历史节点' }}</div>
              <p class="tl-desc">{{ item.description }}</p>
              <RouterLink v-if="item.eventId" :to="`/event/${item.eventId}`" class="tl-link">
                查看详情
              </RouterLink>
            </div>
            <div class="tl-dot"></div>
          </div>

          <!-- 末尾留白 -->
          <div class="tl-end-pad"></div>
        </div>
      </div>
    </section>

    <!-- 滚动结束后的补充内容 -->
    <section v-if="!loading && list.length" class="tl-epilogue">
      <div class="epilogue-inner">
        <div class="epilogue-quote">
          <span class="quote-mark">"</span>
          <p>一城风华，千载史章。从灌婴筑城到八一起义，南昌的每一段历史都在时间长河中熠熠生辉。</p>
          <span class="quote-mark end">"</span>
        </div>

        <div class="epilogue-stats">
          <div class="stat-item">
            <div class="stat-num font-serif">{{ list.length }}</div>
            <div class="stat-label">历史节点</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num font-serif">2000+</div>
            <div class="stat-label">年建城史</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num font-serif">1927</div>
            <div class="stat-label">八一起义</div>
          </div>
        </div>

        <div class="epilogue-links">
          <RouterLink to="/events" class="epilogue-link">
            <span>浏览全部历史事件</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
          </RouterLink>
          <RouterLink to="/special-81" class="epilogue-link">
            <span>进入八一专题</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
          </RouterLink>
          <RouterLink to="/figures" class="epilogue-link">
            <span>认识历史人物</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
          </RouterLink>
        </div>

        <button class="epilogue-top" @click="scrollToTop">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
          回到顶部
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 旧版背景 */
.tl-bg {
  position: fixed;
  inset: 0;
  background: url('/img/bg_scroll.jpg') no-repeat center;
  background-size: 100% 100%;
  background-attachment: fixed;
  background-color: #f5efe0;
  z-index: 0;
}

.timeline-page {
  position: relative;
  z-index: 1;
}

/* 标题区 */
.tl-header {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 100px 20px 40px;
}

.tl-title {
  font-size: 2.4rem;
  font-weight: bold;
  color: #5c2b2b;
  margin: 0;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.6);
}

.tl-subtitle {
  font-size: 1.1rem;
  color: #6D4B36;
  margin-top: 8px;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
  text-shadow: 0 1px 4px rgba(255, 255, 255, 0.6);
}

.tl-scroll-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  font-size: 14px;
  color: #8B6F47;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
  animation: hint-bounce 2s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(4px); opacity: 1; }
}

/* 横向滚动区 */
.tl-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.tl-track {
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.tl-inner {
  display: flex;
  align-items: center;
  min-width: max-content;
  padding-left: 80px;
  padding-right: 80px;
  gap: 160px;
  position: relative;
  will-change: transform;
}

/* 波浪曲线 */
.tl-wave {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 200px;
  transform: translateY(-50%);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="200" viewBox="0 0 2000 200"><path d="M0,100 C400,30 600,170 1000,100 C1400,30 1600,170 2000,100" fill="none" stroke="%238B2F2F" stroke-width="5" stroke-linecap="round"/></svg>');
  background-repeat: repeat-x;
  background-position: center;
  background-size: 2000px 200px;
  pointer-events: none;
  z-index: 0;
}

/* 时间节点 */
.tl-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

/* 卡片 */
.tl-card {
  width: 340px;
  padding: 32px;
  background: rgba(255, 253, 245, 0.85);
  border-radius: 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border: none;
  line-height: 1.6;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
  backdrop-filter: blur(4px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tl-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}

.tl-time {
  font-size: 22px;
  font-weight: bold;
  color: #8B2F2F;
  margin-bottom: 8px;
}

.tl-name {
  font-size: 24px;
  font-weight: bold;
  color: #6B3A2B;
  margin-bottom: 12px;
}

.tl-desc {
  font-size: 20px;
  color: #3a2b1c;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tl-link {
  font-size: 20px;
  color: #A04040;
  text-decoration: none;
  transition: color 0.2s;
}

.tl-link:hover {
  text-decoration: underline;
  color: #8B2F2F;
}

/* 卡片上下交替 */
.tl-node.is-top .tl-card {
  margin-bottom: 140px;
}

.tl-node.is-bottom .tl-card {
  margin-top: 140px;
}

/* 圆点 */
.tl-dot {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #a84444;
  border: 4px solid rgba(245, 239, 224, 0.9);
  box-shadow: 0 0 0 2px #8B2F2F;
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  flex-shrink: 0;
}

.tl-end-pad {
  flex-shrink: 0;
  width: 40px;
}

/* 加载/空状态 */
.tl-loading,
.tl-empty {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #8B6F47;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
  z-index: 10;
}

/* 响应式 */
@media (max-width: 768px) {
  .tl-card {
    width: 280px;
    padding: 24px;
  }

  .tl-time { font-size: 18px; }
  .tl-name { font-size: 20px; }
  .tl-desc { font-size: 16px; }
  .tl-link { font-size: 16px; }

  .tl-inner {
    gap: 100px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .tl-node.is-top .tl-card { margin-bottom: 100px; }
  .tl-node.is-bottom .tl-card { margin-top: 100px; }

  .tl-title { font-size: 1.8rem; }
  .tl-subtitle { font-size: 1rem; }
  .tl-header { padding: 80px 16px 20px; }
}

@media (max-width: 480px) {
  .tl-card {
    width: 240px;
    padding: 20px;
  }

  .tl-time { font-size: 16px; }
  .tl-name { font-size: 18px; }
  .tl-desc { font-size: 14px; }
  .tl-link { font-size: 14px; }

  .tl-inner {
    gap: 80px;
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* 滚动结束后补充内容 */
.tl-epilogue {
  position: relative;
  z-index: 2;
  padding: 80px 24px 120px;
  background: rgba(245, 239, 224, 0.85);
  backdrop-filter: blur(8px);
}

.epilogue-inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
}

.epilogue-quote {
  position: relative;
  padding: 0 40px;
  margin-bottom: 48px;
}

.epilogue-quote p {
  font-size: 20px;
  line-height: 2;
  color: #5c2b2b;
  margin: 0;
}

.quote-mark {
  font-size: 56px;
  color: #8B2F2F;
  opacity: 0.3;
  position: absolute;
  top: -10px;
  left: 0;
  font-family: serif;
}

.quote-mark.end {
  top: auto;
  bottom: -30px;
  right: 0;
  left: auto;
}

.epilogue-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 48px;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 36px;
  font-weight: bold;
  color: #8B2F2F;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8B6F47;
  margin-top: 6px;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(139, 47, 47, 0.2);
}

.epilogue-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-bottom: 40px;
}

.epilogue-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 16px;
  color: #6B3A2B;
  background: rgba(255, 253, 245, 0.7);
  border: 1px solid rgba(139, 47, 47, 0.15);
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.25s ease;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
}

.epilogue-link:hover {
  color: #8B2F2F;
  border-color: #8B2F2F;
  background: rgba(255, 253, 245, 0.95);
  transform: translateX(4px);
}

.epilogue-link svg {
  transition: transform 0.25s ease;
}

.epilogue-link:hover svg {
  transform: translateX(3px);
}

.epilogue-top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  font-size: 14px;
  color: #8B6F47;
  background: transparent;
  border: 1.5px solid rgba(139, 111, 71, 0.3);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
}

.epilogue-top:hover {
  color: #8B2F2F;
  border-color: #8B2F2F;
  background: rgba(255, 253, 245, 0.5);
}

@media (max-width: 768px) {
  .epilogue-quote p { font-size: 17px; }
  .epilogue-stats { gap: 20px; }
  .stat-num { font-size: 28px; }
  .epilogue-link { font-size: 14px; padding: 10px 22px; }
  .tl-epilogue { padding: 60px 16px 80px; }
}
</style>
