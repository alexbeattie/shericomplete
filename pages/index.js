import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons'

export default function Home({ listings }) {
  const convertToTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const renderListing = (listing) => {
    const mediaUrls = listing.Media ? listing.Media.split(',').map((url) => url.trim()) : [];
    return (
      <Link href={`/listings/${listing.ListingKey}?endpoint=active`} passHref key={listing.ListingKey}>
        <div className='relative bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300' data-tn='uc-listingPhotoCard'>
          <Image
            src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
            alt={listing.ListingKey}
            width={640}
            height={480}
            className='w-full h-60 object-cover'
            priority={true}
          />
          <div className='font-secondary  absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <span className='text-white font-secondary absolute top-0 left-0 text-lg bg-black py-1 px-2 rounded'>New Listing</span>
          </div>
          <div className='absolute bottom-0 left-0 p-4 text-white font-secondary w-full'>
            <div className='flex justify-between font-secondary'>
              <div>
                <span className='text-lg font-semibold block'>${listing.ListPrice.toLocaleString()}</span>
                <span className='block'>{convertToTitleCase(listing.UnparsedAddress)}</span>
                <span className='block'>{convertToTitleCase(listing.City)}, {convertToTitleCase(listing.StateOrProvince)} {listing.PostalCode}</span>
              </div>
              <div className='text-right'>
                <div><span className='font-semibold'>{listing.BedroomsTotal}</span> Beds</div>
                <div><span className='font-semibold'>{listing.BathroomsFull}</span> Baths</div>
                <div><span className='font-semibold'>{listing.LivingArea.toLocaleString()}</span> Sq. Ft.</div>
              </div>
            </div>
          </div>
          {/* Smooth animating hover effect */}
          <div className='absolute inset-0 bg-white bg-opacity-0 transition duration-500 ease-in-out hover:bg-opacity-30'></div>
        </div>
      </Link>
    );
  };

  return (
    <div>


      <main>
        <section
          className='py-8 px-4 bg-gray-100'
          data-tn='homepage-listingSection'
        >
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-6'>
              <h1
                className='text-3xl text-slate-500 font-bold font-secondary'
              >
                FLC Team Exclusive Estates
              </h1>
              <p
                className='text-lg text-slate-500 mt-2 font-secondary'
              >
                Be the first to browse exclusive listings before they hit the
                market.
              </p>
            </div>
            <div className='font-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>


              {listings.map(renderListing)}

            </div>
            <div className='text-center mt-8'>
              <Link href='/available-listings'>
                <p className='text-slate-500 font-secondary font-semibold hover:underline'>
                  View All FLC Team Exclusives
                </p>

              </Link>
            </div>
          </div>
        </section>

        <div className='hero-container flex flex-col lg:flex-row bg-gray-100 p-8 mt-12'>
          <div className='hero-content flex-1 flex flex-col justify-center'>
            <div className='hero-content-container max-w-lg mx-auto text-left lg:text-left'>
              <div className='hero-logo mb-4'>
                <h1 className='font-secondary hero-heading text-3xl text-slate-500 font-bold mb-4'>
                  List Your Home With Us
                </h1>
                <h2 className='text-2xl font-secondary text-slate-500 font-semibold' data-tn='hero-headline'>
                  Exclusive Marketing Presentation&apos;
                </h2>
              </div>
              <p className='hero-body text-gray-700 mt-4 font-secondary'>
                Listing your home with our team means entrusting your most
                valuable asset to seasoned professionals with years of
                experience in the real estate market. Our extensive knowledge
                ensures that your home is priced correctly and marketed
                effectively to attract the right buyers. Leveraging cutting-edge
                technology, we provide unparalleled visibility and insights into
                market trends, allowing us to strategize and adapt swiftly to
                maximize your home&apos;s appeal. Moreover, our exclusive
                partnerships with leading industry experts and service providers
                give you access to a network of resources that can enhance every
                aspect of your listing, from staging and photography to legal
                and financial advice. Choose us for a seamless, successful home
                selling experience that takes full advantage of our expertise,
                technology, and connections.{' '}
              </p>

              <Link href='/contact' legacyBehavior>
                <a
                  id='contactAgentButton'
                  className='mt-6 inline-block bg-slate-600 text-white font-bold py-2 px-4 rounded hover:bg-slate-800 transition'
                  data-tn='hero-findAgentBtn'
                >
                  Work With Us
                </a>
              </Link>
            </div>
          </div>
          <div className='hero-image flex-1 flex justify-center items-center mt-8 lg:mt-0'>
            <Image
              src='/images/new-team-photo.jpg'
              alt='Hero Image'
              role='presentation'
              width={600}
              height={400}
              className='rounded-lg'
              data-tn='hero-img'
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/listings');
  const data = await res.json();

  return {
    props: {
      listings: data.Items,
    },
  };
}
