import { useState } from 'react'
import Campo from './Campo'
import Alerta from './Alerta'
import { deInputData, paraInputData } from '../utils/datas'

const LIMITE_NOME = 255

// Usado para criar e editar uma celebração
export default function CelebracaoForm({ inicial, textoBotao, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(inicial?.nomeAniversariante ?? '')
  const [data, setData] = useState(paraInputData(inicial?.dataCelebracao))
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function validar() {
    const novos = {}
    if (!nome.trim()) novos.nome = 'Informe o nome do aniversariante.'
    else if (nome.trim().length > LIMITE_NOME) novos.nome = `Use no máximo ${LIMITE_NOME} caracteres.`
    if (!data) novos.data = 'Informe a data da celebração.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function enviar(e) {
    e.preventDefault()
    if (!validar()) return
    setSalvando(true)
    setErroApi(null)
    try {
      await onSalvar({ nomeAniversariante: nome.trim(), dataCelebracao: deInputData(data) })
    } catch (err) {
      setErroApi(err.message)
      setSalvando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <Alerta tipo="erro">{erroApi}</Alerta>
      <Campo
        label="Nome do aniversariante"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        erro={erros.nome}
        maxLength={LIMITE_NOME}
        autoComplete="off"
        required
      />
      <Campo
        label="Data do aniversário"
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        erro={erros.data}
        dica="As homenagens podem ser enviadas até dois dias depois desta data."
        required
      />
      <div className="formulario-acoes">
        {onCancelar && (
          <button type="button" className="botao botao-fantasma" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="botao botao-primario" disabled={salvando}>
          {salvando ? 'Salvando…' : textoBotao}
        </button>
      </div>
    </form>
  )
}
