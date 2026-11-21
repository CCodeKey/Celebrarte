import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import logoContorno from '../assets/logo-contorno.png'

// No tema escuro usa a versão com contorno branco, que mantém o azul legível
export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="logo">
      <picture>
        <source srcSet={logoContorno} media="(prefers-color-scheme: dark)" />
        <img src={logo} alt="Celebrarte" width="560" height="201" />
      </picture>
    </Link>
  )
}
