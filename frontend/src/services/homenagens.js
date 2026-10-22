import { request } from './api'

// Rotas públicas, acessadas pelo token do link de contribuição
export const buscarFormulario = (token) => request(`/homenagem/c/${token}`)

// Enviado como multipart para permitir o upload; a imagem vem como `imagem` (File) ou `imagemUrl`
export function enviarHomenagem(token, { mensagem, imagem, imagemUrl }) {
  const dados = new FormData()
  if (mensagem) dados.append('mensagem', mensagem)
  if (imagem) dados.append('imagem', imagem)
  if (imagemUrl) dados.append('imagemUrl', imagemUrl)
  return request(`/homenagem/c/${token}`, { method: 'POST', body: dados })
}

export const excluirHomenagem = (id) => request(`/homenagem/r/${id}`, { method: 'DELETE' })
