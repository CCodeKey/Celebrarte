import { request } from './api'

export const cadastrarUsuario = (dados) => request('/user/n', { method: 'POST', body: dados })

export const buscarUsuarioLogado = () => request('/user/me')

// Se a senha vier vazia, o backend mantém a atual
export const editarUsuario = (dados) => request('/user/e', { method: 'PUT', body: dados })

export const excluirUsuario = () => request('/user/r', { method: 'DELETE' })
