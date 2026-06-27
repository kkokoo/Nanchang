import request from './request'

// 提交留言
export const messageSubmit = (data) =>
  request.post('/api/message/submit', data)

// 留言列表
export const messageList = (params) =>
  request.get('/api/message/list', { params })

// 我的留言
export const myMessages = (params) =>
  request.get('/api/message/my', { params })

// 回复留言
export const messageReply = (messageId, data) =>
  request.post(`/api/message/reply/${messageId}`, data)

// 删除留言
export const messageDelete = (messageId) =>
  request.delete(`/api/message/delete/${messageId}`)

// 搜索留言
export const messageSearch = (params) =>
  request.get('/api/message/search', { params })
