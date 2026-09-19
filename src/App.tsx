import { useEffect, useState } from 'react'
import { type ApiRecord } from './api/http'
import { puedeGestionarRecurso, puedeVerVista } from './auth/roles'
import { borrarSesion, guardarSesion, leerSesion, type Sesion } from './auth/sesion'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ResourcePage } from './pages/ResourcePage'
import { LoginPage } from './pages/LoginPage'
import { RegistroPage } from './pages/RegistroPage'
import { CarritoPage } from './pages/CarritoPage'
import { AccesoDenegado } from './pages/AccesoDenegado'
import { accesoDeVista, getResource, type ViewId } from './config/resources'
import { useCarrito } from './hooks/useCarrito'
import { listarProductos } from './services/product.service'
import './App.css'

function App() {
  const [vista, setVista] = useState<ViewId>('inicio')
  const [productos, setProductos] = useState<ApiRecord[]>([])
  const [cargandoHome, setCargandoHome] = useState(true)
  const [errorHome, setErrorHome] = useState('')
  const [sesion, setSesion] = useState<Sesion | null>(() => leerSesion())
  const { carrito, agregarAlCarrito, cambiarCantidad, quitar, vaciar } = useCarrito()

  useEffect(() => {
    const cargarHome = async () => {
      setCargandoHome(true)
      setErrorHome('')
      try {
        const lista = await listarProductos()
        setProductos(
          lista.filter((item) => item.estado !== false && item.estado !== 'false'),
        )
      } catch {
        setErrorHome('No se pudo cargar la carta inicial.')
      } finally {
        setCargandoHome(false)
      }
    }

    void cargarHome()
  }, [])

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
  const vistaPermitida = puedeVerVista(accesoDeVista(vista), sesion)

  return (
    <div className="app-shell">
      <Header
        vistaActiva={vista}
        onCambiarVista={setVista}
        sesion={sesion}
        onSalir={salir}
        unidadesCarrito={carrito.reduce((acc, item) => acc + item.cantidad, 0)}
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
            onQuitar={quitar}
            onVaciar={vaciar}
            onCambiarVista={setVista}
          />
        ) : !vistaPermitida ? (
          <AccesoDenegado
            onCambiarVista={setVista}
            requiereAdmin={accesoDeVista(vista) === 'admin'}
          />
        ) : vista === 'inicio' || !resource ? (
          <HomePage
            productos={productos}
            cargando={cargandoHome}
            error={errorHome}
            onCambiarVista={setVista}
            onAgregar={agregarAlCarrito}
            sesion={sesion}
          />
        ) : (
          <ResourcePage
            key={resource.id}
            resource={resource}
            sesion={sesion}
            onAgregar={resource.id === 'producto' ? agregarAlCarrito : undefined}
            puedeGestionar={puedeGestionarRecurso(resource.id, sesion)}
          />
        )}
      </main>
      <Footer onCambiarVista={setVista} sesion={sesion} />
    </div>
  )
}

export default App
