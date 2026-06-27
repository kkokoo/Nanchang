import axios from 'axios'

const service = axios.create({
  baseURL: '/',
  timeout: 15000
})

// 请求拦截：附加 loading 条
let loadCount = 0
function showLoader() {
  loadCount++
  let bar = document.getElementById('globalLoader')
  if (!bar) {
    bar = document.createElement('div')
    bar.id = 'globalLoader'
    bar.className = 'global-loader'
    document.body.appendChild(bar)
  }
  bar.style.width = '70%'
}
function hideLoader() {
  loadCount = Math.max(0, loadCount - 1)
  if (loadCount === 0) {
    const bar = document.getElementById('globalLoader')
    if (bar) {
      bar.style.width = '100%'
      setTimeout(() => { bar.style.width = '0' }, 200)
    }
  }
}

service.interceptors.request.use(config => {
  showLoader()
  // 附加编辑者标识（写操作审计用）
  const editor = localStorage.getItem('username')
  if (editor) config.headers['X-Editor-Name'] = editor
  return config
})

service.interceptors.response.use(
  res => {
    hideLoader()
    return res.data
  },
  err => {
    hideLoader()
    return Promise.reject(err)
  }
)

export default service
