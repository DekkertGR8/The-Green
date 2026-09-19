import { useEffect, useState } from 'react'
import { asString, type ApiRecord } from './api/http'
import {
  borrarSesion,
  esPersonal,
  guardarSesion,
  leerSesion,
  type Sesion,
} from './auth/sesion'
import {
  guardarCarrito,
  leerCarrito,
  totalUnidades,
  type CartItem,
} from './cart/carrito'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ResourcePage } from './pages/ResourcePage'
import { LoginPage } from './pages/LoginPage'
import { RegistroPage } from './pages/RegistroPage'
import { CarritoPage } from './pages/CarritoPage'
import { AccesoDenegado } from './pages/AccesoDenegado'
import { getResource, vistaRequierePersonal, type ViewId } from './config/resources'
import { listarProductos } from './services/product.service'
import './App.css'

function App() {
  const [vista, setVista] = useState<ViewId>('inicio')
  const [productos, setProductos] = useState<ApiRecord[]>([])
  const [cargandoHome, setCargandoHome] = useState(true)
  const [errorHome, setErrorHome] = useState('')
  const [sesion, setSesion] = useState<Sesion | null>(() => leerSesion())
  const [carrito, setCarrito] = useState<CartItem[]>(() => leerCarrito())

  useEffect(() => {
    const cargarHome = async () => {
      setCargandoHome(true)
      setErrorHome('')
      try {
        const lista = await listarProductos()
        setProductos(lista)
      } catch {
        setErrorHome('No se pudo cargar la carta inicial.')
      } finally {
        setCargandoHome(false)
      }
    }

    void cargarHome()
  }, [])

  const actualizarCarrito = (items: CartItem[]) => {
    setCarrito(items)
    guardarCarrito(items)
  }

  const agregarAlCarrito = (producto: ApiRecord) => {
    const id = producto.id
    const precio = Number(producto.precio) || 0
    const existe = carrito.find((item) => item.id === id)
    if (existe) {
      actualizarCarrito(
        carrito.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
        ),
      )
      return
    }
    actualizarCarrito([
      ...carrito,
      {
        id,
        nombre: asString(producto.nombre),
        precio,
        imagen: asString(producto.imagen),
        cantidad: 1,
      },
    ])
  }

  const cambiarCantidad = (id: string, cantidad: number) => {
    if (cantidad < 1) {
      actualizarCarrito(carrito.filter((item) => item.id !== id))
      return
    }
    actualizarCarrito(
      carrito.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    )
  }

  const iniciarSesion = (siguiente: Sesion) => {
    guardarSesion(siguiente)
    setSesion(siguiente)
  }

  const salir = () => {
    borrarSesion()
    setSesion(null)
    setVista('inicio')
  }

  const resource = getResource(vista)

  return (
    <div className="app-shell">
      <Header
        vistaActiva={vista}
        onCambiarVista={setVista}
        sesion={sesion}
        onSalir={salir}
        unidadesCarrito={totalUnidades(carrito)}
      />
      <main className="app-main">
        {vista === 'login' ? (
          <LoginPage onSesion={iniciarSesion} onCambiarVista={setVista} />
        ) : vista === 'registro' ? (
          <RegistroPage onSesion={iniciarSesion} onCambiarVista={setVista} />
        ) : vista === 'carrito' ? (
          <CarritoPage
            items={carrito}
            sesion={sesion}
            onCambiarCantidad={cambiarCantidad}
            onQuitar={(id) => actualizarCarrito(carrito.filter((item) => item.id !== id))}
            onVaciar={() => actualizarCarrito([])}
            onCambiarVista={setVista}
          />
        ) : vistaRequierePersonal(vista) && !esPersonal(sesion) ? (
          <AccesoDenegado onCambiarVista={setVista} />
        ) : vista === 'inicio' || !resource ? (
          <HomePage
            productos={productos}
            cargando={cargandoHome}
            error={errorHome}
            onCambiarVista={setVista}
            onAgregar={agregarAlCarrito}
            puedeGestionar={esPersonal(sesion)}
          />
        ) : (
          <ResourcePage
            key={resource.id}
            resource={resource}
            onAgregar={resource.id === 'producto' ? agregarAlCarrito : undefined}
            puedeGestionar={esPersonal(sesion)}
          />
        )}
      </main>
      <Footer onCambiarVista={setVista} sesion={sesion} />
    </div>
  )
}

export default App
