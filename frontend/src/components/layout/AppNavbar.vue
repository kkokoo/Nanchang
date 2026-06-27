<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const scrolled = ref(false)
const mobileOpen = ref(false)
const navbarRef = ref(null)

const navs = [
  { to: '/', label: '首页' },
  { to: '/events', label: '历史事件' },
  { to: '/special-81', label: '八一专题' },
  { to: '/figures', label: '历史人物' },
  { to: '/timeline', label: '历史长河' },
  { to: '/faq', label: '用户留言' },
  { to: '/quiz', label: '互动问答' }
]

let scrollHandler = null
let clickHandler = null

function handleLogout() {
  user.logout()
  router.push('/')
}

function closeMobileMenu() { mobileOpen.value = false }

// 路由变化时关闭移动端菜单
watch(() => route.path, () => { mobileOpen.value = false })

onMounted(() => {
  scrollHandler = () => { scrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  // 点击导航栏外部关闭移动端菜单
  clickHandler = (e) => {
    if (mobileOpen.value && navbarRef.value && !navbarRef.value.contains(e.target)) {
      mobileOpen.value = false
    }
  }
  document.addEventListener('click', clickHandler)
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (clickHandler) document.removeEventListener('click', clickHandler)
})
</script>

<template>
  <header ref="navbarRef" class="navbar" :class="{ 'is-scrolled': scrolled }">
    <div class="container nav-inner">
      <RouterLink to="/" class="nav-brand nav-anim" style="--anim-delay: 0s" @click="closeMobileMenu">
        <span class="brand-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2 2 7v2h20V7L12 2zM4 11v7H2v2h20v-2h-2v-7h-2v7h-3v-7h-2v7h-2v-7H9v7H6v-7H4z"/>
          </svg>
        </span>
        <span class="brand-text">南昌历史<span class="brand-accent">云志</span></span>
      </RouterLink>

      <nav class="nav-links" :class="{ open: mobileOpen }">
        <RouterLink
          v-for="(n, i) in navs"
          :key="n.to"
          :to="n.to"
          class="nav-link-item nav-anim"
          :class="{ 'is-active': route.path === n.to }"
          :style="{ '--anim-delay': (0.08 + i * 0.05) + 's' }"
          @click="closeMobileMenu"
        >
          {{ n.label }}
        </RouterLink>
      </nav>

      <div class="nav-actions">
        <RouterLink to="/search" class="nav-action icon-btn nav-anim" title="搜索" style="--anim-delay: 0.45s">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </RouterLink>
        <template v-if="user.isLogin">
          <RouterLink to="/profile" class="nav-action user-btn btn btn-ghost btn-sm nav-anim" :title="user.userInfo.username" style="--anim-delay: 0.52s">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 3-9 7v1h18v-1c0-4-4-7-9-7z"/></svg>
            <span class="user-name">{{ user.userInfo.username }}</span>
          </RouterLink>
          <button @click="handleLogout" class="nav-action btn btn-outline btn-sm nav-anim" title="退出登录" style="--anim-delay: 0.58s">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            退出
          </button>
        </template>
        <template v-else>
          <RouterLink to="/register" class="nav-action btn btn-primary btn-sm nav-anim" style="--anim-delay: 0.52s">
            登录 / 注册
          </RouterLink>
        </template>
      </div>

      <button class="nav-toggle" @click.stop="mobileOpen = !mobileOpen" aria-label="菜单">
        <span :class="{ open: mobileOpen }"></span>
        <span :class="{ open: mobileOpen }"></span>
        <span :class="{ open: mobileOpen }"></span>
      </button>
    </div>

    <!-- 移动端下拉面板 -->
    <div class="mobile-panel" :class="{ open: mobileOpen }">
      <nav class="mobile-nav">
        <RouterLink
          v-for="n in navs"
          :key="n.to"
          :to="n.to"
          class="mobile-link-item"
          :class="{ 'is-active': route.path === n.to }"
          @click="closeMobileMenu"
        >
          {{ n.label }}
        </RouterLink>
      </nav>
      <div class="mobile-actions">
        <RouterLink to="/search" class="mobile-action-item" @click="closeMobileMenu">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          搜索
        </RouterLink>
        <template v-if="user.isLogin">
          <RouterLink to="/profile" class="mobile-action-item" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 3-9 7v1h18v-1c0-4-4-7-9-7z"/></svg>
            {{ user.userInfo.username }}
          </RouterLink>
          <button @click="handleLogout(); closeMobileMenu()" class="mobile-action-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            退出登录
          </button>
        </template>
        <template v-else>
          <RouterLink to="/register" class="mobile-action-item highlight" @click="closeMobileMenu">
            登录 / 注册
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes navSlideDown {
  from { transform: translateY(-8px); }
  to { transform: translateY(0); }
}

.nav-anim {
  opacity: 1;
  transform: translateY(0);
  animation: navSlideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: var(--anim-delay, 0s);
}

.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h);
  background: rgba(251, 248, 243, 0.85);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent;
  transition: background-color .3s ease, border-color .3s ease, box-shadow .3s ease;
}
.navbar.is-scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: var(--nc-line);
  box-shadow: 0 4px 20px rgba(120, 60, 30, 0.08);
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 100%; gap: 12px; }

.nav-brand { display: flex; align-items: center; gap: 8px; height: 100%; font-weight: 800; font-size: 18px; color: var(--nc-ink); letter-spacing: 0.5px; flex-shrink: 0; }
.brand-icon { color: var(--nc-red); display: flex; }
.brand-accent { color: var(--nc-red); }

.nav-links { display: flex; align-items: center; height: 100%; gap: 2px; flex: 1; justify-content: center; min-width: 0; }
.nav-link-item {
  display: inline-flex; align-items: center; justify-content: center;
  height: 36px; padding: 0 10px; border-radius: var(--r-sm);
  color: var(--nc-text-sub); font-weight: 500; font-size: 13.5px; line-height: 1;
  transition: color .2s ease, background-color .2s ease; position: relative; white-space: nowrap;
}
.nav-link-item:hover { color: var(--nc-red); background: var(--nc-red-bg); }
.nav-link-item.is-active { color: var(--nc-red); font-weight: 600; }
.nav-link-item.is-active::after {
  content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%);
  width: 18px; height: 2px; border-radius: 2px; background: var(--grad-red);
}

.nav-actions { display: flex; align-items: center; height: 100%; gap: 8px; flex-shrink: 0; }
.nav-actions .btn-sm { height: 34px; padding: 0 12px; line-height: 1; font-size: 13px; }
.user-btn { gap: 6px; }
.user-btn .user-name { max-width: 80px; overflow: hidden; text-overflow: ellipsis; }
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: var(--r-sm);
  color: var(--nc-text-sub); transition: color .2s ease, background-color .2s ease;
}
.icon-btn:hover { background: var(--nc-red-bg); color: var(--nc-red); }

.btn-outline {
  background: transparent; color: var(--nc-text-sub);
  border: 1.5px solid var(--nc-line); gap: 4px;
}
.btn-outline:hover { border-color: var(--nc-red); color: var(--nc-red); background: var(--nc-red-bg); }

.nav-toggle { display: none; flex-direction: column; gap: 5px; padding: 8px; background: none; border: none; cursor: pointer; z-index: 1001; }
.nav-toggle span { width: 22px; height: 2px; background: var(--nc-ink); border-radius: 2px; transition: all .3s; }
.nav-toggle span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle span.open:nth-child(2) { opacity: 0; }
.nav-toggle span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* 移动端面板 */
.mobile-panel { display: none; }

@media (max-width: 1100px) {
  .nav-link-item { padding: 0 8px; font-size: 13px; }
  .nav-brand { font-size: 17px; }
}

@media (max-width: 960px) {
  .nav-toggle { display: flex; }
  .nav-actions { display: none; }
  .nav-links { display: none; }
  .nav-inner { gap: 8px; }

  /* 移动端下拉面板 */
  .mobile-panel {
    display: block;
    position: absolute; top: var(--nav-h); left: 0; right: 0;
    background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--nc-line);
    max-height: 0; overflow: hidden; pointer-events: none;
    transition: max-height .35s ease, opacity .3s ease, padding .3s ease;
    opacity: 0; padding: 0 16px;
    box-shadow: 0 8px 24px rgba(120, 60, 30, 0.08);
  }
  .mobile-panel.open {
    max-height: 500px; opacity: 1; pointer-events: auto;
    padding: 8px 16px 16px;
  }
  .mobile-nav { display: flex; flex-direction: column; gap: 0; }
  .mobile-link-item {
    display: flex; align-items: center;
    padding: 12px 14px; font-size: 15px; font-weight: 500;
    color: var(--nc-text-sub); border-radius: var(--r-sm);
    transition: color .2s ease, background-color .2s ease;
  }
  .mobile-link-item:hover, .mobile-link-item.is-active {
    color: var(--nc-red); background: var(--nc-red-bg); font-weight: 600;
  }
  .mobile-actions {
    display: flex; flex-direction: column; gap: 0;
    margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--nc-line-soft);
  }
  .mobile-action-item {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; font-size: 15px; font-weight: 500;
    color: var(--nc-text-sub); border-radius: var(--r-sm);
    transition: color .2s ease, background-color .2s ease;
    background: none; border: none; cursor: pointer; text-align: left; width: 100%;
  }
  .mobile-action-item:hover, .mobile-action-item.highlight {
    color: var(--nc-red); background: var(--nc-red-bg);
  }
}

@media (max-width: 480px) {
  .brand-text { display: none; }
}
</style>
