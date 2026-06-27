import request from './request'

// 用户登录
export const login = (data) => request.post('/user/login', data)
// 普通用户注册
export const register = (data) => request.post('/user/register', data)
// 管理员注册
export const adminRegister = (data) => request.post('/user/admin/register', data)
// 用户列表
export const userList = () => request.get('/user/list')
// 用户详情
export const getUser = (id) => request.get(`/user/get/${id}`)
