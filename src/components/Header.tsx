import { useState } from 'react'
import type { Sesion } from '../auth/sesion'
import { NAV_ITEMS, type ViewId } from '../config/resources'

interface HeaderProps {
  vistaActiva: ViewId
  onCambiarVista: (vista: ViewId) => void
  sesion: Sesion | null
  onSalir: () => void
  unidadesCarrito: number
}

export function Header({
  vistaActiva,
  onCambiarVista,
  sesion,
  onSalir,
  unidadesCarrito,
}: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const irA = (vista: ViewId) => {
    onCambiarVista(vista)
    setMenuAbierto(false)
  }

  return (
    <header className="site-header">
      <div className="header-rail">Est. 2024 · Bogotá</div>
      <div className="header-inner">
        <button className="brand" type="button" onClick={() => irA('inicio')}>
          <span className="brand-mark" aria-hidden="true">
            TG
          </span>
          <span className="brand-copy">
            <span className="brand-name">The Green</span>
            <span className="brand-tag">Café & Bar</span>
          </span>
        </button>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav${menuAbierto ? ' is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link${vistaActiva === item.id ? ' is-active' : ''}`}
              onClick={() => irA(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {sesion ? (
            <>
              <span className="session-name">{sesion.nombre}</span>
              <button type="button" className="ghost" onClick={onSalir}>
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`nav-link${vistaActiva === 'login' ? ' is-active' : ''}`}
                onClick={() => irA('login')}
              >
                Entrar
              </button>
              <button
                type="button"
                className={`nav-link${vistaActiva === 'registro' ? ' is-active' : ''}`}
                onClick={() => irA('registro')}
              >
                Registro
              </button>
            </>
          )}
          <button
            type="button"
            className={`cart-button${vistaActiva === 'carrito' ? ' is-active' : ''}`}
            onClick={() => irA('carrito')}
          >
            Carrito
            {unidadesCarrito > 0 && (
              <span className="cart-badge">{unidadesCarrito}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
