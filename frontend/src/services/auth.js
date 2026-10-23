import { request } from './api'

export const login = (email, senha) =>
  request('/auth/login', { method: 'POST', body: { email, senha } })
