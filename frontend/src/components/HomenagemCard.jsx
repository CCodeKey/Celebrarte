import { urlImagem } from '../services/api'
import { formatarDataHora } from '../utils/datas'

// Mostra só os elementos que a homenagem possui (RN-20 a RN-22)
export default function HomenagemCard({ homenagem, onExcluir }) {
  const { mensagem, imagemUrl, createdAt } = homenagem

  return (
    <article className="homenagem-card">
      {imagemUrl && (
        <img src={urlImagem(imagemUrl)} alt="Imagem enviada como homenagem" loading="lazy" decoding="async" />
      )}
      {mensagem && <p className="homenagem-mensagem">{mensagem}</p>}
      <footer className="homenagem-rodape">
        <time dateTime={createdAt}>{formatarDataHora(createdAt)}</time>
        {onExcluir && (
          <button type="button" className="botao-link botao-perigo" onClick={() => onExcluir(homenagem)}>
            Excluir
          </button>
        )}
      </footer>
    </article>
  )
}
