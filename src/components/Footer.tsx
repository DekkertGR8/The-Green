import { NAV_ITEMS, type ViewId } from '../config/resources'

interface FooterProps {
  onCambiarVista: (vista: ViewId) => void
}

export function Footer({ onCambiarVista }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="brand-name">The Green</p>
          <p className="footer-lead">
            Casa de café y cócteles con alma vintage e industrial. Granos de
            especialidad, destilados de autor y una barra que no apura la noche.
          </p>
        </div>

        <div className="footer-col">
          <h3>Carta y gestión</h3>
          <ul>
            {NAV_ITEMS.filter((item) => item.id !== 'inicio').map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => onCambiarVista(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Casa y horarios</h3>
          <p>Calle 26 # 7-45, Bogotá</p>
          <p>Lun–Jue 08:00 – 22:00</p>
          <p>Vie–Sáb 08:00 – 01:00</p>
          <p>Dom 09:00 – 20:00</p>
          <p>+57 310 458 2210</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} The Green Café & Bar. Sistema interno de
          carta, clientes y órdenes.
        </p>
      </div>
    </footer>
  )
}
