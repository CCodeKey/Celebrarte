import { useEffect, useRef, useState } from 'react'
import { urlImagem } from '../services/api'
import { formatarDataHora } from '../utils/datas'
import Dialogo from './Dialogo'
import { Bilhete, CORES_PRENDEDOR, Polaroid } from './Polaroid'

const PRENDEDORES = ['fita', 'alfinete', 'fita', 'clipe']
const PAPEIS = ['amarelo', 'rosa', 'azul', 'branco']
const PROPORCOES = ['1 / 1', '4 / 5', '5 / 4', '1 / 1']
const LARGURAS = ['84%', '92%', '100%']
const TAMANHO_RESUMO = 60

// Hash simples e estável: a mesma homenagem cai sempre na mesma posição/inclinação
function hash(valor) {
  let h = 2166136261
  for (const c of String(valor)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}

function aparencia(id) {
  const h = hash(id)
  return {
    rotacao: ((h % 11) - 5) * 0.8,
    deslocamento: (((h >>> 4) % 7) - 3) * 5,
    largura: LARGURAS[(h >>> 8) % LARGURAS.length],
    prendedor: PRENDEDORES[(h >>> 11) % PRENDEDORES.length],
    cor: CORES_PRENDEDOR[(h >>> 14) % CORES_PRENDEDOR.length],
    papel: PAPEIS[(h >>> 17) % PAPEIS.length],
    proporcao: PROPORCOES[(h >>> 20) % PROPORCOES.length],
  }
}

// Homenagem com imagem vira Polaroid; só com texto vira bilhete
function ItemPainel({ homenagem, onAbrir }) {
  const { mensagem, imagemUrl } = homenagem
  const visual = aparencia(homenagem.id)
  const estilo = { '--rot': `${visual.rotacao}deg`, '--dx': `${visual.deslocamento}px`, '--largura': visual.largura }
  const botao = {
    as: 'button',
    type: 'button',
    'aria-label': mensagem ? `Abrir homenagem: ${mensagem.slice(0, TAMANHO_RESUMO)}` : 'Abrir foto da homenagem',
    onClick: () => onAbrir(homenagem),
    prendedor: visual.prendedor,
    cor: visual.cor,
  }

  return (
    <li className="painel-item" style={estilo}>
      {imagemUrl ? (
        <Polaroid {...botao} foto={urlImagem(imagemUrl)} legenda={mensagem} proporcao={visual.proporcao} />
      ) : (
        <Bilhete {...botao} texto={mensagem} papel={visual.papel} />
      )}
    </li>
  )
}

// Mural em formato de painel: fotos e bilhetes presos com fita, alfinete ou clipe,
// levemente tortos e sobrepostos. Clicar abre a homenagem completa.
export default function PainelHomenagens({ homenagens }) {
  const dialogo = useRef(null)
  const [aberta, setAberta] = useState(null)

  // Abre depois de renderizar o conteúdo, para o foco inicial cair no botão de fechar
  useEffect(() => {
    if (aberta && !dialogo.current.open) dialogo.current.showModal()
  }, [aberta])

  return (
    <>
      <ul className="painel">
        {homenagens.map((homenagem) => (
          <ItemPainel key={homenagem.id} homenagem={homenagem} onAbrir={setAberta} />
        ))}
      </ul>

      <Dialogo ref={dialogo} className="painel-dialogo" aria-label="Homenagem" onClose={() => setAberta(null)}>
        {/* O botão fica fora da área com rolagem: posicionado para fora do cartão, ali dentro ele
            gerava barra de rolagem horizontal e ficava cortado */}
        {aberta && (
          <>
            <button type="button" className="painel-fechar" aria-label="Fechar" onClick={() => dialogo.current.close()}>
              ×
            </button>
            <div className="painel-dialogo-conteudo">
              {aberta.imagemUrl && <img src={urlImagem(aberta.imagemUrl)} alt="Imagem enviada como homenagem" />}
              {aberta.mensagem && <p className="painel-dialogo-mensagem">{aberta.mensagem}</p>}
              <time dateTime={aberta.createdAt}>{formatarDataHora(aberta.createdAt)}</time>
            </div>
          </>
        )}
      </Dialogo>
    </>
  )
}
