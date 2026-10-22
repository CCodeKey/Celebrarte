import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { buscarMural } from '../services/mural'
import { formatarData } from '../utils/datas'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'
import HomenagemCard from '../components/HomenagemCard'

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

  return (
    <section className="mural">
      <header className="mural-titulo">
        <p className="sobretitulo">{formatarData(mural.dataCelebracao)}</p>
        <h1>Feliz aniversário, {mural.nomeAniversariante}!</h1>
        <p className="texto-suave">
          {mural.homenagens.length === 1
            ? '1 homenagem de quem gosta de você'
            : `${mural.homenagens.length} homenagens de quem gosta de você`}
        </p>
      </header>

      {mural.homenagens.length === 0 ? (
        <p className="vazio">As homenagens vão aparecer aqui assim que forem enviadas.</p>
      ) : (
        <div className="grade-homenagens grade-mural">
          {mural.homenagens.map((h) => (
            <HomenagemCard key={h.id} homenagem={h} />
          ))}
        </div>
      )}
    </section>
  )
}
