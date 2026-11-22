import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarCelebracao, excluirCelebracao, listarHomenagensRecebidas } from '../services/celebracoes'
import { excluirHomenagem } from '../services/homenagens'
import { formatarData, formatarDataHora } from '../utils/datas'
import { linkContribuicao, linkMural } from '../utils/links'
import { nomeArquivo } from '../utils/qrcode'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'
import CartaoCompartilhar from '../components/CartaoCompartilhar'
import HomenagemCard from '../components/HomenagemCard'

// Mesmas cores da marca usadas nas etiquetas (index.css), repetidas aqui porque o PNG é desenhado num canvas
const COR_CONVIDADOS = '#e34155'
const COR_MURAL = '#0277ba'

function HomenagensRecebidas({ homenagens, erro, carregando, onExcluir }) {
  return (
    <div>
      <h2>
        Homenagens recebidas
        {homenagens && <span className="contagem">{homenagens.length}</span>}
      </h2>
      {carregando && <Carregando />}
      <Alerta tipo="erro">{erro?.message}</Alerta>
      {homenagens?.length === 0 && (
        <p className="vazio">Nenhuma homenagem ainda. Compartilhe o link de contribuição!</p>
      )}
      {homenagens?.length > 0 && (
        <div className="grade-homenagens">
          {homenagens.map((h) => (
            <HomenagemCard key={h.id} homenagem={h} onExcluir={onExcluir} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DetalhesCelebracao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [erroAcao, setErroAcao] = useState(null)

  const celebracao = useCarregar(useCallback(() => buscarCelebracao(id), [id]))
  const homenagens = useCarregar(useCallback(() => listarHomenagensRecebidas(id), [id]))

  if (celebracao.carregando) return <Carregando />
  if (celebracao.erro) {
    return (
      <section>
        <Alerta tipo="erro">{celebracao.erro.message}</Alerta>
        <Link to="/celebracoes">Voltar para minhas celebrações</Link>
      </section>
    )
  }

  const { nomeAniversariante, dataCelebracao, dataEncerramento, tokenContribuicao, tokenMural } = celebracao.dados
  const encerrada = new Date() > new Date(dataEncerramento)

  async function excluir() {
    if (!window.confirm(`Excluir a celebração de ${nomeAniversariante}? Todas as homenagens serão apagadas.`)) return
    try {
      await excluirCelebracao(id)
      navigate('/celebracoes', { replace: true })
    } catch (err) {
      setErroAcao(err.message)
    }
  }

  async function removerHomenagem(homenagem) {
    if (!window.confirm('Excluir esta homenagem? Ela deixará de aparecer no mural.')) return
    try {
      await excluirHomenagem(homenagem.id)
      homenagens.setDados((atuais) => atuais.filter((h) => h.id !== homenagem.id))
    } catch (err) {
      setErroAcao(err.message)
    }
  }

  return (
    <section className="pilha">
      {location.state?.criada && (
        <Alerta tipo="sucesso">Celebração criada! Compartilhe os links ou os QR Codes abaixo.</Alerta>
      )}
      <Alerta tipo="erro">{erroAcao}</Alerta>

      <div className="titulo-pagina">
        <div>
          <Link to="/celebracoes" className="voltar">← Minhas celebrações</Link>
          <h1>{nomeAniversariante}</h1>
          <p className="texto-suave">
            Aniversário em {formatarData(dataCelebracao)} ·{' '}
            {encerrada ? 'envios encerrados' : `envios abertos até ${formatarDataHora(dataEncerramento)}`}
          </p>
        </div>
        <div className="acoes">
          <Link to={`/celebracoes/${id}/editar`} className="botao botao-secundario">Editar</Link>
          <button type="button" className="botao botao-perigo-contorno" onClick={excluir}>Excluir</button>
        </div>
      </div>

      <div className="compartilhar-grade">
        <CartaoCompartilhar
          variante="convidados"
          etiqueta="Para os convidados"
          titulo="Enviar homenagem"
          descricao="Convidados escaneiam ou abrem o link para mandar fotos e mensagens. Ótimo para convites, mensagens em grupo e cartazes no evento."
          url={linkContribuicao(tokenContribuicao)}
          qr={{
            titulo: 'Deixe sua homenagem',
            subtitulo: `para ${nomeAniversariante}`,
            cor: COR_CONVIDADOS,
            arquivo: nomeArquivo('qrcode-enviar-homenagem', nomeAniversariante),
          }}
        />
        <CartaoCompartilhar
          variante="mural"
          etiqueta="Para o aniversariante"
          titulo="Ver mural"
          descricao="Mostra todas as homenagens reunidas. Entregue ao aniversariante ou projete num telão durante a festa."
          url={linkMural(tokenMural)}
          qr={{
            titulo: `Mural de ${nomeAniversariante}`,
            subtitulo: 'Veja todas as homenagens',
            cor: COR_MURAL,
            arquivo: nomeArquivo('qrcode-mural', nomeAniversariante),
          }}
        />
      </div>

      <HomenagensRecebidas
        homenagens={homenagens.dados}
        erro={homenagens.erro}
        carregando={homenagens.carregando}
        onExcluir={removerHomenagem}
      />
    </section>
  )
}
