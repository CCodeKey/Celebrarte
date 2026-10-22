const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const CHAVE_SESSAO = 'celebrarte.sessao'

// Erro com o status HTTP e a mensagem do ErroDto devolvido pelo backend
export class ApiError extends Error {
  constructor(status, mensagem) {
    super(mensagem)
    this.status = status
  }
}

export function lerSessao() {
  try {
    const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO))
    if (sessao && new Date(sessao.expiraEm) > new Date()) return sessao
  } catch {
    // sessão corrompida: tratada como inexistente
  }
  localStorage.removeItem(CHAVE_SESSAO)
  return null
}

export function salvarSessao(sessao) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_SESSAO)
}

// Chamado quando uma rota administrativa responde 401 (token inválido ou expirado)
let aoExpirarSessao = () => {}
export function definirAoExpirarSessao(callback) {
  aoExpirarSessao = callback
}

const MENSAGENS_PADRAO = {
  0: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  500: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
}

// Imagens enviadas por upload vêm como caminho relativo à API ("/homenagem/i/{id}");
// links externos são devolvidos como estão
export const urlImagem = (url) => (url?.startsWith('/') ? BASE_URL + url : url)

// `body` pode ser um objeto (enviado como JSON) ou um FormData (multipart, para upload)
export async function request(path, { method = 'GET', body } = {}) {
  const sessao = lerSessao()
  const headers = {}
  const multipart = body instanceof FormData
  // No multipart o navegador define o Content-Type com o boundary
  if (body !== undefined && !multipart) headers['Content-Type'] = 'application/json'
  if (sessao) headers.Authorization = `Bearer ${sessao.token}`

  let resposta
  try {
    resposta = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body === undefined || multipart ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, MENSAGENS_PADRAO[0])
  }

  if (resposta.status === 204) return null
  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    if (resposta.status === 401 && sessao) aoExpirarSessao()
    const mensagem = dados?.mensagem ?? MENSAGENS_PADRAO[resposta.status] ?? MENSAGENS_PADRAO[500]
    throw new ApiError(resposta.status, mensagem)
  }
  return dados
}
