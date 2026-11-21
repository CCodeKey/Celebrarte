import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarMural } from '../services/mural'
import { formatarData } from '../utils/datas'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'
import PainelHomenagens from '../components/PainelHomenagens'

// Mural público, acessado pelo link do mural sem login (RF-17 a RF-21)
export default function Mural() {
  const { token } = useParams()
  const { dados: mural, erro, carregando } = useCarregar(useCallback(() => buscarMural(token), [token]))

  if (carregando) return <Carregando texto="Preparando o mural…" />
  if (erro) {
    return (
      <section className="cartao cartao-medio">
        <h1>Mural não encontrado</h1>
        <Alerta tipo="erro">
          {erro.status === 404 ? 'Não encontramos este mural. Confira o link recebido.' : erro.message}
        </Alerta>
      </section>
    )
  }

  const total = mural.homenagens.length

  return (
    <section className="mural">
      <header className="mural-titulo">
        <p className="sobretitulo">{formatarData(mural.dataCelebracao)}</p>
        <h1>Feliz aniversário, {mural.nomeAniversariante}!</h1>
        {total > 0 && (
          <p className="mural-contagem">
            {total === 1 ? '1 homenagem feita com carinho' : `${total} homenagens feitas com carinho`}
          </p>
        )}
      </header>

      {total === 0 ? (
        <p className="vazio">As homenagens vão aparecer aqui assim que forem enviadas.</p>
      ) : (
        <PainelHomenagens homenagens={mural.homenagens} />
      )}
    </section>
  )
}
