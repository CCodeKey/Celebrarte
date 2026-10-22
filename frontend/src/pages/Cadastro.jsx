import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { cadastrarUsuario } from '../services/usuarios'
import Campo from '../components/Campo'
import Alerta from '../components/Alerta'

export default function Cadastro() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacao: '' })
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const alterar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  function validar() {
    const novos = {}
    if (!form.nome.trim()) novos.nome = 'Informe seu nome.'
    if (!form.email.trim()) novos.email = 'Informe seu e-mail.'
    if (!form.senha) novos.senha = 'Crie uma senha.'
    if (form.senha && form.confirmacao !== form.senha) novos.confirmacao = 'As senhas não conferem.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function enviar(e) {
    e.preventDefault()
    if (!validar()) return
    setEnviando(true)
    setErroApi(null)
    const email = form.email.trim()
    try {
      await cadastrarUsuario({ nome: form.nome.trim(), email, senha: form.senha })
    } catch (err) {
      setErroApi(err.message)
      setEnviando(false)
      return
    }
    // Conta criada: entra direto; se o login falhar, a pessoa entra manualmente
    try {
      await login(email, form.senha)
      navigate('/celebracoes', { replace: true })
    } catch {
      navigate('/login', { replace: true, state: { cadastrado: true } })
    }
  }

  return (
    <section className="cartao cartao-estreito">
      <h1>Criar conta</h1>
      <p className="texto-suave">Só quem organiza precisa de conta. Convidados participam pelo link.</p>
      <form className="formulario" onSubmit={enviar} noValidate>
        <Alerta tipo="erro">{erroApi}</Alerta>
        <Campo label="Nome" autoComplete="name" value={form.nome} onChange={alterar('nome')}
          erro={erros.nome} maxLength={255} required />
        <Campo label="E-mail" type="email" autoComplete="email" value={form.email}
          onChange={alterar('email')} erro={erros.email} required />
        <Campo label="Senha" type="password" autoComplete="new-password" value={form.senha}
          onChange={alterar('senha')} erro={erros.senha} required />
        <Campo label="Confirme a senha" type="password" autoComplete="new-password" value={form.confirmacao}
          onChange={alterar('confirmacao')} erro={erros.confirmacao} required />
        <button type="submit" className="botao botao-primario botao-largo" disabled={enviando}>
          {enviando ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
      <p className="rodape-cartao">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  )
}
