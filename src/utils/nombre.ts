export function partirNombre(nombre: string) {
  const partes = nombre.trim().split(/\s+/)
  return {
    nombre: partes[0] || nombre,
    apellido: partes.slice(1).join(' ') || 'Casa',
  }
}
