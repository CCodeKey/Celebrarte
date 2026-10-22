import { request } from './api'

// Rotas públicas, acessadas pelo token do link de contribuição
export const buscarFormulario = (token) => request(`/homenagem/c/${token}`)

export const enviarHomenagem = (token, dados) =>
  request(`/homenagem/c/${token}`, { method: 'POST', body: dados })

export const excluirHomenagem = (id) => request(`/homenagem/r/${id}`, { method: 'DELETE' })
