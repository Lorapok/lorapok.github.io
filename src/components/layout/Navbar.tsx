import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/projects/' },
  { name: 'Engineering Craft', path: '/engineering-craft/' },
  { name: 'Creator Works', path: '/creator-works/' },
  { name: 'Mascots', path: '/mascots/' },
  { name: 'Partners', path: '/partners/' },
  { name: 'Agents', path: '/agents/' },
  { name: 'Blog', path: '/blog/' },
  { name: 'Team', path: '/team/' },
  { name: 'About', path: '/about/' },
  { name: 'Contact', path: '/contact/' },
  { name: 'Studio', path: '/dev' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const normalizePath = (path: string) => path === '/' ? '/' : path.replace(/\/$/, '');

  const handleNavigation = (targetPath: string) => {
    setOpen(false);
    if (normalizePath(pathname) !== normalizePath(targetPath)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('nav-menu-open');
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove('nav-menu-open');
    };
  }, [open]);

  return (
    <>
      <button
        className={`nav-backdrop${open ? ' open' : ''}`}
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <nav className="nav" aria-label="Main">
        <Link to="/" className="logo-type" onClick={() => handleNavigation('/')} aria-label="Lorapok Labs home">
          <img src="/assets/ribo/ribo-curious.webp" alt="" aria-hidden="true" /> lorapok <span>labs.</span>
        </Link>
        <div id="primary-navigation" className={`nav-links${open ? ' open' : ''}`}>
          {navLinks.map((l) => (
            <NavLink key={l.path} to={l.path} end={l.path === '/'} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavigation(l.path)}>
              <span>{l.name}</span><b aria-hidden="true">↗</b>
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
          onClick={() => setOpen((current) => !current)}
        >
          <span aria-hidden="true">{open ? '×' : '☰'}</span>
        </button>
      </nav>
    </>
  );
}
