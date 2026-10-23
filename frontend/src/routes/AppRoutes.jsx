import { Route, Routes } from 'react-router-dom'
import RotaPrivada from './RotaPrivada'
import RotaVisitante from './RotaVisitante'
import AdminLayout from '../layouts/AdminLayout'
import PublicLayout from '../layouts/PublicLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Cadastro from '../pages/Cadastro'
import Celebracoes from '../pages/Celebracoes'
import NovaCelebracao from '../pages/NovaCelebracao'
import DetalhesCelebracao from '../pages/DetalhesCelebracao'
import EditarCelebracao from '../pages/EditarCelebracao'
import Perfil from '../pages/Perfil'
import Contribuir from '../pages/Contribuir'
import Mural from '../pages/Mural'
import NaoEncontrada from '../pages/NaoEncontrada'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout navegacao />}>
        <Route path="/" element={<Home />} />
        <Route element={<RotaVisitante />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        {/* Links públicos: c = contribuir, m = mural */}
        <Route path="/c/:token" element={<Contribuir />} />
        <Route path="/m/:token" element={<Mural />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>

      <Route element={<RotaPrivada />}>
        <Route element={<AdminLayout />}>
          <Route path="/celebracoes" element={<Celebracoes />} />
          <Route path="/celebracoes/nova" element={<NovaCelebracao />} />
          <Route path="/celebracoes/:id" element={<DetalhesCelebracao />} />
          <Route path="/celebracoes/:id/editar" element={<EditarCelebracao />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Route>
    </Routes>
  )
}
