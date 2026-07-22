import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const PrivacyPolicy = () => {
  const [loading] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="bg-[#0f0400] pt-28 pb-10 sm:pt-32 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-none text-gray-700 
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#0f0400] [&_h1]:mb-3
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0f0400] [&_h2]:mb-2 [&_h2]:mt-6 
            [&_p]:mb-2 [&_p]:text-gray-700 [&_p]:leading-normal [&_p]:text-base
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:text-base
            [&_li]:mb-0
            [&_a]:text-[#ff4a1f] hover:[&_a]:underline"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div>
              <h2>1. Information We Collect</h2>
              <p>We collect personal information you provide when registering, submitting quotes, or booking transport services on Get It Moving. This includes name, email, phone, pickup/delivery addresses, and company details.</p>
              <h2>2. How We Use Information</h2>
              <p>Your data is strictly used to match shipping requests with verified transport suppliers, process escrow payments, send real-time tracking updates, and maintain platform compliance.</p>
              <h2>3. Data Protection</h2>
              <p>All data is encrypted in transit and at rest adhering to UK GDPR and industry security standards.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
