'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const navLinks = [
  { href: '/', label: 'Topics', icon: '📚' },
  { href: '/grammar', label: 'Grammar', icon: '📖' },
  { href: '/reading', label: 'Reading', icon: '🔤' },
  { href: '/progress', label: 'Progress', icon: '📈' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isDark = mounted && theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-card-dark/90 backdrop-blur-md shadow-sm'
          : 'bg-white dark:bg-card-dark'
      } border-b border-gray-100 dark:border-gray-800`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group no-tap-highlight">
          <span className="text-2xl transition-transform duration-200 group-hover:scale-110">🇩🇪</span>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-primary dark:text-primary-light">Deutsch</span>
            <span className="text-accent">Lernen</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 no-tap-highlight"
            aria-label="Toggle theme"
          >
            {mounted ? (isDark ? '☀️' : '🌙') : '🌙'}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 no-tap-highlight"
            aria-label="Toggle menu"
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        } bg-white dark:bg-card-dark border-t border-gray-100 dark:border-gray-800`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
