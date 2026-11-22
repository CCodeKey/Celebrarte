import { useState } from 'react'
import { enviarHomenagem } from '../services/homenagens'
import { urlValida } from '../utils/links'
import Alerta from './Alerta'
import Campo from './Campo'
import SeletorImagem from './SeletorImagem'

const LIMITE_MENSAGEM = 2000
const IMAGEM_VAZIA = { modo: 'arquivo', arquivo: null, url: '' }
const STATUS_PRAZO_ENCERRADO = 410

// Formulário público de homenagem (RF-12). Avisa o pai quando o envio dá certo ou
// quando o prazo encerrou no meio do caminho; `children` aparece no fim do formulário.
export default function FormularioHomenagem({ token, nomeAniversariante, onEnviada, onPrazoEncerrado, children }) {
  const [imagem, setImagem] = useState(IMAGEM_VAZIA)
  const [mensagem, setMensagem] = useState('')
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Só a opção escolhida é enviada: uma imagem por homenagem (RN-36)
  const arquivo = imagem.modo === 'arquivo' ? imagem.arquivo : null
  const imagemUrl = imagem.modo === 'link' ? imagem.url.trim() : ''

  function validar() {
    const novos = {}
    // RN-11: pelo menos uma mensagem ou uma imagem
    if (!mensagem.trim() && !arquivo && !imagemUrl) {
      novos.geral = 'Adicione uma imagem, escreva uma mensagem ou os dois.'
    }
    if (mensagem.trim().length > LIMITE_MENSAGEM) novos.mensagem = `A mensagem deve ter no máximo ${LIMITE_MENSAGEM} caracteres.`
    if (imagemUrl && !urlValida(imagemUrl)) novos.imagem = 'Informe um link de imagem começando com http:// ou https://.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  function alterarErroImagem(texto) {
    setErros((atuais) => ({ ...atuais, imagem: texto }))
  }

  async function enviar(e) {
    e.preventDefault()
    if (!validar()) return
    setEnviando(true)
    setErroApi(null)
    let resposta
    try {
      resposta = await enviarHomenagem(token, { mensagem: mensagem.trim(), imagem: arquivo, imagemUrl })
    } catch (err) {
      if (err.status === STATUS_PRAZO_ENCERRADO) {
        onPrazoEncerrado()
        return
      }
      setErroApi(err.message)
      setEnviando(false)
      return
    }
    // O pai troca o formulário pela confirmação; não há estado a restaurar aqui
    onEnviada(resposta)
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <Alerta tipo="erro">{erroApi ?? erros.geral}</Alerta>
      <SeletorImagem valor={imagem} onChange={setImagem} erro={erros.imagem} onErro={alterarErroImagem} />
      <Campo
        label="Mensagem (opcional)"
        multilinha
        rows={6}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        erro={erros.mensagem}
        maxLength={LIMITE_MENSAGEM}
        placeholder={`Escreva algo especial para ${nomeAniversariante}…`}
        contador={`${mensagem.length}/${LIMITE_MENSAGEM}`}
      />
      <button type="submit" className="botao botao-primario botao-largo" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar homenagem'}
      </button>
      {children}
    </form>
  )
}
