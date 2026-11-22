import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarFormulario } from '../services/homenagens'
import { envioEncerrado, formatarData } from '../utils/datas'
import { lembrarTokenMural, tokenMuralLembrado } from '../utils/links'
import Carregando from '../components/Carregando'
import ErroLinkPublico from '../components/ErroLinkPublico'
import FormularioHomenagem from '../components/FormularioHomenagem'

function EnviosEncerrados({ nomeAniversariante }) {
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
function HomenagemEnviada({ nomeAniversariante, tokenMural, onEnviarOutra }) {
  return (
    <section className="cartao cartao-medio texto-centro">
      <div className="icone-sucesso" aria-hidden="true">✓</div>
      <h1>Homenagem enviada!</h1>
      <p className="texto-suave">Obrigado! Sua homenagem para {nomeAniversariante} já está no mural.</p>
      <div className="acoes acoes-centro">
        {tokenMural && <Link to={`/m/${tokenMural}`} className="botao botao-primario">Ver o mural</Link>}
        <button type="button" className="botao botao-secundario" onClick={onEnviarOutra}>
          Enviar outra homenagem
        </button>
      </div>
    </section>
  )
}

// Formulário público, acessado pelo link de contribuição sem login (RF-12, RN-17)
export default function Contribuir() {
  const { token } = useParams()
  const { dados: celebracao, erro, carregando } = useCarregar(useCallback(() => buscarFormulario(token), [token]))
  // Resposta do envio (com o tokenMural) ou null enquanto não enviou
  const [enviada, setEnviada] = useState(null)
  const [encerradaNoEnvio, setEncerradaNoEnvio] = useState(false)
  // Mural de um envio anterior feito neste navegador (atalho para quem caiu no formulário sem querer)
  const [tokenMural, setTokenMural] = useState(() => tokenMuralLembrado(token))

  if (carregando) return <Carregando />
  if (erro) {
    return (
      <ErroLinkPublico titulo="Link inválido" erro={erro}
        mensagemNaoEncontrado="Não encontramos esta celebração. Confira o link recebido." />
    )
  }

  const { nomeAniversariante, dataCelebracao } = celebracao

  if (encerradaNoEnvio || envioEncerrado(dataCelebracao)) {
    return <EnviosEncerrados nomeAniversariante={nomeAniversariante} />
  }

  if (enviada) {
    return (
      <HomenagemEnviada nomeAniversariante={nomeAniversariante} tokenMural={enviada.tokenMural}
        onEnviarOutra={() => setEnviada(null)} />
    )
  }

  function registrarEnvio(resposta) {
    if (resposta?.tokenMural) {
      lembrarTokenMural(token, resposta.tokenMural)
      setTokenMural(resposta.tokenMural)
    }
    setEnviada(resposta)
  }

  return (
    <section className="cartao cartao-medio">
      <p className="sobretitulo">Aniversário em {formatarData(dataCelebracao)}</p>
      <h1>Deixe uma homenagem para {nomeAniversariante}</h1>
      <p className="texto-suave">Não precisa de cadastro. Sua homenagem aparece no mural assim que for enviada.</p>

      <FormularioHomenagem token={token} nomeAniversariante={nomeAniversariante}
        onEnviada={registrarEnvio} onPrazoEncerrado={() => setEncerradaNoEnvio(true)}>
        {tokenMural && <Link to={`/m/${tokenMural}`} className="rodape-cartao">Ver mural</Link>}
      </FormularioHomenagem>
    </section>
  )
}
