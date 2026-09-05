import { Link } from 'react-router-dom';
import { Globe, Code2, BriefcaseBusiness, MessageSquare, Terminal } from 'lucide-react';
import LorapokLogo from '../LorapokLogo';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0f] pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <LorapokLogo className="w-8 h-8 text-[var(--lp-accent,#67ff8f)]" />
              <span className="font-bold text-white text-lg">Lorapok Labs</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Open-source products that feel alive. Biological UI, sensory computing, and high-performance developer tools from Dhaka to the world.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com/Lorapok" target="_blank" rel="noreferrer" title="GitHub Org" className="text-gray-400 hover:text-[var(--lp-accent,#67ff8f)] transition-colors">
                <Code2 className="w-5 h-5" />
              </a>
              <a href="https://github.com/Maijied" target="_blank" rel="noreferrer" title="Founder GitHub (@Maijied)" className="text-gray-400 hover:text-[var(--lp-accent,#67ff8f)] transition-colors">
                <Terminal className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/showcase/lorapok/" target="_blank" rel="noreferrer" title="LinkedIn Showcase" className="text-gray-400 hover:text-[var(--lp-accent,#67ff8f)] transition-colors">
                <BriefcaseBusiness className="w-5 h-5" />
              </a>
              <a href="https://x.com/LorapokLabs" target="_blank" rel="noreferrer" title="X / Twitter" className="text-gray-400 hover:text-[var(--lp-accent,#67ff8f)] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="https://gravatar.com/lorapok" target="_blank" rel="noreferrer" title="Lorapok Network" className="text-gray-400 hover:text-[var(--lp-accent,#67ff8f)] transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Flagship Products</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/projects" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Lorapok API Atlas</Link></li>
              <li><Link to="/projects" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Cursor Curse Monitor</Link></li>
              <li><Link to="/projects" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Loragent AI Framework</Link></li>
              <li><Link to="/projects" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">ReportKit Core</Link></li>
              <li><Link to="/projects" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Lorapok Media Player</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Organization & Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/team" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Team & Collective</Link></li>
              <li><Link to="/changelog" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Changelog & Releases</Link></li>
              <li><Link to="/about" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Founder & Mission</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Contact Labs</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Marketplaces & Social</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://github.com/Lorapok" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">GitHub Org (@Lorapok)</a></li>
              <li><a href="https://marketplace.visualstudio.com/publishers/LorapokLabs" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">VS Code Marketplace</a></li>
              <li><a href="https://open-vsx.org/namespace/LorapokLabs" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Open VSX Registry</a></li>
              <li><a href="https://addons.mozilla.org/firefox/user/lorapok/" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Firefox AMO Add-ons</a></li>
              <li><a href="https://www.producthunt.com/posts/lorapok-atlas" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Product Hunt</a></li>
              <li><a href="https://www.npmjs.com/search?q=lorapok" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">npm Packages</a></li>
              <li><a href="https://www.reddit.com/r/LorapokLabs/" target="_blank" rel="noreferrer" className="hover:text-[var(--lp-accent,#67ff8f)] transition-colors">Reddit /r/LorapokLabs</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.06)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 Lorapok Labs. MIT Licensed.</p>
          <div className="flex items-center gap-6">
            <Link to="/dev" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Developer Portal</Link>
            <p>Built with React 19 + Vite</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
