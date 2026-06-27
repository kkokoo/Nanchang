import request from './request'

// 智谱 AI 对话
export const chat = (data) => request.post('/api/chat', data)
