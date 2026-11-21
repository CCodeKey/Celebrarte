// Peças "físicas" usadas no varal e no painel: Polaroid, bilhete e o que os prende.
// Usam <span> em vez de <figure>/<p> para poderem ficar dentro de um <button>.

export const CORES_PRENDEDOR = ['#0277ba', '#e34155', '#ffa300', '#f58a9b']

export function Prendedor({ tipo = 'fita', cor = CORES_PRENDEDOR[0] }) {
  if (tipo === 'clipe') {
    return (
      <svg className="prendedor prendedor-clipe" viewBox="0 0 12 38" aria-hidden="true">
        <path
          d="M8.5 11 V29 a3.3 3.3 0 0 1 -6.6 0 V6.5 a4.6 4.6 0 0 1 9.2 0 V26 a1.9 1.9 0 0 1 -3.8 0 V11"
          fill="none"
          stroke={cor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (tipo === 'alfinete') {
    return <span className="prendedor prendedor-alfinete" style={{ '--cor-prendedor': cor }} aria-hidden="true" />
  }
  return <span className="prendedor prendedor-fita" style={{ '--cor-prendedor': cor }} aria-hidden="true" />
}

// `foto` pode ser um elemento (ilustração) ou a URL de uma imagem
export function Polaroid({ foto, alt = '', legenda, prendedor, cor, proporcao, as: Tag = 'div', className = '', style, ...props }) {
  return (
    <Tag className={`polaroid ${className}`} style={style} {...props}>
      {prendedor && <Prendedor tipo={prendedor} cor={cor} />}
      <span className="polaroid-foto" style={proporcao ? { aspectRatio: proporcao } : undefined}>
        {typeof foto === 'string' ? <img src={foto} alt={alt} loading="lazy" decoding="async" /> : foto}
      </span>
      {legenda && <span className="polaroid-legenda">{legenda}</span>}
    </Tag>
  )
}

export function Bilhete({ texto, assinatura, prendedor, cor, papel = 'amarelo', as: Tag = 'div', className = '', style, ...props }) {
  return (
    <Tag className={`bilhete bilhete-${papel} ${className}`} style={style} {...props}>
      {prendedor && <Prendedor tipo={prendedor} cor={cor} />}
      <span className="bilhete-texto">{texto}</span>
      {assinatura && <span className="bilhete-assinatura">{assinatura}</span>}
    </Tag>
  )
}
