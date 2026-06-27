import request from './request'

// 随机题目
export const questionRandom = (count = 10) =>
  request.get('/api/question/random', { params: { count } })

// 随机事件类题目
export const questionRandomEvent = (count = 10) =>
  request.get('/api/question/random/event', { params: { count } })

// 随机人物类题目
export const questionRandomPerson = (count = 10) =>
  request.get('/api/question/random/person', { params: { count } })

// 按事件 ID 获取题目
export const questionRandomByEvent = (eventId, count = 10) =>
  request.get(`/api/question/random/event/${eventId}`, { params: { count } })

// 按人物 ID 获取题目
export const questionRandomByPerson = (personId, count = 10) =>
  request.get(`/api/question/random/person/${personId}`, { params: { count } })

// 提交答案
export const questionSubmit = (data) =>
  request.post('/api/question/submit', data)

// 积分排行榜
export const leaderboard = (limit = 10) =>
  request.get('/api/question/leaderboard', { params: { limit } })

// 所有题目
export const questionList = () => request.get('/api/question/list')

// 题目详情
export const questionDetail = (id) => request.get(`/api/question/${id}`)

// 新增题目
export const questionAdd = (data) => request.post('/api/question/add', data)

// 更新题目
export const questionUpdate = (id, data) =>
  request.put(`/api/question/update/${id}`, data)

// 删除题目
export const questionDelete = (id) =>
  request.delete(`/api/question/delete/${id}`)
