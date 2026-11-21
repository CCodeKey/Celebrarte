import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarCelebracao, excluirCelebracao, listarHomenagensRecebidas } from '../services/celebracoes'
import { excluirHomenagem } from '../services/homenagens'
import { formatarData, formatarDataHora } from '../utils/datas'
import { linkContribuicao, linkMural } from '../utils/links'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'
import CopiarLink from '../components/CopiarLink'
import HomenagemCard from '../components/HomenagemCard'
import QrCode from '../components/QrCode'
import { nomeArquivo } from '../utils/qrcode'

// Mesmas cores da marca usadas nas etiquetas (index.css), repetidas aqui porque o PNG é desenhado num canvas
const COR_CONVIDADOS = '#e34155'
const COR_MURAL = '#0277ba'

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

  const c = celebracao.dados
  const encerrada = new Date() > new Date(c.dataEncerramento)

  async function excluir() {
    if (!window.confirm(`Excluir a celebração de ${c.nomeAniversariante}? Todas as homenagens serão apagadas.`)) return
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
      homenagens.setDados(homenagens.dados.filter((h) => h.id !== homenagem.id))
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
          <h1>{c.nomeAniversariante}</h1>
          <p className="texto-suave">
            Aniversário em {formatarData(c.dataCelebracao)} ·{' '}
            {encerrada
              ? 'envios encerrados'
              : `envios abertos até ${formatarDataHora(c.dataEncerramento)}`}
          </p>
        </div>
        <div className="acoes">
          <Link to={`/celebracoes/${id}/editar`} className="botao botao-secundario">Editar</Link>
          <button type="button" className="botao botao-perigo-contorno" onClick={excluir}>Excluir</button>
        </div>
      </div>

      <div className="compartilhar-grade">
        {/* Cada código tem cor e etiqueta próprias para não confundir qual vai para quem */}
        <article className="cartao compartilhar compartilhar-convidados">
          <QrCode
            url={linkContribuicao(c.tokenContribuicao)}
            rotulo="Enviar homenagem"
            titulo="Deixe sua homenagem"
            subtitulo={`para ${c.nomeAniversariante}`}
            cor={COR_CONVIDADOS}
            arquivo={nomeArquivo('qrcode-enviar-homenagem', c.nomeAniversariante)}
          />
          <div className="compartilhar-info">
            <span className="compartilhar-etiqueta">Para os convidados</span>
            <CopiarLink
              titulo="Enviar homenagem"
              descricao="Convidados escaneiam ou abrem o link para mandar fotos e mensagens. Ótimo para convites, mensagens em grupo e cartazes no evento."
              url={linkContribuicao(c.tokenContribuicao)}
            />
          </div>
        </article>

        <article className="cartao compartilhar compartilhar-mural">
          <QrCode
            url={linkMural(c.tokenMural)}
            rotulo="Ver mural"
            titulo={`Mural de ${c.nomeAniversariante}`}
            subtitulo="Veja todas as homenagens"
            cor={COR_MURAL}
            arquivo={nomeArquivo('qrcode-mural', c.nomeAniversariante)}
          />
          <div className="compartilhar-info">
            <span className="compartilhar-etiqueta">Para o aniversariante</span>
            <CopiarLink
              titulo="Ver mural"
              descricao="Mostra todas as homenagens reunidas. Entregue ao aniversariante ou projete num telão durante a festa."
              url={linkMural(c.tokenMural)}
            />
          </div>
        </article>
      </div>

      <div>
        <h2>
          Homenagens recebidas
          {homenagens.dados && <span className="contagem">{homenagens.dados.length}</span>}
        </h2>
        {homenagens.carregando && <Carregando />}
        <Alerta tipo="erro">{homenagens.erro?.message}</Alerta>
        {homenagens.dados?.length === 0 && (
          <p className="vazio">Nenhuma homenagem ainda. Compartilhe o link de contribuição!</p>
        )}
        {homenagens.dados?.length > 0 && (
          <div className="grade-homenagens">
            {homenagens.dados.map((h) => (
              <HomenagemCard key={h.id} homenagem={h} onExcluir={removerHomenagem} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
