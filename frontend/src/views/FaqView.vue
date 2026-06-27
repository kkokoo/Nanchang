<script setup>
import { ref, onMounted } from 'vue'
import { messageList, messageSubmit, messageSearch } from '@/api/message'
import { useUserStore } from '@/stores/user'
import { useGsap } from '@/composables/useGsap'
import PageHero from '@/components/common/PageHero.vue'

const { scrollReveal, ScrollTrigger } = useGsap()
const user = useUserStore()

const messages = ref([])
const loading = ref(true)
const content = ref('')
const submitting = ref(false)
const keyword = ref('')
const page = ref(0)
const total = ref(0)

async function load() {
  loading.value = true
  try {
    const res = keyword.value.trim()
      ? await messageSearch({ keyword: keyword.value.trim(), page: page.value, size: 10 })
      : await messageList({ page: page.value, size: 10 })
    const data = res.data || res
    messages.value = data.list || []
    total.value = data.total || 0
  } catch (e) { console.error(e) } finally {
    loading.value = false
    setTimeout(() => { scrollReveal('.reveal-item'); ScrollTrigger.refresh() }, 50)
  }
}

async function submit() {
  if (!content.value.trim()) return
  if (!user.userId) { alert('请先登录后再留言'); return }
  submitting.value = true
  try {
    await messageSubmit({ userId: user.userId, content: content.value.trim() })
    content.value = ''
    page.value = 0
    await load()
  } catch (e) { alert('提交失败') } finally { submitting.value = false }
}

function search() { page.value = 0; load() }
function prevPage() { if (page.value > 0) { page.value--; load() } }
function nextPage() { if ((page.value + 1) * 10 < total.value) { page.value++; load() } }

onMounted(load)
</script>

<template>
  <div class="page">
    <PageHero title="用户留言" subtitle="留下你对南昌历史的感悟与思考" :bread="[{ label: '用户留言' }]" />

    <section class="section">
      <div class="container faq-wrap">
        <!-- 留言表单 -->
        <div class="form-card card-glass reveal-item">
          <h3 class="font-serif">发表留言</h3>
          <textarea v-model="content" placeholder="写下你的想法…" rows="4"></textarea>
          <div class="form-actions">
            <span class="form-hint" v-if="!user.userId">需登录后留言</span>
            <button class="btn btn-primary" @click="submit" :disabled="submitting || !content.trim()">
              {{ submitting ? '提交中…' : '发布留言' }}
            </button>
          </div>
        </div>

        <!-- 搜索 -->
        <div class="search-row reveal-item">
          <input v-model="keyword" placeholder="搜索留言关键词" @keyup.enter="search" />
          <button class="btn btn-ghost" @click="search">搜索</button>
        </div>

        <!-- 留言列表 -->
        <div v-if="loading" class="loading-tip">加载中…</div>
        <div v-else-if="!messages.length" class="empty">暂无留言，快来抢沙发～</div>
        <div v-else class="msg-list">
          <div v-for="m in messages" :key="m.id" class="msg-item card-glass reveal-item">
            <div class="msg-head">
              <span class="msg-avatar">{{ (m.username || '游').charAt(0) }}</span>
              <div>
                <p class="msg-user">{{ m.username || '游客' }}</p>
                <p class="msg-time">{{ m.createTime }}</p>
              </div>
              <span v-if="m.status === 'replied'" class="tag tag-gold">已回复</span>
              <span v-else class="tag tag-light">待回复</span>
            </div>
            <p class="msg-content">{{ m.content }}</p>
            <div v-if="m.replyContent" class="msg-reply">
              <strong>管理员回复：</strong>{{ m.replyContent }}
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > 10" class="pager">
          <button class="btn btn-ghost btn-sm" :disabled="page === 0" @click="prevPage">上一页</button>
          <span>第 {{ page + 1 }} 页</span>
          <button class="btn btn-ghost btn-sm" :disabled="(page + 1) * 10 >= total" @click="nextPage">下一页</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-wrap { max-width: 760px; margin: 0 auto; }
.form-card { padding: 28px; margin-bottom: 24px; }
.form-card h3 { font-size: 20px; font-weight: 700; color: var(--nc-ink); margin-bottom: 16px; }
.form-card textarea { width: 100%; padding: 14px; border: 1.5px solid var(--nc-line); border-radius: var(--r-md); resize: vertical; outline: none; font-size: 15px; transition: border-color .2s; }
.form-card textarea:focus { border-color: var(--nc-red); }
.form-actions { margin-top: 14px; display: flex; justify-content: space-between; align-items: center; }
.form-hint { font-size: 13px; color: var(--nc-text-mute); }
.search-row { display: flex; gap: 10px; margin-bottom: 24px; }
.search-row input { flex: 1; padding: 10px 18px; border: 1.5px solid var(--nc-line); border-radius: var(--r-full); outline: none; }
.search-row input:focus { border-color: var(--nc-red); }
.msg-list { display: flex; flex-direction: column; gap: 16px; }
.msg-item { padding: 22px; }
.msg-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.msg-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--grad-red); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.msg-user { font-size: 15px; font-weight: 600; color: var(--nc-text); }
.msg-time { font-size: 12px; color: var(--nc-text-mute); }
.msg-head .tag { margin-left: auto; }
.msg-content { font-size: 15px; color: var(--nc-text); line-height: 1.8; }
.msg-reply { margin-top: 14px; padding: 14px; background: var(--nc-paper-warm); border-radius: var(--r-sm); font-size: 14px; color: var(--nc-text-sub); border-left: 3px solid var(--nc-gold); }
.loading-tip, .empty { text-align: center; padding: 60px 0; color: var(--nc-text-mute); }
.pager { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 32px; font-size: 14px; color: var(--nc-text-sub); }
</style>
