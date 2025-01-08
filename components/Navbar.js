// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const linkClasses = (path) => {
    return router.pathname === path
      ? 'text-slate-500 hover:text-blue-700 visited:text-slate-600'
      : 'text-slate-500 hover:text-blue-700 visited:text-slate-600';
  };

  return (
    <nav className="bg-white p-4 fixed top-0 left-0 w-full z-10 mt-16">
      <div className="container mx-auto flex justify-center">
        <div className="flex font-primary text-xs space-x-4">
          <Link href="/" className={linkClasses('/')}>
            Home
          </Link>
          <Link href="/available-listings" className={linkClasses('/available-listings')}>
            Available
          </Link>
          <Link href="/sold-listings" className={linkClasses('/sold-listings')}>
            Sold
          </Link>
          <Link href="/about" className={linkClasses('/about')}>
            About
          </Link>
          <Link href="/contact" className={linkClasses('/contact')}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;