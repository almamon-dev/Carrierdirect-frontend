import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

const ContactUs = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="bg-[#0f0400] pt-32 pb-20 sm:pt-40 sm:pb-24 md:pt-48 md:pb-28 lg:pt-56 lg:pb-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-1/3 h-full bg-[#ff4a1f]/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold text-center">
            Contact Us
          </h1>
          <p className="text-white/70 text-center mt-6 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-[#0f0400] mb-8">Get in Touch</h2>
            <p className="text-gray-600 text-lg mb-10">
              Our team is ready to assist you with any inquiries regarding our freight platform, 
              services, or partnership opportunities.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ff4a1f]/10 rounded-full flex items-center justify-center text-[#ff4a1f] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0f0400]">Phone</h3>
                  <p className="text-gray-600">+44 20 7946 0912</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ff4a1f]/10 rounded-full flex items-center justify-center text-[#ff4a1f] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0f0400]">Email</h3>
                  <p className="text-gray-600">support@getitmoving.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ff4a1f]/10 rounded-full flex items-center justify-center text-[#ff4a1f] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0f0400]">Office</h3>
                  <p className="text-gray-600">86-90 Paul Street, Suite 400<br />London EC2A 4NE, United Kingdom</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="first_name" className="font-medium text-gray-700">First Name</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    className="w-full h-12 px-4 rounded-sm border border-gray-300 focus:border-[#ff4a1f] outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="last_name" className="font-medium text-gray-700">Last Name</label>
                  <input 
                    type="text" 
                    id="last_name" 
                    className="w-full h-12 px-4 rounded-sm border border-gray-300 focus:border-[#ff4a1f] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full h-12 px-4 rounded-sm border border-gray-300 focus:border-[#ff4a1f] outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-medium text-gray-700">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full p-4 rounded-sm border border-gray-300 focus:border-[#ff4a1f] outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full h-12 bg-[#ff4a1f] text-white font-bold rounded-sm hover:bg-[#e63d15] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
