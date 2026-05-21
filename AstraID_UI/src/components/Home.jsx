import { useAuth } from '../context/AuthContext'
import './Home.css'

export function Home() {
  const { user, logout } = useAuth()

  return (
    <section className="home-view" aria-label="Dashboard">
      <p className="home-view__welcome">
        Welcome, <span className="home-view__name">{user?.name ?? user?.email}</span>
      </p>
      <button type="button" className="home-view__logout" onClick={logout}>
        Sign out
      </button>
    </section>
  )
}
