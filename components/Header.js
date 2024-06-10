// components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  const linkClasses = (path) => {
    if (router.pathname === path) {
      return 'text-slate-800';
    } else {
      return 'text-slate-500 hover:text-blue-700';
    }
  };

  return (
    <header className="bg-white p-4 fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex flex-col items-center">
        <Link href="/">
          <Image src="/images/flc-logo-horizontal-dark.png" alt="Logo" width={250} height={100} />
        </Link>
        <nav className="mt-4">
          <div className="flex space-x-4 font-secondary text-base uppercase">
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
        </nav>
      </div>
    </header>
  );
};

export default Header;