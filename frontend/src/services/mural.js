import { request } from './api'

export const buscarMural = (token) => request(`/mural/${token}`)
