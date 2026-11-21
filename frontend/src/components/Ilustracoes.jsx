import { useId } from 'react'

// Cenas ilustradas usadas como "fotos" das Polaroids decorativas da landing page.
// Todas usam o viewBox 120x90 (proporção 4:3) e as cores da marca.

const CORACAO = 'M10 18 C 2 12, 0 6, 5 3 C 8 1, 10 4, 10 5 C 10 4, 12 1, 15 3 C 20 6, 18 12, 10 18 Z'

function Cena({ children, rotulo }) {
  return (
    <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" role="img" aria-label={rotulo}>
      {children}
    </svg>
  )
}

function Balao({ x, y, cor, escala = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <path d="M0 18 Q -2 34, 3 48" stroke="#7a6a60" strokeWidth="0.7" fill="none" />
      <ellipse cx="0" cy="0" rx="10" ry="12.5" fill={cor} />
      <ellipse cx="-3.5" cy="-5" rx="2.4" ry="3.6" fill="#fff" opacity="0.45" />
      <path d="M-2 12.2 L2 12.2 L0 15 Z" fill={cor} />
    </g>
  )
}

export function Baloes() {
  const id = useId()
  return (
    <Cena rotulo="Balões coloridos no céu">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd3f2" />
          <stop offset="1" stopColor="#e6f5fd" />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill={`url(#${id})`} />
      <ellipse cx="22" cy="70" rx="20" ry="7" fill="#fff" opacity="0.9" />
      <ellipse cx="96" cy="22" rx="16" ry="5" fill="#fff" opacity="0.8" />
      <Balao x={44} y={34} cor="#0277ba" />
      <Balao x={64} y={26} cor="#e34155" escala={1.15} />
      <Balao x={82} y={40} cor="#ffa300" escala={0.9} />
    </Cena>
  )
}

export function Bolo() {
  return (
    <Cena rotulo="Bolo de aniversário com velas">
      <rect width="120" height="90" fill="#ffd6dc" />
      <circle cx="18" cy="16" r="2" fill="#ffa300" />
      <circle cx="102" cy="22" r="2.5" fill="#0277ba" />
      <circle cx="96" cy="64" r="1.6" fill="#e34155" />
      <rect x="0" y="76" width="120" height="14" fill="#f6b3bd" />
      <ellipse cx="60" cy="77" rx="36" ry="4" fill="#fff" />
      <rect x="32" y="52" width="56" height="24" rx="4" fill="#fff4e8" />
      <rect x="32" y="62" width="56" height="5" fill="#ffa300" />
      <path d="M32 54 h56 v4 q-4 6 -8 0 q-4 6 -8 0 q-4 6 -8 0 q-4 6 -8 0 q-4 6 -8 0 q-4 6 -8 0 q-4 6 -8 0 Z" fill="#e34155" />
      <rect x="38" y="36" width="44" height="17" rx="3" fill="#fff4e8" />
      <path d="M38 38 h44 v3 q-3.7 5 -7.3 0 q-3.7 5 -7.3 0 q-3.7 5 -7.3 0 q-3.7 5 -7.3 0 q-3.7 5 -7.3 0 q-3.7 5 -7.3 0 Z" fill="#0277ba" />
      {[48, 60, 72].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y="24" width="3" height="12" rx="1" fill="#fff" stroke="#e34155" strokeWidth="0.6" />
          <path d={`M${x} 15 q3.5 5 0 8.5 q-3.5 -3.5 0 -8.5 Z`} fill="#ffa300" />
        </g>
      ))}
    </Cena>
  )
}

export function Presente() {
  return (
    <Cena rotulo="Caixa de presente com laço">
      <rect width="120" height="90" fill="#ffe4b0" />
      <g fill="#fff" opacity="0.7">
        <circle cx="16" cy="20" r="3" />
        <circle cx="104" cy="14" r="2" />
        <circle cx="100" cy="70" r="3.5" />
        <circle cx="20" cy="72" r="2" />
      </g>
      <rect x="36" y="44" width="48" height="36" rx="2" fill="#e34155" />
      <rect x="32" y="36" width="56" height="11" rx="2" fill="#f05c72" />
      <rect x="56" y="36" width="8" height="44" fill="#0277ba" />
      <ellipse cx="52" cy="31" rx="9" ry="5.5" transform="rotate(-20 52 31)" fill="none" stroke="#0277ba" strokeWidth="3.4" />
      <ellipse cx="68" cy="31" rx="9" ry="5.5" transform="rotate(20 68 31)" fill="none" stroke="#0277ba" strokeWidth="3.4" />
      <circle cx="60" cy="35" r="3.2" fill="#0277ba" />
    </Cena>
  )
}

export function Confete() {
  const pedacos = [
    [14, 12, 20, '#e34155'], [30, 30, -30, '#ffa300'], [96, 16, 45, '#0277ba'], [104, 42, -15, '#e34155'],
    [20, 56, 60, '#0277ba'], [88, 70, 10, '#ffa300'], [44, 14, 70, '#0277ba'], [76, 10, -50, '#ffa300'],
    [10, 80, -20, '#ffa300'], [108, 82, 35, '#0277ba'], [36, 78, 15, '#e34155'], [100, 58, 80, '#fff'],
  ]
  return (
    <Cena rotulo="Chapéu de festa e confetes">
      <rect width="120" height="90" fill="#cfe9f8" />
      {pedacos.map(([x, y, r, cor]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="3" rx="0.8" fill={cor} transform={`rotate(${r} ${x + 3} ${y + 1.5})`} />
      ))}
      <path d="M60 18 L80 72 Q60 80 40 72 Z" fill="#ffa300" />
      <path d="M53 37 Q60 40 67 37 L70.5 46 Q60 50 49.5 46 Z" fill="#e34155" />
      <path d="M46.5 55 Q60 59 73.5 55 L77 64 Q60 69 43 64 Z" fill="#e34155" />
      <circle cx="60" cy="17" r="5" fill="#0277ba" />
      <path d="M38 72 Q60 82 82 72" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Cena>
  )
}

export function Coracoes() {
  return (
    <Cena rotulo="Corações flutuando">
      <rect width="120" height="90" fill="#fde2e4" />
      <path d={CORACAO} fill="#e34155" transform="translate(38 20) scale(2.3)" />
      <path d={CORACAO} fill="#ffa300" transform="translate(14 14) scale(1)" opacity="0.9" />
      <path d={CORACAO} fill="#0277ba" transform="translate(88 18) scale(1.2)" />
      <path d={CORACAO} fill="#f58a9b" transform="translate(84 56) scale(1.4)" />
      <path d={CORACAO} fill="#e34155" transform="translate(16 60) scale(0.8)" opacity="0.7" />
      <path d={CORACAO} fill="#ffa300" transform="translate(66 72) scale(0.6)" />
    </Cena>
  )
}

export function PorDoSol() {
  const id = useId()
  return (
    <Cena rotulo="Pôr do sol sobre colinas">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb86b" />
          <stop offset="1" stopColor="#ffd9dc" />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill={`url(#${id})`} />
      <circle cx="62" cy="54" r="18" fill="#ffa300" />
      <path d="M0 62 Q30 44 62 60 T120 54 V90 H0 Z" fill="#f08797" />
      <path d="M0 76 Q40 60 80 74 T120 70 V90 H0 Z" fill="#d42f4b" />
      <path d="M24 30 q3 -3 6 0 q3 -3 6 0" stroke="#7a3a3a" strokeWidth="1" fill="none" />
      <path d="M88 22 q2.4 -2.4 4.8 0 q2.4 -2.4 4.8 0" stroke="#7a3a3a" strokeWidth="1" fill="none" />
    </Cena>
  )
}
