<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useGsap } from '@/composables/useGsap'

const router = useRouter()
const user = useUserStore()
const { gsap } = useGsap()

const form = ref({ username: '', password: '' })
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!form.value.username || !form.value.password) { error.value = '请填写用户名和密码'; return }
  loading.value = true
  try {
    if (isLogin.value) {
      await user.login(form.value)
      router.push('/profile')
    } else {
      await user.register(form.value)
      await user.login(form.value)
      router.push('/profile')
    }
  } catch (e) {
    error.value = e.message || '操作失败'
  } finally { loading.value = false }
}

function toggle() {
  isLogin.value = !isLogin.value
  error.value = ''
  gsap.fromTo('.auth-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
}
</script>

<template>
  <div class="page auth-page">
    <div class="auth-bg"></div>
    <div class="container auth-wrap">
      <div class="auth-card card-glass">
        <div class="auth-head">
          <h2 class="font-serif">{{ isLogin ? '欢迎回来' : '加入云志' }}</h2>
          <p>{{ isLogin ? '登录以开启你的历史探索之旅' : '注册账号，记录你的学习足迹' }}</p>
        </div>
        <form @submit.prevent="submit" class="auth-form">
          <div class="field">
            <label>用户名</label>
            <input v-model="form.username" type="text" placeholder="请输入用户名" />
          </div>
          <div class="field">
            <label>密码</label>
            <input v-model="form.password" type="password" placeholder="请输入密码" />
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
            {{ loading ? '处理中…' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>
        <p class="toggle-text">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <a @click="toggle">{{ isLogin ? '立即注册' : '去登录' }}</a>
        </p>
        <RouterLink to="/" class="back-link">返回首页</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; padding-top: var(--nav-h); position: relative; }
.auth-bg {
  position: fixed; inset: 0;
  background: url('/nanchang-bg.jpg') no-repeat center center;
  background-size: cover;
  z-index: -2;
}
.auth-page::before {
  content: ''; position: fixed; inset: 0; z-index: -1;
  background:
    linear-gradient(135deg, rgba(26,22,20,0.55) 0%, rgba(155,44,44,0.45) 50%, rgba(26,22,20,0.65) 100%),
    radial-gradient(ellipse at center, transparent 0%, rgba(26,22,20,0.3) 100%);
}
.auth-wrap { max-width: 440px; margin: 0 auto; width: 100%; }
.auth-card {
  padding: 48px 40px;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 24px 60px rgba(0,0,0,0.2);
}
.auth-head { text-align: center; margin-bottom: 32px; }
.auth-head h2 { font-size: 28px; font-weight: 800; color: var(--nc-ink); letter-spacing: 1px; }
.auth-head p { margin-top: 10px; font-size: 14px; color: var(--nc-text-sub); }
.auth-form { display: flex; flex-direction: column; gap: 18px; }
.field label { display: block; font-size: 13px; font-weight: 600; color: var(--nc-text-sub); margin-bottom: 6px; letter-spacing: 0.5px; }
.field input {
  width: 100%; padding: 13px 16px;
  border: 1.5px solid var(--nc-line);
  border-radius: var(--r-md);
  outline: none;
  transition: all .25s;
  background: rgba(255,255,255,0.7);
  font-size: 15px;
}
.field input:focus {
  border-color: var(--nc-red);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(197,48,48,0.08);
}
.error { color: var(--nc-red); font-size: 13px; padding: 8px 12px; background: var(--nc-red-bg); border-radius: var(--r-sm); }
.auth-form .btn { width: 100%; margin-top: 8px; }
.toggle-text { text-align: center; margin-top: 24px; font-size: 14px; color: var(--nc-text-sub); }
.toggle-text a { color: var(--nc-red); font-weight: 600; cursor: pointer; transition: color .2s; }
.toggle-text a:hover { color: var(--nc-red-dark); }
.back-link {
  display: block; text-align: center; margin-top: 16px; font-size: 13px;
  color: var(--nc-text-mute); transition: color .2s;
}
.back-link:hover { color: var(--nc-text-sub); }
</style>
