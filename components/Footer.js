// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faContactCard, faMailBulk, faMailForward, faMailReply, faPhone } from '@fortawesome/free-solid-svg-icons';
const Footer = () => {
  return (
    <footer className="p-4 w-full">
      <div className="container mx-auto flex flex-col items-center">
        <div className="text-white text-2xl font-bold mb-2">
          <Link href="/">
            <Image src="/images/flc-logo-horizontal-dark.png" alt="Logo" width={150} height={100} />
          </Link>
        </div>
        <div className="flex space-x-4">
          <p className="text-slate-500 font-secondary">
            <FontAwesomeIcon icon={faPhone} className="text-slate-500 px-2 text-xs" />
            
            <a className=" text-slate-500"href="tel:+7275016516">727 501-6516</a>
            
            <FontAwesomeIcon icon={faContactCard} className="text-slate-500 text-xs pl-4"  />
            
           <a className="text-slate-500 font-secondary uppercase" href="mailto:flcteamre@gmail.com"> Email </a></p>
          
          {/* <Link href="/" className="text-slate-500">
            Home
          </Link>
          <Link href="/available-listings" className="text-slate-500">
            About
          </Link>
          <Link href="/sold-listings" className="text-slate-500">
            Services
          </Link>
          <Link href="/contact" className="text-slate-500">
            Contact
          </Link> */}
        </div>
        <div className="text-slate-500 font-secondary uppercase mt-2">
          &copy; {new Date().getFullYear()} Florida Luxury Collection. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
