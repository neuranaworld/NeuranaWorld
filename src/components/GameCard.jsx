import { Link } from 'react-router-dom'

export default function GameCard({ game }) {
  const cardStyle = game.color
    ? {
        borderColor: game.color + '40',
        '--card-hover-shadow': `0 12px 40px ${game.color}40`,
      }
    : {}

  return (
    <Link
      to={game.route}
      className="card game-card animate-fade-in"
      style={cardStyle}
      onMouseEnter={(e) => {
        if (game.color) {
          e.currentTarget.style.boxShadow = `0 12px 40px ${game.color}40`
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="card-icon">{game.icon}</div>
      <h3>{game.name}</h3>
      <p className="card-category">{game.category}</p>
      <p className="card-desc">{game.shortDesc}</p>
    </Link>
  )
}
