import { RIGHTS_RESERVED } from '../brand'
import './ProjectCredit.css'

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
  { label: 'Security', href: '#security' },
]

export function ProjectCredit() {
  return (
    <footer className="project-credit">
      <nav className="project-credit__links" aria-label="Legal and security">
        {FOOTER_LINKS.map((link, index) => (
          <span key={link.href} className="project-credit__link-item">
            {index > 0 ? (
              <span className="project-credit__sep" aria-hidden>
                •
              </span>
            ) : null}
            <a className="project-credit__link" href={link.href}>
              {link.label}
            </a>
          </span>
        ))}
      </nav>
      <p className="project-credit__rights">{RIGHTS_RESERVED}</p>
    </footer>
  )
}
