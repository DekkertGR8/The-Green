import { useState } from 'react'
import { NAV_ITEMS, type ViewId } from '../config/resources'

interface HeaderProps {
  vistaActiva: ViewId
  onCambiarVista: (vista: ViewId) => void
}

export function Header({ vistaActiva, onCambiarVista }: HeaderProps) {
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
      </div>
    </header>
  )
}
