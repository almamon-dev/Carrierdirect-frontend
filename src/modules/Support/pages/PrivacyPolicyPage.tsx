import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Scale, FileText, FileLock2 } from 'lucide-react';
import Button from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const sections = [
    { id: 'data-collection', title: 'Data Collection', icon: FileText },
    { id: 'data-usage', title: 'How We Use Your Data', icon: Shield },
    { id: 'data-sharing', title: 'Data Sharing & Disclosure', icon: Scale },
    { id: 'user-rights', title: 'Your Rights & Choices', icon: FileLock2 },
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Please read our privacy policy to understand how we collect, use, and protect your data.
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
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  <section.icon className="w-4 h-4 text-gray-400" />
                  {section.title}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-4">
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

            <section id="data-collection" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">1. Data Collection</h2>
              <p className="leading-relaxed">
                We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
              </p>
            </section>

            <section id="data-usage" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">2. How We Use Your Data</h2>
              <p className="leading-relaxed mb-2">
                We may use the information we collect about you to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide, maintain, and improve our Services.</li>
                <li>Perform internal operations, including troubleshooting, data analysis, testing, and research.</li>
                <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events.</li>
              </ul>
            </section>

            <section id="data-sharing" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">3. Data Sharing & Disclosure</h2>
              <p className="leading-relaxed mb-2">
                We do not sell your personal data. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
                <li>In response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.</li>
                <li>With law enforcement officials, government authorities, or other third parties if we believe your actions are inconsistent with our User agreements, Terms of Service, or policies, or to protect the rights, property, or safety of Enterprise OS or others.</li>
              </ul>
            </section>

            <section id="user-rights" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">4. Your Rights & Choices</h2>
              <p className="leading-relaxed">
                You have the right to request access to and receive information about the Personal Information we maintain about you, update and correct inaccuracies in your Personal Information, restrict or object to the processing of your Personal Information, have the information anonymized or deleted, as appropriate, or exercise your right to data portability to easily transfer your Personal Information to another company.
              </p>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
}
