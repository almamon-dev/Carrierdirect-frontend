import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const PayLaterFacility = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="bg-[#0f0400] pt-28 pb-10 sm:pt-32 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">
            Pay Later Facility
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
          <h2>Introduction</h2>
          <p>
            Welcome to the GetItMoving Pay Later facility. We understand that managing cash flow is critical for your business. Our Pay Later program is designed to provide you with the flexibility to delay payments for shipping and logistics services, allowing you to focus on growth and operations.
          </p>

          <h2>How It Works</h2>
          <p>
            When you apply for the Pay Later facility, our administration team will review your account history, transaction volume, and overall business standing. Once approved, you will be granted a specific credit limit and a grace period for your payments.
          </p>
          <ul>
            <li><strong>Request Access:</strong> Navigate to your Client Dashboard Settings and click on "Request Pay Later".</li>
            <li><strong>Approval Process:</strong> Our team will review your request. This usually takes 1-3 business days.</li>
            <li><strong>Start Shipping:</strong> Once approved, you can start booking shipments without immediate payment up to your approved limit.</li>
            <li><strong>Settle Invoices:</strong> You must settle your outstanding balance within the agreed grace period (typically 30 days from the invoice date).</li>
          </ul>

          <h2>Terms and Conditions</h2>
          <p>By opting into the Pay Later facility, you agree to the following conditions:</p>
          <ul>
            <li>Failure to pay outstanding invoices by the due date may result in late fees.</li>
            <li>Your account may be temporarily suspended from booking new shipments if there are overdue invoices.</li>
            <li>GetItMoving reserves the right to increase, decrease, or revoke your Pay Later limit at any time based on payment history and risk assessment.</li>
            <li>This facility is subject to periodic reviews.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          <p><strong>Who is eligible?</strong><br/>
          Registered business clients with a verified account and a minimum history of 3 months on the platform are eligible to apply.</p>
          
          <p><strong>Are there any hidden fees?</strong><br/>
          No, as long as you pay within the grace period, there are no interest charges or hidden fees. Late payments, however, are subject to penalties.</p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions regarding the Pay Later facility, please reach out to our billing support team at billing@getitmoving.com.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PayLaterFacility;
