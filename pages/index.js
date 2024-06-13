// !--pages / index.js-- >

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
export default function Home () {
  return (
    <div className='min-h-screen'>
      <Head>
        <title>Luxury Properties</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <section className='py-20'>
          <div className='container mx-auto px-6'>
            <h2 className='text-4xl mb-2 font-secondary text-center text-slate-500'>
              Tampa Bay & St. Petersburg Beach
            </h2>
            <h3 className='text-2xl text-center mb-8 text-gray-600'>
              Welcome to Florida
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              <div>
                <Image
                  src='/images/property2.jpg'
                  alt='Property 1'
                  width={500}
                  height={300}
                  className='rounded-lg shadow-lg'
                />
              </div>
              <div>
                <Image
                  src='/images/property3.jpg'
                  alt='Property 2'
                  width={500}
                  height={300}
                  className='rounded-lg shadow-lg'
                />
              </div>
              <div>
                <Image
                  src='/images/property1.jpg'
                  alt='Property 3'
                  width={500}
                  height={300}
                  className='rounded-lg shadow-lg'
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
