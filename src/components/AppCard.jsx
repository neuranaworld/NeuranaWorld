export default function AppCard({ app }) {
  const cardStyle = app.color
    ? {
        borderColor: app.color + '40',
      }
    : {}

  return (
    <div
      className={`card game-card animate-fade-in ${app.comingSoon ? 'coming-soon-card' : ''}`}
      style={cardStyle}
    >
      <div className="card-icon">{app.icon}</div>
      <h3>{app.name}</h3>
      <p className="card-category">{app.category}</p>
      <p className="card-desc">{app.shortDesc}</p>
      {app.comingSoon && <span className="badge coming-soon">🚧 Yakında</span>}
    </div>
  )
}
