import { Polaroid, CORES_PRENDEDOR } from './Polaroid'

// Varal decorativo: uma corda que cede no meio e Polaroids presas por clipes.
// A corda é uma curva de Bézier quadrática com o ponto de controle no centro, então
// a altura em cada posição horizontal t (0 a 1) é Y0 + 4 * CEDE * t * (1 - t).
const Y0 = 22
const CEDE = 34

export default function Varal({ fotos }) {
  const total = fotos.length

  return (
    <div className="varal" aria-hidden="true">
      <div className="varal-trilho">
        <svg className="varal-corda" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <path d={`M-20 ${Y0} Q500 ${Y0 + 2 * CEDE} 1020 ${Y0}`} className="varal-corda-base" vectorEffect="non-scaling-stroke" />
          <path d={`M-20 ${Y0} Q500 ${Y0 + 2 * CEDE} 1020 ${Y0}`} className="varal-corda-trama" vectorEffect="non-scaling-stroke" />
        </svg>
        {fotos.map((f, i) => {
          const t = (i + 0.5) / total
          return (
            <div
              key={f.legenda}
              className="varal-item"
              style={{
                left: `${t * 100}%`,
                top: `${Y0 + 4 * CEDE * t * (1 - t) - 12}px`,
                '--rot': `${f.rotacao}deg`,
                '--atraso': `${i * -1.3}s`,
                '--largura': `${f.largura ?? 170}px`,
              }}
            >
              <Polaroid foto={f.foto} legenda={f.legenda} prendedor="clipe" cor={CORES_PRENDEDOR[i % CORES_PRENDEDOR.length]} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
