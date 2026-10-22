import { request } from './api'

export const listarCelebracoes = () => request('/celebracao')

export const buscarCelebracao = (id) => request(`/celebracao/f/${id}`)

export const listarHomenagensRecebidas = (id) => request(`/celebracao/${id}/h`)

export const criarCelebracao = (dados) => request('/celebracao/n', { method: 'POST', body: dados })

export const editarCelebracao = (id, dados) =>
  request(`/celebracao/e/${id}`, { method: 'PUT', body: dados })

export const excluirCelebracao = (id) => request(`/celebracao/r/${id}`, { method: 'DELETE' })
