import request from './request'

// 统计概览
export const statsOverview = () =>
  request.get('/quiz/statistics/overview')

// 每日答题统计
export const statsDaily = () =>
  request.get('/quiz/statistics/daily')

// 答题类型分布
export const statsType = () =>
  request.get('/quiz/statistics/type')

// 仪表盘聚合数据
export const statsDashboard = () =>
  request.get('/quiz/statistics/dashboard')
