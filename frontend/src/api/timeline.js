import request from './request'

// 获取所有时间线
export const timelineList = () => request.get('/api/timeline')
