import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCarregar } from '../hooks/useCarregar'
import { buscarUsuarioLogado, editarUsuario, excluirUsuario } from '../services/usuarios'
import Campo from '../components/Campo'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'

export default function Perfil() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { dados: usuario, erro, carregando } = useCarregar(buscarUsuarioLogado)
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (usuario) setNome(usuario.nome ?? '')
  }, [usuario])

  async function salvar(e) {
    e.preventDefault()
    const novos = {}
    if (!nome.trim()) novos.nome = 'Informe seu nome.'
    if (senha && senha !== confirmacao) novos.confirmacao = 'As senhas não conferem.'
    setErros(novos)
    if (Object.keys(novos).length) return

    setSalvando(true)
    setMensagem(null)
    try {
      // Senha vazia mantém a atual
      await editarUsuario({ nome: nome.trim(), senha: senha || null })
      setSenha('')
      setConfirmacao('')
      setMensagem({ tipo: 'sucesso', texto: 'Dados atualizados.' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message })
    } finally {
      setSalvando(false)
    }
  }

  async function excluirConta() {
    if (!window.confirm('Excluir sua conta? Todas as suas celebrações e homenagens serão apagadas. Esta ação não pode ser desfeita.')) return
    try {
      await excluirUsuario()
      logout()
      navigate('/login', { replace: true })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message })
    }
  }

  if (carregando) return <Carregando />
  if (erro) return <Alerta tipo="erro">{erro.message}</Alerta>

  return (
    <section className="pilha cartao-medio">
      <div className="cartao">
        <h1>Meu perfil</h1>
        <form className="formulario" onSubmit={salvar} noValidate>
          {mensagem && <Alerta tipo={mensagem.tipo}>{mensagem.texto}</Alerta>}
          <Campo label="E-mail" type="email" value={usuario.email} readOnly disabled
            dica="O e-mail não pode ser alterado." />
          <Campo label="Nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)}
            erro={erros.nome} maxLength={255} required />
          <Campo label="Nova senha" type="password" autoComplete="new-password" value={senha}
            onChange={(e) => setSenha(e.target.value)} dica="Deixe em branco para manter a senha atual." />
          {senha && (
            <Campo label="Confirme a nova senha" type="password" autoComplete="new-password" value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)} erro={erros.confirmacao} />
          )}
          <div className="formulario-acoes">
            <button type="submit" className="botao botao-primario" disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>

      <div className="cartao zona-perigo">
        <h2>Excluir conta</h2>
        <p className="texto-suave">Apaga sua conta, suas celebrações e todas as homenagens recebidas.</p>
        <button type="button" className="botao botao-perigo-contorno" onClick={excluirConta}>
          Excluir minha conta
        </button>
      </div>
    </section>
  )
}
