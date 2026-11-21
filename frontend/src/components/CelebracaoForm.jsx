import { useState } from 'react'
import Campo from './Campo'
import Alerta from './Alerta'
import { dataEncerramento, deInputData, envioEncerrado, formatarData, paraInputData } from '../utils/datas'

const LIMITE_NOME = 255

// Usado para criar e editar uma celebração
export default function CelebracaoForm({ inicial, textoBotao, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(inicial?.nomeAniversariante ?? '')
  const [data, setData] = useState(paraInputData(inicial?.dataCelebracao))
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [salvando, setSalvando] = useState(false)

  // Com uma data já encerrada, ninguém conseguiria enviar homenagens. Costuma ser a data de nascimento digitada por engano
  const dataValida = !!data && !Number.isNaN(new Date(deInputData(data)).getTime())
  const prazoEncerrado = dataValida && envioEncerrado(deInputData(data))
  const dicaData = dataValida
    ? `As homenagens poderão ser enviadas até ${formatarData(dataEncerramento(deInputData(data)))}.`
    : 'Não é a data de nascimento: informe o dia em que o aniversário será comemorado. As homenagens podem ser enviadas até dois dias depois.'

  function validar() {
    const novos = {}
    if (!nome.trim()) novos.nome = 'Informe o nome do aniversariante.'
    else if (nome.trim().length > LIMITE_NOME) novos.nome = `Use no máximo ${LIMITE_NOME} caracteres.`
    if (!data) novos.data = 'Informe a data da comemoração.'
    // Só bloqueia na criação: ao editar, a celebração pode já ter acontecido
    else if (!inicial && prazoEncerrado) novos.data = 'Esta data já passou. Informe a data do próximo aniversário, não a de nascimento.'
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
        label="Data da comemoração do aniversário"
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        erro={erros.data}
        dica={dicaData}
        required
      />
      {prazoEncerrado && !erros.data && (
        <Alerta tipo="info">
          Esta data já passou, então o prazo para enviar homenagens estaria encerrado.
          Se você informou a data de nascimento, troque pela data do aniversário que será comemorado.
        </Alerta>
      )}
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
