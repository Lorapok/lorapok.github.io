import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" className="logo-type" onClick={() => setOpen(false)}>◉ lorapok <span>labs.</span></Link>
      <div className={`nav-links${open ? ' open' : ''}`}>
        {navLinks.map((l) => (
          <NavLink key={l.path} to={l.path} end={l.path === '/'} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpen(false)}>
            {l.name}
          </NavLink>
        ))}
      </div>
      <a className="nav-cta" href="https://github.com/Lorapok" target="_blank" rel="noopener noreferrer">Explore GitHub ↗</a>
      <button className="hamburger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button>
    </nav>
  );
}
