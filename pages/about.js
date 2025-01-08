import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - FLC Luxury Collection</title>
        <meta name="description" content="Learn more about the FLC Luxury Collection team. Our experienced professionals are here to help you with all your real estate needs." />
        <meta name="keywords" content="real estate, FLC team, luxury collection, about us" />
        <meta property="og:title" content="About Us - FLC Luxury Collection" />
        <meta property="og:description" content="Learn more about the FLC Luxury Collection team. Our experienced professionals are here to help you with all your real estate needs." />
        <meta property="og:image" content="/images/flc-team.jpg" /> {/* Replace with an appropriate image */}
        <meta property="og:url" content="https://flcreteam.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us - FLC Luxury Collection" />
        <meta name="twitter:description" content="Learn more about the FLC Luxury Collection team. Our experienced professionals are here to help you with all your real estate needs." />
        <meta name="twitter:image" content="/images/flc-team.jpg" /> {/* Replace with an appropriate image */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100">

        <main>
          <section className="py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl mb-8 font-fourth text-slate-500 text-center">
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
                    <h3 className="text-xl font-fourth text-slate-500">Sheri Skora</h3>
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
                    <h3 className="text-xl font-fourth text-slate-500">Kristin Leon</h3>
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
                    <h3 className="text-xl font-fourth text-slate-500">Connie & Steve Redman</h3>
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
                    <h3 className="text-xl font-fourth text-slate-500">Kelli Mullen</h3>
                    <p className="text-slate-500"></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
