import request from './request'

// 人物列表（可按朝代/姓名过滤）
export const personList = (params) =>
  request.get('/api/person/list', { params })

// 人物详情
export const personDetail = (id) => request.get(`/api/person/${id}`)

// 简化人物列表
export const personSimpleList = () => request.get('/api/person/simple-list')

// 按姓名查找
export const personFindByName = (name) =>
  request.get('/api/person/findByName', { params: { name } })

// 人物相关事件
export const personRelatedEvents = (id) =>
  request.get(`/api/person/${id}/related-events`)

// 新增/编辑人物
export const personSave = (data) => request.post('/api/person/save', data)

// 删除人物
export const personDelete = (id) => request.delete(`/api/person/delete/${id}`)
