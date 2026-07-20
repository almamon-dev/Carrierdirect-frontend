import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Scale, FileText, FileLock2 } from 'lucide-react';
import Button from '@/components/ui/button';

export default function TermsPage() {
  const navigate = useNavigate();

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FileText },
    { id: 'security', title: 'User Accounts & Security', icon: Shield },
    { id: 'acceptable-use', title: 'Acceptable Use Policy', icon: Scale },
    { id: 'liability', title: 'Limitation of Liability', icon: FileLock2 },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center sticky top-0 z-20">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/modules')} 
            className="flex items-center gap-2 text-[14px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </button>
          <div className="text-sm font-semibold text-gray-900">Legal & Privacy Center</div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using the Enterprise OS application.
          </p>
          <div className="mt-6 inline-flex items-center text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            Last Updated: October 15, 2026
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Sidebar (Sticky) */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 px-1">Table of Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  <section.icon className="w-4 h-4 text-gray-400" />
                  {section.title}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-md p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Need help?</h4>
                <p className="text-xs text-blue-700 mb-3 leading-relaxed">If you have any questions about these terms.</p>
                <Button onClick={() => navigate('/support/feedback')} variant="outline" className="w-full text-xs h-8 bg-white text-blue-700 border-blue-200 hover:bg-blue-50 shadow-sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm prose prose-sm prose-gray max-w-none">
          <div className="space-y-8 text-gray-600">

            <section id="introduction" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to Enterprise OS. By accessing or using our application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our software. These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section id="security" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">2. User Accounts and Security</h2>
              <p className="leading-relaxed mb-2">
                You are responsible for maintaining the confidentiality of your account credentials, including your username and password. Enterprise OS will not be liable for any loss or damage arising from your failure to protect your login information.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must provide accurate, current, and complete information when registering for an account.</li>
                <li>You are entirely responsible for any and all activities that occur under your account.</li>
                <li>You must notify support immediately upon suspecting any unauthorized use of your account or any other breach of security.</li>
              </ul>
            </section>

            <section id="acceptable-use" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">3. Acceptable Use Policy</h2>
              <p className="leading-relaxed mb-2">
                Users of the Enterprise OS modules (including HR, CRM, Sales, and Accounting) must ensure that all data entered is accurate and lawful. Users are strictly prohibited from:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Using the platform for any illegal activities or to promote illegal activities.</li>
                <li>Attempting to bypass, disable, or compromise the security integrations of the platform.</li>
                <li>Uploading or distributing viruses, malware, or any other malicious code.</li>
                <li>Interfering with other users' access to the platform or server availability.</li>
              </ul>
            </section>

            <section id="liability" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">4. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall Enterprise OS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
              </p>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
}
