import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { definirAoExpirarSessao, lerSessao, limparSessao, salvarSessao } from '../services/api'
import { login as loginApi } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessao)
  const [sessaoExpirou, setSessaoExpirou] = useState(false)

  const logout = useCallback(() => {
    limparSessao()
    setSessao(null)
  }, [])

  const login = useCallback(async (email, senha) => {
    const { token, expiraEm } = await loginApi(email, senha)
    const nova = { token, expiraEm }
    salvarSessao(nova)
    setSessao(nova)
    setSessaoExpirou(false)
  }, [])

  // Token recusado pelo backend: encerra a sessão e avisa na tela de login
  useEffect(() => {
    definirAoExpirarSessao(() => {
      logout()
      setSessaoExpirou(true)
    })
  }, [logout])

  // Encerra a sessão no horário em que o token expira, mesmo sem nova requisição
  useEffect(() => {
    if (!sessao) return
    const restante = new Date(sessao.expiraEm) - new Date()
    const timer = setTimeout(() => {
      logout()
      setSessaoExpirou(true)
    }, Math.max(restante, 0))
    return () => clearTimeout(timer)
  }, [sessao, logout])

  const valor = useMemo(
    () => ({ autenticado: !!sessao, sessaoExpirou, login, logout }),
    [sessao, sessaoExpirou, login, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
