import request from './request'

// 事件列表（可按朝代过滤）
export const eventList = (dynasty) =>
  request.get('/api/event/list', { params: { dynasty } })

// 事件详情
export const eventDetail = (id) => request.get(`/api/event/${id}`)

// 简化事件列表
export const eventSimpleList = () => request.get('/api/event/simple-list')

// 事件相关人物
export const eventRelatedPersons = (id) =>
  request.get(`/api/event/${id}/related-persons`)

// 新增/编辑事件
export const eventSave = (data) => request.post('/api/event/save', data)

// 删除事件
export const eventDelete = (id) => request.delete(`/api/event/delete/${id}`)
