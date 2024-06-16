import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faTachometerAlt, faCreditCard, faSitemap, faInfoCircle, faQuestionCircle, faHome, faBoxOpen, faMoneyBill, faMoneyBillWave, faInfo, faCircleInfo, faVoicemail } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  const linkClasses = (path) => {
    return router.pathname === path
      ? 'text-slate-800 font-semibold'
      : 'text-slate-500 hover:text-blue-700';
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
    <header className='bg-white p-4 fixed top-0 left-0 w-full z-10 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' legacyBehavior>
          <a className='flex items-center'>
            <Image
              src='/images/flc-logo-horizontal-dark.png'
              alt='Logo'
              width={250}
              height={50}
              className='cursor-pointer'
            />
            <span className='ml-2 text-xl font-bold text-slate-800'></span>
          </a>
        </Link>
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className='text-slate-500 hover:text-blue-700 focus:outline-none md:hidden p-2'
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size='lg' />
        </button>
        <nav className='hidden md:flex space-x-4 font-secondary text-base uppercase'>
          <Link href='/' legacyBehavior><a className={linkClasses('/')}>Home</a></Link>
          <Link href='/available-listings' legacyBehavior><a className={linkClasses('/available-listings')}>Available</a></Link>
          <Link href='/sold-listings' legacyBehavior><a className={linkClasses('/sold-listings')}>Sold</a></Link>
          <Link href='/about' legacyBehavior><a className={linkClasses('/about')}>About</a></Link>
          <Link href='/contact' legacyBehavior><a className={linkClasses('/contact')}>Contact</a></Link>
        </nav>
        <nav
          ref={sidebarRef}
          className={`fixed inset-y-0 right-0 bg-white z-20 w-64 max-w-full transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className='p-4'>
            <div className='user-panel flex items-center mb-4'>
              {/* <div className='image-container mr-2'>
                <div className='initials-circle bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center'>
                  <span className='initials-text text-lg'>AB</span>
                </div>
              </div> */}

            </div>
            <ul className='sidebar-menu space-y-4'>
              <li className='header'>MAIN NAVIGATION</li>
              <li className='treeview'>
                <Link href='/' legacyBehavior>
                  <a className={`flex items-center ${linkClasses('/')}`} onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faHome} className='mr-2' />
                    Home
                  </a>
                </Link>
              </li>
              <li className='treeview'>
                <Link href='/available-listings' legacyBehavior>
                  <a className={`flex items-center ${linkClasses('/available-listings')}`} onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faBoxOpen} className='mr-2' />
                    Available Listings
                  </a>
                </Link>
              </li>
              <li className='treeview'>
                <Link href='/sold-listings' legacyBehavior>
                  <a className={`flex items-center ${linkClasses('/sold-listings')}`} onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' />
                    Sold Listings
                  </a>
                </Link>
              </li>
              <li className='treeview'>
                <Link href='/about' legacyBehavior>
                  <a className={`flex items-center ${linkClasses('/about')}`} onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faCircleInfo} className='mr-2' />
                    About
                  </a>
                </Link>
              </li>
              <li className='treeview'>
                <Link href='/contact' legacyBehavior>
                  <a className={`flex items-center ${linkClasses('/contact')}`} onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faVoicemail} className='mr-2' />
                    Contact
                  </a>
                </Link>
              </li>
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
