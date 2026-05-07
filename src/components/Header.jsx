import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'All Merchandise', to: '/collections/all-merchandise' },
  { label: 'All Music', to: '/collections/all-music' },
  { label: 'Club Wallen', to: '/pages/what-is-club-wallen' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header__wrapper scheme-scheme1 z-[10] mx-auto w-full section__wrapper sticky top-0 bg-white border-b border-gray-200">
      <div className="header__inner flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="header__brand text_navigation_lg font-bold no-underline text-gray-900">
          Morgan Wallen
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.to} className="header__navigation-item">
                <Link
                  to={item.to}
                  className={`text_navigation_lg no-underline transition-colors ${
                    location.pathname === item.to
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="md:hidden hamburger-btn-wrapper p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-200"
        >
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.to} className="header__navigation-item border-b border-gray-100">
                <Link
                  to={item.to}
                  className={`block px-4 md:px-8 py-3 text_navigation_lg no-underline transition-colors ${
                    location.pathname === item.to
                      ? 'bg-gray-50 text-gray-900 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
