import { asString, type ApiRecord } from '../api/http'
import { crearCliente } from '../services/client.service'
import { crearUsuario, listarUsuarios } from '../services/user.service'
import { partirNombre } from '../utils/nombre'
import { ROL_CLIENTE, esRolPersonalValido, normalizarRol } from './roles'
import { sesionDesdeUsuario, type Sesion } from './sesion'

export async function autenticar(correo: string, clave: string): Promise<Sesion> {
  const correoLimpio = correo.trim().toLowerCase()
  const usuarios = await listarUsuarios()
  const encontrado = usuarios.find((usuario) => {
    return (
      asString(usuario.correo).toLowerCase() === correoLimpio &&
      asString(usuario.clave) === clave
    )
  })
  if (!encontrado) {
    throw new Error('Correo o clave incorrectos.')
  }
  if (!esUsuarioActivo(encontrado)) {
    throw new Error('Esta cuenta está inactiva.')
  }
  return sesionDesdeUsuario(encontrado)
}

export async function registrarCliente(datos: {
  nombre: string
  correo: string
  clave: string
  telefono: string
}): Promise<Sesion> {
  const correoLimpio = datos.correo.trim().toLowerCase()
  const usuarios = await listarUsuarios()
  const existe = usuarios.some(
    (usuario) => asString(usuario.correo).toLowerCase() === correoLimpio,
  )
  if (existe) {
    throw new Error('Ese correo ya tiene una cuenta.')
  }

  const usuario = await crearUsuario({
    nombre: datos.nombre.trim(),
    correo: correoLimpio,
    clave: datos.clave,
    rol: ROL_CLIENTE,
    estado: true,
  })

  const partes = partirNombre(datos.nombre)
  await crearCliente({
    nombre: partes.nombre,
    apellido: partes.apellido,
    correo: correoLimpio,
    telefono: datos.telefono.trim() || '0000000000',
    direccion: 'The Green',
    estado: true,
  })

  return sesionDesdeUsuario(usuario)
}

export function payloadUsuarioEmpleado(datos: Record<string, unknown>) {
  const rol = normalizarRol(asString(datos.rol))
  if (!esRolPersonalValido(rol)) {
    throw new Error('El administrador solo puede crear cuentas de personal.')
  }
  return {
    ...datos,
    rol,
    correo: asString(datos.correo).trim().toLowerCase(),
  }
}

export function esUsuarioActivo(usuario: ApiRecord) {
  return usuario.estado !== false && usuario.estado !== 'false'
}
