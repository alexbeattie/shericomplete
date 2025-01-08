import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faContactCard } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white p-8 text-gray-900">
      <div className="container mx-auto flex flex-col  justify-between items-center">
        <div className="flex flex-col md:flex-row items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
            <span className="text-slate-500 font-fourth hover:text-gray-700">727-501-6516</span>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faContactCard} className="text-gray-500" />
            <span className="text-slate-500 font-fourth hover:text-gray-700 uppercase">flcteamre@gmail.com</span>
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-4 md:mt-0">
          <div className="flex items-center">
            <Link href="/" legacyBehavior>
              <a className="flex items-center">
                <Image src="/images/flc-logo-horizontal-dark.png" alt="FLC Logo" width={200} height={100} />
              </a>
            </Link>
          </div>
          <div className="flex items-center">
            <Image src="/images/coastal-forbes-logo.jpg" alt="Coastal Properties and Forbes Global Properties Logos" width={200} height={75} />
          </div>
        </div>
      </div>
      <div className="text-center text-slate-500 font-fourth text-nowrap mt-4">
        &copy; {new Date().getFullYear()} Florida Luxury Collection. All rights reserved.
      </div>
      <div className="flex justify-center mt-4">
        <Image src="/images/realtor-eho-logo.jpg" alt="Realtor and Equal Housing Opportunity Logos" width={50} height={75} />
      </div>
    </footer>
  );
};

export default Footer;