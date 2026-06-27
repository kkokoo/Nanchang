import request from './request'

// 添加收藏
export const collectAdd = (data) => request.post('/api/collect/add', data)

// 取消收藏
export const collectRemove = (data) => request.post('/api/collect/remove', data)

// 检查是否已收藏
export const collectCheck = (params) =>
  request.get('/api/collect/check', { params })

// 用户收藏列表
export const collectList = (userId) =>
  request.get('/api/collect/list', { params: { userId } })
