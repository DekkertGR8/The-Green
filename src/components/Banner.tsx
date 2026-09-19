interface BannerProps {
  eyebrow: string
  title: string
  subtitle: string
}

export function Banner({ eyebrow, title, subtitle }: BannerProps) {
  return (
    <section className="hero-banner">
      <p className="hero-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
    </section>
  )
}
