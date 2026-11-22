import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { definirAoExpirarSessao, lerSessao, limparSessao, salvarSessao } from '../services/api'
import { login as loginApi } from '../services/auth'

const AuthContext = createContext(null)
const ATRASO_MAXIMO_TIMER = 2 ** 31 - 1

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessao)
  const [sessaoExpirou, setSessaoExpirou] = useState(false)

  const logout = useCallback(() => {
    limparSessao()
    setSessao(null)
  }, [])

  // Encerra a sessão e avisa na tela de login
  const expirarSessao = useCallback(() => {
    logout()
    setSessaoExpirou(true)
  }, [logout])

  const login = useCallback(async (email, senha) => {
    const { token, expiraEm } = await loginApi(email, senha)
    const nova = { token, expiraEm }
    salvarSessao(nova)
    setSessao(nova)
    setSessaoExpirou(false)
  }, [])

  // Token recusado pelo backend
  useEffect(() => {
    definirAoExpirarSessao(expirarSessao)
  }, [expirarSessao])

  // Horário de expiração do token atingido, mesmo sem nova requisição
  useEffect(() => {
    if (!sessao) return
    const restante = new Date(sessao.expiraEm) - new Date()
    // Acima do limite do setTimeout (~24,8 dias) ele dispararia na hora; o 401 do backend cobre esse caso
    if (restante > ATRASO_MAXIMO_TIMER) return
    const timer = setTimeout(expirarSessao, Math.max(restante, 0))
    return () => clearTimeout(timer)
  }, [sessao, expirarSessao])

  const valor = useMemo(
    () => ({ autenticado: !!sessao, sessaoExpirou, login, logout }),
    [sessao, sessaoExpirou, login, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
