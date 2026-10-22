import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarFormulario, enviarHomenagem } from '../services/homenagens'
import { envioEncerrado, formatarData } from '../utils/datas'
import Campo from '../components/Campo'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'

const LIMITE_MENSAGEM = 2000

function urlValida(valor) {
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Formulário público, acessado pelo link de contribuição sem login (RF-12, RN-17)
export default function Contribuir() {
  const { token } = useParams()
  const { dados: celebracao, erro, carregando } = useCarregar(useCallback(() => buscarFormulario(token), [token]))
  const [mensagem, setMensagem] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')
  const [imagemQuebrada, setImagemQuebrada] = useState(false)
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviada, setEnviada] = useState(false)
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

  // RF-16: confirmação de envio
  if (enviada) {
    return (
      <section className="cartao cartao-medio texto-centro">
        <div className="icone-sucesso" aria-hidden="true">✓</div>
        <h1>Homenagem enviada!</h1>
        <p className="texto-suave">Obrigado! Sua homenagem para {nomeAniversariante} já está no mural.</p>
        <button type="button" className="botao botao-secundario" onClick={() => {
          setMensagem('')
          setImagemUrl('')
          setEnviada(false)
        }}>
          Enviar outra homenagem
        </button>
      </section>
    )
  }

  function validar() {
    const novos = {}
    const temMensagem = mensagem.trim().length > 0
    const temImagem = imagemUrl.trim().length > 0
    // RN-11: pelo menos uma mensagem ou uma imagem
    if (!temMensagem && !temImagem) novos.geral = 'Escreva uma mensagem, adicione uma imagem ou os dois.'
    if (mensagem.trim().length > LIMITE_MENSAGEM) novos.mensagem = `A mensagem deve ter no máximo ${LIMITE_MENSAGEM} caracteres.`
    if (temImagem && !urlValida(imagemUrl.trim())) novos.imagemUrl = 'Informe um link de imagem começando com http:// ou https://.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function enviar(e) {
    e.preventDefault()
    if (!validar()) return
    setEnviando(true)
    setErroApi(null)
    try {
      await enviarHomenagem(token, {
        mensagem: mensagem.trim() || null,
        imagemUrl: imagemUrl.trim() || null,
      })
      setEnviada(true)
    } catch (err) {
      if (err.status === 410) setEncerradaNoEnvio(true)
      else setErroApi(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const mostrarPreview = urlValida(imagemUrl.trim()) && !imagemQuebrada

  return (
    <section className="cartao cartao-medio">
      <p className="sobretitulo">Aniversário em {formatarData(dataCelebracao)}</p>
      <h1>Deixe uma homenagem para {nomeAniversariante}</h1>
      <p className="texto-suave">Não precisa de cadastro. Sua homenagem aparece no mural assim que for enviada.</p>

      <form className="formulario" onSubmit={enviar} noValidate>
        <Alerta tipo="erro">{erroApi ?? erros.geral}</Alerta>
        <Campo
          label="Mensagem"
          multilinha
          rows={6}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          erro={erros.mensagem}
          maxLength={LIMITE_MENSAGEM}
          placeholder={`Escreva algo especial para ${nomeAniversariante}…`}
          contador={`${mensagem.length}/${LIMITE_MENSAGEM}`}
        />
        <Campo
          label="Link de uma imagem (opcional)"
          type="url"
          inputMode="url"
          value={imagemUrl}
          onChange={(e) => {
            setImagemUrl(e.target.value)
            setImagemQuebrada(false)
          }}
          erro={erros.imagemUrl}
          placeholder="https://…"
          dica="Cole o endereço de uma foto já publicada na internet."
        />
        {mostrarPreview && (
          <img className="preview-imagem" src={imagemUrl.trim()} alt="Pré-visualização da imagem"
            onError={() => setImagemQuebrada(true)} />
        )}
        {imagemQuebrada && <Alerta tipo="info">Não conseguimos carregar esta imagem. Confira o link.</Alerta>}
        <button type="submit" className="botao botao-primario botao-largo" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar homenagem'}
        </button>
      </form>
    </section>
  )
}
