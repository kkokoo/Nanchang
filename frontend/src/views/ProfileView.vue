<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { collectList } from '@/api/collect'
import { myMessages } from '@/api/message'
import { useGsap } from '@/composables/useGsap'

const router = useRouter()
const user = useUserStore()
const { gsap, scrollReveal, ScrollTrigger } = useGsap()
const collects = ref([])
const messages = ref([])
const tab = ref('collect')

async function loadData() {
  if (!user.userId) return
  try {
    const [c, m] = await Promise.all([
      collectList(user.userId).catch(() => ({ data: [] })),
      myMessages({ userId: user.userId }).catch(() => ({ data: {} }))
    ])
    collects.value = c.data || []
    messages.value = m.data?.list || []
  } catch (e) { console.error(e) } finally {
    setTimeout(() => { scrollReveal('.reveal-item'); ScrollTrigger.refresh() }, 50)
  }
}

function logout() {
  user.logout()
  router.push('/')
}

onMounted(() => {
  if (!user.isLogin) { router.push('/register'); return }
  gsap.from('.profile-card', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' })
  loadData()
})
</script>

<template>
  <div class="page">
    <div class="container profile-wrap">
      <div v-if="user.isLogin" class="profile-card card-glass">
        <div class="profile-head">
          <div class="avatar">{{ (user.userInfo.username || '?').charAt(0) }}</div>
          <div class="info">
            <h2 class="font-serif">{{ user.userInfo.username }}</h2>
            <p class="role">
              <span class="tag" :class="user.isAdmin ? 'tag-red' : 'tag-gold'">{{ user.isAdmin ? '管理员' : '普通用户' }}</span>
            </p>
          </div>
          <button class="btn btn-ghost btn-sm" @click="logout">退出登录</button>
        </div>

        <div class="tabs">
          <button class="tab" :class="{ active: tab === 'collect' }" @click="tab = 'collect'">我的收藏</button>
          <button class="tab" :class="{ active: tab === 'message' }" @click="tab = 'message'">我的留言</button>
        </div>

        <div v-if="tab === 'collect'" class="tab-content">
          <div v-if="!collects.length" class="empty-tip">还没有收藏内容，去 <RouterLink to="/events">探索事件</RouterLink> 吧～</div>
          <div v-else class="collect-list">
            <div v-for="c in collects" :key="c.collectId" class="collect-item reveal-item">
              <RouterLink :to="`/${c.contentType === 'event' ? 'event' : 'figure'}/${c.contentId}`" class="c-link">
                <span class="tag" :class="c.contentType === 'event' ? 'tag-red' : 'tag-gold'">{{ c.contentType === 'event' ? '事件' : '人物' }}</span>
                <span class="c-name">{{ c.contentName }}</span>
                <span class="c-time">{{ c.createTime }}</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <div v-else class="tab-content">
          <div v-if="!messages.length" class="empty-tip">还没有留言记录</div>
          <div v-else class="msg-list">
            <div v-for="m in messages" :key="m.id" class="my-msg reveal-item">
              <p class="m-content">{{ m.content }}</p>
              <div class="m-meta">
                <span class="m-time">{{ m.createTime }}</span>
                <span class="tag" :class="m.status === 'replied' ? 'tag-gold' : 'tag-light'">{{ m.status === 'replied' ? '已回复' : '待回复' }}</span>
              </div>
              <div v-if="m.replyContent" class="m-reply">管理员：{{ m.replyContent }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-wrap { max-width: 800px; margin: 0 auto; padding-top: 40px; }
.profile-card { padding: 32px; }
.profile-head { display: flex; align-items: center; gap: 20px; padding-bottom: 24px; border-bottom: 1px solid var(--nc-line); }
.avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--grad-red); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; }
.info h2 { font-size: 24px; font-weight: 800; color: var(--nc-ink); }
.role { margin-top: 6px; }
.profile-head .btn { margin-left: auto; }
.tabs { display: flex; gap: 8px; margin: 24px 0; }
.tab { padding: 10px 20px; border-radius: var(--r-sm); color: var(--nc-text-sub); font-weight: 500; font-size: 14px; transition: all .2s; }
.tab:hover { background: var(--nc-red-bg); color: var(--nc-red); }
.tab.active { background: var(--grad-red); color: #fff; }
.tab-content { min-height: 200px; }
.empty-tip { text-align: center; padding: 48px 0; color: var(--nc-text-mute); }
.empty-tip a { color: var(--nc-red); }
.collect-list, .msg-list { display: flex; flex-direction: column; gap: 12px; }
.collect-item { background: var(--nc-paper); border-radius: var(--r-sm); padding: 14px 18px; }
.c-link { display: flex; align-items: center; gap: 12px; }
.c-name { flex: 1; font-weight: 600; color: var(--nc-text); }
.c-time { font-size: 12px; color: var(--nc-text-mute); }
.my-msg { padding: 16px; background: var(--nc-paper); border-radius: var(--r-sm); }
.m-content { font-size: 14px; color: var(--nc-text); }
.m-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.m-time { font-size: 12px; color: var(--nc-text-mute); }
.m-reply { margin-top: 10px; padding: 10px; background: var(--nc-paper-warm); border-radius: var(--r-sm); font-size: 13px; color: var(--nc-text-sub); border-left: 3px solid var(--nc-gold); }
</style>
