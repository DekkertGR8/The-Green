const BASE = 'https://6aa6bca3d7765db9850791e4.mockapi.io'

async function listar(recurso) {
  const respuesta = await fetch(`${BASE}/${recurso}`)
  if (!respuesta.ok) throw new Error(`GET ${recurso} ${respuesta.status}`)
  return respuesta.json()
}

async function actualizar(recurso, id, datos) {
  const respuesta = await fetch(`${BASE}/${recurso}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!respuesta.ok) throw new Error(`PUT ${recurso}/${id} ${respuesta.status}`)
  return respuesta.json()
}

async function crear(recurso, datos) {
  const respuesta = await fetch(`${BASE}/${recurso}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!respuesta.ok) throw new Error(`POST ${recurso} ${respuesta.status}`)
  return respuesta.json()
}

async function eliminar(recurso, id) {
  const respuesta = await fetch(`${BASE}/${recurso}/${id}`, { method: 'DELETE' })
  if (!respuesta.ok) throw new Error(`DELETE ${recurso}/${id} ${respuesta.status}`)
}

function claveNombre(item) {
  return String(item.nombre ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function claveCorreo(item) {
  return String(item.correo ?? '')
    .trim()
    .toLowerCase()
}

async function quitarDuplicados(recurso, clave) {
  const lista = await listar(recurso)
  const vistos = new Map()
  const borrar = []
  for (const item of lista) {
    const key = clave(item)
    if (!key) continue
    if (vistos.has(key)) borrar.push(item.id)
    else vistos.set(key, item.id)
  }
  for (const id of borrar) {
    await eliminar(recurso, id)
    console.log(`Eliminado duplicado ${recurso}/${id}`)
  }
}

const productosOficiales = {
  1: {
    nombre: 'Espresso House',
    descripcion: 'Doble shot con crema densa y cacao amargo.',
    precio: 8500,
    stock: 40,
    categoria: 'Cafes de especialidad',
    imagen: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800',
    estado: true,
  },
}

const usuariosOficiales = [
  {
    id: '1',
    nombre: 'Luis Miguel Triviño',
    correo: 'migueltr28@outlook.es',
    clave: 'thegreen24',
    rol: 'administrador',
    estado: true,
  },
  {
    correo: 'admin@thegreen.bar',
    nombre: 'Admin The Green',
    clave: 'admin24',
    rol: 'administrador',
    estado: true,
  },
  {
    id: '2',
    nombre: 'Valentina Diaz Carrillo',
    correo: 'valentina@thegreen.bar',
    clave: 'barra24',
    rol: 'bartender',
    estado: true,
  },
  {
    id: '3',
    nombre: 'Andres Peña',
    correo: 'andres@thegreen.bar',
    clave: 'caja24',
    rol: 'cajero',
    estado: true,
  },
  {
    id: '5',
    nombre: 'Tomas Rivera',
    correo: 'tomas@thegreen.bar',
    clave: 'barista24',
    rol: 'barista',
    estado: true,
  },
  {
    id: '6',
    nombre: 'Mariana Lopez',
    correo: 'mariana@thegreen.bar',
    clave: 'sala24',
    rol: 'mesero',
    estado: true,
  },
  {
    id: '7',
    nombre: 'Helena Duarte',
    correo: 'helena@thegreen.bar',
    clave: 'cocina24',
    rol: 'chef',
    estado: true,
  },
]

async function main() {
  await actualizar('producto', '1', productosOficiales[1])
  console.log('Producto 1 normalizado')

  await quitarDuplicados('producto', claveNombre)
  await quitarDuplicados('usuario', claveCorreo)
  await quitarDuplicados('cliente', claveCorreo)
  await quitarDuplicados('estado_orden', claveNombre)

  const usuarios = await listar('usuario')
  for (const oficial of usuariosOficiales) {
    const porCorreo = usuarios.find((item) => claveCorreo(item) === oficial.correo)
    const porId = oficial.id
      ? usuarios.find((item) => item.id === oficial.id)
      : undefined
    const datos = {
      nombre: oficial.nombre,
      correo: oficial.correo,
      clave: oficial.clave,
      rol: oficial.rol,
      estado: oficial.estado,
    }
    if (porCorreo) {
      await actualizar('usuario', porCorreo.id, datos)
      console.log(`Usuario ${oficial.correo} actualizado`)
    } else if (porId) {
      await actualizar('usuario', porId.id, datos)
      console.log(`Usuario ${oficial.correo} actualizado por id`)
    } else {
      await crear('usuario', datos)
      console.log(`Usuario ${oficial.correo} creado`)
    }
  }

  const ordenes = await listar('orden')
  const ordenesFalsas = new Set(['4', '5', '6', '7'])
  for (const orden of ordenes) {
    const cliente = String(orden.cliente ?? '').toLowerCase()
    if (ordenesFalsas.has(orden.id) || cliente.startsWith('cliente ')) {
      await eliminar('orden', orden.id)
      console.log(`Orden sucia ${orden.id} eliminada`)
    }
  }

  const estados = await listar('estado_orden')
  for (const estado of estados) {
    const extras = { color: estado.color }
    if (String(extras.color).startsWith('color ')) {
      await actualizar('estado_orden', estado.id, {
        nombre: estado.nombre,
        descripcion: estado.descripcion,
        color: '#c4a35a',
        estado: true,
      })
      console.log(`Estado ${estado.id} normalizado`)
    }
  }

  console.log('Listo')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
