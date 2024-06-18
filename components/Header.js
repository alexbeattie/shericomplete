import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const menuItems = [
  { href: '/', label: 'Home' },
  { href: '/available-listings', label: 'Available' },
  { href: '/sold-listings', label: 'Sold' },
  { href: '/about', label: 'About' },
  { href: '/full-page-map', label: 'Map' },
  { href: '/contact', label: 'Contact' },

];

const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  const linkClasses = (path) => {
    return router.pathname === path
      ? 'text-slate-800 font-semibold uppercase'
      : 'text-slate-500 hover:text-slate-800 uppercase';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="flex items-center">
            <Image
              src="/images/flc-logo-horizontal-dark.png"
              alt="Logo"
              width={250}
              height={50}
              className="cursor-pointer"
            />
            <span className="ml-2 text-xl font-bold text-slate-800"></span>
          </a>
        </Link>
        <nav className="hidden md:flex space-x-4 font-secondary text-base uppercase">
          {menuItems.map((item) => (
            <Link href={item.href} legacyBehavior key={item.href}>
              <a className={linkClasses(item.href)}>{item.label}</a>
            </Link>
          ))}
        </nav>
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="text-slate-500 hover:text-blue-700 focus:outline-none md:hidden p-2 ml-4"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>
        <nav
          ref={sidebarRef}
          className={`fixed inset-y-0 pt-8 right-0 bg-white z-20 w-64 max-w-full transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className="p-4">
            <ul className="sidebar-menu space-y-4">
              <p className='stroke-current'></p>
              {menuItems.map((item) => (
                <li className="treeview stroke-slate-50" key={item.href}>
                  <Link href={item.href} legacyBehavior>
                    <a className={linkClasses(item.href)} onClick={handleLinkClick}>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ease-in-out"
          onClick={handleClickOutside}
        ></div>
      )}
    </header>
  );
};

export default Header;
