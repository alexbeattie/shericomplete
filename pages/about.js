// pages/about.js
import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>About Us - FLC Team - Luxury Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl mb-8 font-secondary text-slate-500 text-center">
              About FLC Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="text-center">
                <div className="bg-white p-6 shadow-lg rounded-lg">
                  <Image
                    src="/images/sheri-skora.jpg"
                    alt="Sheri Skora"
                    width={400}
                    height={400}
                    objectFit="cover"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-primary text-slate-500">Sheri Skora</h3>
                  <p className="text-slate-500"></p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 shadow-lg rounded-lg">
                  <Image
                    src="/images/kristin-kuntz-leon.jpg"
                    alt="Kristin Leon"
                    width={400}
                    height={400}
                    objectFit="cover"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-primary text-slate-500">Kristin Leon</h3>
                  <p className="text-slate-500"></p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 shadow-lg rounded-lg">
                  <Image
                    src="/images/connie-joe-redman.jpg"
                    alt="Connie & Steve Redman"
                    width={400}
                    height={400}
                    objectFit="cover"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-primary text-slate-500">Connie & Steve Redman</h3>
                  <p className="text-slate-500"></p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 shadow-lg rounded-lg">
                  <Image
                    src="/images/kellie-mullen.jpg"
                    alt="Kelli Mullen"
                    width={400}
                    height={400}
                    objectFit="cover"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-primary text-slate-500">Kelli Mullen</h3>
                  <p className="text-slate-500"></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}