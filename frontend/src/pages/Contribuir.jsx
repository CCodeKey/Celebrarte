import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarFormulario, enviarHomenagem } from '../services/homenagens'
import { envioEncerrado, formatarData } from '../utils/datas'
import { urlValida } from '../utils/links'
import Campo from '../components/Campo'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'
import SeletorImagem from '../components/SeletorImagem'

const LIMITE_MENSAGEM = 2000
const IMAGEM_VAZIA = { modo: 'arquivo', arquivo: null, url: '' }

// Formulário público, acessado pelo link de contribuição sem login (RF-12, RN-17)
export default function Contribuir() {
  const { token } = useParams()
  const { dados: celebracao, erro, carregando } = useCarregar(useCallback(() => buscarFormulario(token), [token]))
  const [imagem, setImagem] = useState(IMAGEM_VAZIA)
  const [mensagem, setMensagem] = useState('')
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [enviando, setEnviando] = useState(false)
  // Resposta do envio (com o tokenMural) ou null enquanto não enviou
  const [enviada, setEnviada] = useState(null)
  const [encerradaNoEnvio, setEncerradaNoEnvio] = useState(false)

  if (carregando) return <Carregando />
  if (erro) {
    return (
      <section className="cartao cartao-medio">
        <h1>Link inválido</h1>
        <Alerta tipo="erro">
          {erro.status === 404 ? 'Não encontramos esta celebração. Confira o link recebido.' : erro.message}
        </Alerta>
      </section>
    )
  }

  const { nomeAniversariante, dataCelebracao } = celebracao

  if (encerradaNoEnvio || envioEncerrado(dataCelebracao)) {
    return (
      <section className="cartao cartao-medio texto-centro">
        <h1>Envios encerrados</h1>
        <p className="texto-suave">
          O prazo para enviar homenagens para {nomeAniversariante} terminou dois dias após o aniversário.
        </p>
      </section>
    )
  }

  // RF-16: confirmação de envio. O token do mural só chega na resposta de um envio válido
  if (enviada) {
    return (
      <section className="cartao cartao-medio texto-centro">
        <div className="icone-sucesso" aria-hidden="true">✓</div>
        <h1>Homenagem enviada!</h1>
        <p className="texto-suave">Obrigado! Sua homenagem para {nomeAniversariante} já está no mural.</p>
        <div className="acoes acoes-centro">
          {enviada.tokenMural && (
            <Link to={`/m/${enviada.tokenMural}`} className="botao botao-primario">Ver o mural</Link>
          )}
          <button type="button" className="botao botao-secundario" onClick={() => {
            setMensagem('')
            setImagem(IMAGEM_VAZIA)
            setEnviada(null)
          }}>
            Enviar outra homenagem
          </button>
        </div>
      </section>
    )
  }

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

  async function enviar(e) {
    e.preventDefault()
    if (!validar()) return
    setEnviando(true)
    setErroApi(null)
    try {
      setEnviada(await enviarHomenagem(token, { mensagem: mensagem.trim(), imagem: arquivo, imagemUrl }))
    } catch (err) {
      if (err.status === 410) setEncerradaNoEnvio(true)
      else setErroApi(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="cartao cartao-medio">
      <p className="sobretitulo">Aniversário em {formatarData(dataCelebracao)}</p>
      <h1>Deixe uma homenagem para {nomeAniversariante}</h1>
      <p className="texto-suave">Não precisa de cadastro. Sua homenagem aparece no mural assim que for enviada.</p>

      <form className="formulario" onSubmit={enviar} noValidate>
        <Alerta tipo="erro">{erroApi ?? erros.geral}</Alerta>
        <SeletorImagem
          valor={imagem}
          onChange={setImagem}
          erro={erros.imagem}
          onErro={(texto) => setErros((atuais) => ({ ...atuais, imagem: texto }))}
        />
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
      </form>
    </section>
  )
}
