import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Campo from '../components/Campo'
import Alerta from '../components/Alerta'

export default function Login() {
  const { login, sessaoExpirou } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.')
      return
    }
    setEnviando(true)
    setErro(null)
    try {
      await login(email.trim(), senha)
      navigate(location.state?.de ?? '/celebracoes', { replace: true })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <section className="cartao cartao-estreito">
      <h1>Entrar</h1>
      <p className="texto-suave">Acesse para criar e acompanhar suas celebrações.</p>
      {sessaoExpirou && !erro && <Alerta tipo="info">Sua sessão expirou. Entre novamente.</Alerta>}
      {location.state?.cadastrado && <Alerta tipo="sucesso">Conta criada! Agora é só entrar.</Alerta>}
      <form className="formulario" onSubmit={enviar} noValidate>
        <Alerta tipo="erro">{erro}</Alerta>
        <Campo label="E-mail" type="email" autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <Campo label="Senha" type="password" autoComplete="current-password" value={senha}
          onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit" className="botao botao-primario botao-largo" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="rodape-cartao">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </section>
  )
}
