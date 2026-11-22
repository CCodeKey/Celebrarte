import CopiarLink from './CopiarLink'
import QrCode from './QrCode'

// Um link público com seu QR Code. `variante` define cor e etiqueta próprias (index.css),
// para não confundir qual código vai para quem. `qr` traz o que é impresso no PNG.
export default function CartaoCompartilhar({ variante, etiqueta, titulo, descricao, url, qr }) {
  return (
    <article className={`cartao compartilhar compartilhar-${variante}`}>
      <QrCode url={url} rotulo={titulo} {...qr} />
      <div className="compartilhar-info">
        <span className="compartilhar-etiqueta">{etiqueta}</span>
        <CopiarLink titulo={titulo} descricao={descricao} url={url} />
      </div>
    </article>
  )
}
