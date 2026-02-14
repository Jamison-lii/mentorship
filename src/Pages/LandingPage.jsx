import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-blue-900 py-20  px-6 overflow-hidden">
        {/* Decorative background pattern (Optional) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute transform rotate-45 bg-white w-96 h-96 -top-20 -left-20 rounded-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Own a piece of <span className="text-blue-400">Cameroon's</span> Future.
            </h1>
            <p className="mt-6 text-xl text-blue-100 leading-relaxed">
              Don't wait years to save 20 Million. Join 19 others today and co-invest in prime land in Bomaka, Akwa, or Kribi with as little as <span className="font-bold text-white underline">500,000 FCFA</span>.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg text-center shadow-lg hover:bg-gray-100 transition">
                Browse Properties
              </Link>
              <Link to="/how-it-works" className="border-2 border-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-blue-800 transition">
                How it Works
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1591389052853-40166a394555?auto=format&fit=crop&q=80&w=800" 
                alt="Modern Building in Douala" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST STATS --- */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-blue-900">100%</p>
            <p className="text-sm text-gray-500 font-bold uppercase">Escrow Secured</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-900">500+</p>
            <p className="text-sm text-gray-500 font-bold uppercase">Investors</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-900">2B FCFA</p>
            <p className="text-sm text-gray-500 font-bold uppercase">Capital Raised</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-900">0%</p>
            <p className="text-sm text-gray-500 font-bold uppercase">Management Fees</p>
          </div>
        </div>
      </section>

      {/* --- WHY FRACTIONAL REALTY? --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Real Estate is no longer for just the "Big Men".</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">We are democratizing land ownership in Cameroon by breaking down large barriers into small, affordable fractions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-3">Collective Power</h3>
            <p className="text-gray-600">Combine your 1 Million FCFA with others to buy properties worth 100 Million FCFA in high-growth areas.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-3">Transparency</h3>
            <p className="text-gray-600">Track every franc raised on our dashboard. Funds are held in separate bank accounts for your safety.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-3">Exit Easily</h3>
            <p className="text-gray-600">Once the project is complete or the land is sold, your capital and profit are distributed automatically.</p>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-gray-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white">Ready to start your land portfolio?</h2>
          <p className="text-gray-400 mt-6 text-lg">Join Junior and hundreds of other young professionals building real wealth together.</p>
          <div className="mt-10">
            <Link to="/" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 shadow-2xl transition inline-block">
              View Current Listings
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p>© 2026 Fractional Realty Cameroon. All rights reserved. A Junior Professional Initiative.</p>
      </footer>
    </div>
  );
};

export default LandingPage;