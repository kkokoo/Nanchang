<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { chat } from '@/api/chat'
import { useGsap } from '@/composables/useGsap'
import { onImgError } from '@/utils/image'

const { gsap } = useGsap()
const botImg = '/images/hongxiaoxing.png'
const messages = ref([
  { role: 'ai', text: '哈喽！我是南昌 IP 洪小星，你可以问我任何关于南昌历史的问题哦～' }
])
const input = ref('')
const sending = ref(false)
const msgList = ref(null)

const quickQs = ['八一南昌起义', '灌婴筑城', '滕王阁', '洪都之战', '许逊治水']

async function send(text) {
  const t = (text || input.value).trim()
  if (!t || sending.value) return
  messages.value.push({ role: 'user', text: t })
  input.value = ''
  sending.value = true
  await scrollToBottom()
  try {
    const res = await chat({ message: t, history: messages.value.slice(-6).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })) })
    messages.value.push({ role: 'ai', text: res.response || res.data?.response || '抱歉，我没有理解，换个问题试试？' })
  } catch (e) {
    messages.value.push({ role: 'ai', text: '网络似乎开了点小差，稍后再试～' })
  } finally {
    sending.value = false
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()
  if (msgList.value) msgList.value.scrollTop = msgList.value.scrollHeight
}

onMounted(() => {
  gsap.from('.chat-stage', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
})
</script>

<template>
  <div class="page chat-page">
    <div class="container chat-stage">
      <div class="chat-header">
        <img :src="botImg" alt="洪小星" class="bot-avatar" @error="onImgError" />
        <div>
          <h2 class="font-serif">洪小星 · 南昌历史小管家</h2>
          <p> powered by 智谱 AI</p>
        </div>
      </div>

      <div class="chat-body card-glass">
        <div ref="msgList" class="msg-list">
          <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role">
            <img v-if="m.role === 'ai'" :src="botImg" class="msg-avatar" alt="" @error="onImgError" />
            <div class="bubble">{{ m.text }}</div>
          </div>
          <div v-if="sending" class="msg ai">
            <img :src="botImg" class="msg-avatar" alt="" @error="onImgError" />
            <div class="bubble typing"><span></span><span></span><span></span></div>
          </div>
        </div>

        <div class="quick-qs">
          <button v-for="q in quickQs" :key="q" class="quick-q" @click="send(q)">{{ q }}</button>
        </div>

        <div class="chat-input">
          <input v-model="input" placeholder="提问南昌历史…" @keyup.enter="send" :disabled="sending" />
          <button class="btn btn-primary" @click="send()" :disabled="sending || !input.trim()">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page { padding-top: calc(var(--nav-h) + 24px); }
.chat-stage { max-width: 820px; margin: 0 auto; }
.chat-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.bot-avatar { width: 60px; height: 60px; border-radius: 50%; border: 3px solid #fff; box-shadow: var(--shadow-md); }
.chat-header h2 { font-size: 20px; font-weight: 700; color: var(--nc-ink); }
.chat-header p { font-size: 12px; color: var(--nc-text-mute); }
.chat-body { padding: 0; overflow: hidden; }
.msg-list { height: 440px; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; background: var(--nc-paper); }
.msg { display: flex; gap: 10px; align-items: flex-start; }
.msg.user { flex-direction: row-reverse; }
.msg-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
.bubble { max-width: 70%; padding: 12px 16px; border-radius: 14px; font-size: 14px; line-height: 1.6; }
.msg.ai .bubble { background: #fff; color: var(--nc-text); border: 1px solid var(--nc-line-soft); border-top-left-radius: 4px; }
.msg.user .bubble { background: var(--grad-red); color: #fff; border-top-right-radius: 4px; }
.typing { display: flex; gap: 4px; align-items: center; }
.typing span { width: 8px; height: 8px; border-radius: 50%; background: var(--nc-text-mute); animation: typing 1.2s infinite; }
.typing span:nth-child(2) { animation-delay: .2s; }
.typing span:nth-child(3) { animation-delay: .4s; }
@keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-6px); opacity: 1; } }
.quick-qs { display: flex; gap: 8px; padding: 12px 24px; flex-wrap: wrap; border-top: 1px solid var(--nc-line); }
.quick-q { padding: 5px 14px; border-radius: var(--r-full); background: var(--nc-red-bg); color: var(--nc-red); font-size: 13px; transition: all .2s; }
.quick-q:hover { background: var(--nc-red); color: #fff; }
.chat-input { display: flex; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--nc-line); background: #fff; }
.chat-input input { flex: 1; padding: 12px 18px; border: 1.5px solid var(--nc-line); border-radius: var(--r-full); outline: none; font-size: 14px; }
.chat-input input:focus { border-color: var(--nc-red); }
</style>
