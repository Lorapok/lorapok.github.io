import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/projects' },
  { name: 'Creator Works', path: '/creator-works' },
  { name: 'Agents', path: '/agents' },
  { name: 'Blog', path: '/blog' },
  { name: 'Team', path: '/team' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" className="logo-type" onClick={() => setOpen(false)} aria-label="Lorapok Labs home">
        <i aria-hidden="true" /> lorapok <span>labs.</span>
      </Link>
      <div id="primary-navigation" className={`nav-links${open ? ' open' : ''}`}>
        {navLinks.map((l) => (
          <NavLink key={l.path} to={l.path} end={l.path === '/'} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpen(false)}>
            {l.name}
          </NavLink>
        ))}
      </div>
      <a className="nav-cta" href="https://github.com/Lorapok" target="_blank" rel="noopener noreferrer">Explore GitHub ↗</a>
      <button
        className="hamburger"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-controls="primary-navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true">{open ? '×' : '☰'}</span>
      </button>
    </nav>
  );
}
