import { useEffect, useState } from 'react'
import { listarRecurso, type ApiRecord } from './api/http'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ResourcePage } from './pages/ResourcePage'
import { getResource, type ViewId } from './config/resources'
import './App.css'

function App() {
  const [vista, setVista] = useState<ViewId>('inicio')
  const [productos, setProductos] = useState<ApiRecord[]>([])
  const [cargandoHome, setCargandoHome] = useState(true)
  const [errorHome, setErrorHome] = useState('')

  useEffect(() => {
    const cargarHome = async () => {
      setCargandoHome(true)
      setErrorHome('')
      try {
        const lista = await listarRecurso('producto')
        setProductos(lista)
      } catch {
        setErrorHome('No se pudo cargar la carta inicial.')
      } finally {
        setCargandoHome(false)
      }
    }

    void cargarHome()
  }, [])

  const resource = getResource(vista)

  return (
    <div className="app-shell">
      <Header vistaActiva={vista} onCambiarVista={setVista} />
      <main className="app-main">
        {vista === 'inicio' || !resource ? (
          <HomePage
            productos={productos}
            cargando={cargandoHome}
            error={errorHome}
            onCambiarVista={setVista}
          />
        ) : (
          <ResourcePage key={resource.id} resource={resource} />
        )}
      </main>
      <Footer onCambiarVista={setVista} />
    </div>
  )
}

export default App
