import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import SuccessMetrics from './SuccessMetrics';
import Partners from './Partners';
import Newsletter from './Newsletter';
import CTA from './CTA';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 -top-20 -left-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute w-96 h-96 -bottom-20 -right-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute w-80 h-80 top-1/2 left-1/2 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <SuccessMetrics />
      <Partners />
      <Newsletter />
      <CTA />
      <Footer />
    </div>
  );
};

export default HomePage;