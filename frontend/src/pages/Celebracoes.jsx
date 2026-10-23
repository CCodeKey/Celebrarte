import { Link } from 'react-router-dom'
import { useCarregar } from '../hooks/useCarregar'
import { listarCelebracoes } from '../services/celebracoes'
import { formatarData } from '../utils/datas'
import Alerta from '../components/Alerta'
import Carregando from '../components/Carregando'

export default function Celebracoes() {
  const { dados: celebracoes, erro, carregando } = useCarregar(listarCelebracoes)

  return (
    <section>
      <div className="titulo-pagina">
        <h1>Minhas celebrações</h1>
        <Link to="/celebracoes/nova" className="botao botao-primario">Nova celebração</Link>
      </div>

      {carregando && <Carregando />}
      <Alerta tipo="erro">{erro?.message}</Alerta>

      {celebracoes?.length === 0 && (
        <div className="vazio">
          <p>Você ainda não criou nenhuma celebração.</p>
          <Link to="/celebracoes/nova" className="botao botao-secundario">Criar a primeira</Link>
        </div>
      )}

      {celebracoes?.length > 0 && (
        <ul className="lista-celebracoes">
          {celebracoes.map((c) => (
            <li key={c.id}>
              <Link to={`/celebracoes/${c.id}`} className="celebracao-item">
                <span className="celebracao-nome">{c.nomeAniversariante}</span>
                <span className="texto-suave">{formatarData(c.dataCelebracao)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
