import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  const isLogin = computed(() => !!userInfo.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const userId = computed(() => userInfo.value?.id || null)

  async function login(form) {
    const res = await loginApi(form)
    if (res.code === 1 && res.data) {
      userInfo.value = res.data
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      localStorage.setItem('username', res.data.username || '')
      return res
    }
    throw new Error(res.msg || '登录失败')
  }

  async function register(form) {
    return registerApi(form)
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('userInfo')
    localStorage.removeItem('username')
  }

  return { token, userInfo, isLogin, isAdmin, userId, login, register, logout }
})
