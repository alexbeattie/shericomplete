import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Contact Us - FLC Team</title>
        <meta name="description" content="Get in touch with the FLC Team. We are here to help you with all your real estate needs." />
        <meta name="keywords" content="contact, real estate, FLC Team" />
        <meta property="og:title" content="Contact Us - FLC Team" />
        <meta property="og:description" content="Get in touch with the FLC Team. We are here to help you with all your real estate needs." />
        <meta property="og:image" content="/images/main-hero-3753174181043418075.jpg" />
        <meta property="og:url" content="https://flcreteam.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us - FLC Team" />
        <meta name="twitter:description" content="Get in touch with the FLC Team. We are here to help you with all your real estate needs." />
        <meta name="twitter:image" content="/images/main-hero-3753174181043418075.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <Image
            src="/images/main-hero-3753174181043418075.jpg"
            alt="Beautiful Waterfront"
            layout="fill"
            objectFit="cover"
            className="object-center object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-start">
          <h1 className="text-2xl font-fourth font-bold mb-6 text-gray-800">Contact Us</h1>
          {success && <p className="text-slate-500 mb-4">Submission successful!</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-fourth text-slate-500">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 font-fourth border text-slate-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-fourth text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full font-fourth px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-fourth text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border text-slate-500 font-fourth border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full font-fourth bg-slate-600 text-white py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
