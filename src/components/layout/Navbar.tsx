import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import LorapokLogo from '../LorapokLogo';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/projects' },
  { name: 'Agents', path: '/agents' },
  { name: 'Team', path: '/team' },
  { name: 'About', path: '/about' },
  { name: 'Changelog', path: '/changelog' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] border-b border-[rgba(255,255,255,0.06)] bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <LorapokLogo className="w-8 h-8 text-[var(--lp-accent,#67ff8f)]" />
              <span className="font-bold text-white text-lg tracking-wide">Lorapok Labs</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-[var(--lp-accent,#67ff8f)] bg-white/5'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/lorapok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[var(--lp-accent,#67ff8f)] transition-colors flex items-center gap-1.5 text-sm"
              title="GitHub"
            >
              <Code2 className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-mono opacity-80">GitHub</span>
            </a>
            <Link
              to="/contact"
              className="px-4 py-2 text-sm font-medium text-black bg-[var(--lp-accent,#67ff8f)] rounded-md hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(103,255,143,0.3)]"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0f] absolute w-full left-0 shadow-xl"
          >
            <div className="px-3 pt-3 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-[var(--lp-accent,#67ff8f)] bg-white/5'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3 px-3 py-3 border-t border-[rgba(255,255,255,0.06)]">
                <a
                  href="https://github.com/lorapok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--lp-accent,#67ff8f)] py-1"
                >
                  <Code2 className="w-5 h-5" />
                  <span>GitHub Organization</span>
                </a>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium text-black bg-[var(--lp-accent,#67ff8f)] rounded-md hover:opacity-90 transition-opacity"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
