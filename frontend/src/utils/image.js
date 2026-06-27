/**
 * 图片 URL 处理工具
 * 统一处理后端返回的 cover 字段路径问题：
 *  - 后端 cover 字段中存在 "histroy" 拼写错误（应为 "history"）
 *  - 部分路径缺少前导斜杠
 *  - 部分字段为 null
 */
const BACKEND = 'http://localhost:8080'

// SVG 占位图（data URI，避免依赖任何外部文件，永远可用）
const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
  '<stop offset="0%" stop-color="#F5EFE4"/><stop offset="100%" stop-color="#ECE4D8"/>' +
  '</linearGradient></defs>' +
  '<rect width="400" height="300" fill="url(#g)"/>' +
  '<text x="200" y="140" font-family="serif" font-size="22" fill="#9C7C1A" text-anchor="middle">南昌历史云志</text>' +
  '<text x="200" y="175" font-family="sans-serif" font-size="13" fill="#9A9088" text-anchor="middle">图片暂无</text>' +
  '</svg>'

export const PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PLACEHOLDER_SVG)

/**
 * 归一化图片 URL
 * @param {string|null|undefined} path 后端返回的图片路径
 * @returns {string} 处理后的 URL（可直接用于 <img :src>）
 */
export function normalizeImgUrl(path) {
  if (!path || typeof path !== 'string') return PLACEHOLDER
  let p = path.trim()
  if (!p) return PLACEHOLDER
  // 已经是完整 URL 或 data URI，直接返回
  if (p.startsWith('http') || p.startsWith('data:')) return p
  // 修复后端历史遗留拼写错误：histroy → history
  p = p.replace(/histroy/gi, 'history')
  // 添加前导斜杠以匹配 Vite public 目录
  if (!p.startsWith('/')) p = '/' + p
  return p
}

/**
 * 构造人物头像 URL
 * @param {string|null|undefined} cover 后端返回的 cover 字段
 * @param {string} name 人物姓名（用于默认头像路径）
 * @returns {string}
 */
export function personImgUrl(cover, name) {
  if (cover) return normalizeImgUrl(cover)
  if (name) return `/images/role/${name}.jpg`
  return PLACEHOLDER
}

/**
 * 图片加载失败时的回退处理
 * 用法：<img :src="..." @error="onImgError" />
 *
 * 回退策略：
 *  1. 第一次失败 → 尝试从后端服务加载（使用已修正的正确 history 路径）
 *  2. 第二次失败 → 使用 SVG 占位图
 */
export function onImgError(e) {
  const img = e.target
  if (!(img instanceof HTMLImageElement)) return
  // 已经回退过一次，使用占位图
  if (img.dataset.fb === '1') {
    img.src = PLACEHOLDER
    return
  }
  img.dataset.fb = '1'
  // 当前 src 已经是 normalizeImgUrl 处理过的正确路径（history 拼写）
  // 直接拼到后端服务地址上加载（后端静态目录也是 history 拼写）
  let src = img.getAttribute('src') || ''
  if (src.startsWith('/')) src = src.slice(1)
  img.src = `${BACKEND}/${src}`
}
