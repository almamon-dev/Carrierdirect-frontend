import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, Mail, MapPin, Phone } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(-1);
    }, 1500);
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
          <div className="text-sm font-semibold text-gray-900">Support Center</div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Send us your Feedback</h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Your feedback helps us refine the Enterprise OS experience. Drop us a message, report a bug, or suggest a new feature.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Sticky Contact Info) */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 px-1">Contact Information</h3>
            <div className="space-y-4 px-1">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Email Us</p>
                  <p className="text-[13px] font-semibold text-gray-900">support@enterprise.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Call Us</p>
                  <p className="text-[13px] font-semibold text-gray-900">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Headquarters</p>
                  <p className="text-[13px] font-semibold text-gray-900 leading-tight mt-0.5">123 Tech Avenue, New York 10001</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-4">
                <h4 className="text-[13px] font-semibold text-blue-900 mb-1">Need instant help?</h4>
                <p className="text-[11px] text-blue-700 mb-3 leading-relaxed">Check our terms and policies.</p>
                <Button onClick={() => navigate('/support/terms')} variant="outline" className="w-full text-xs h-8 bg-white text-blue-700 border-blue-200 hover:bg-blue-50 shadow-sm">
                  View Terms
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Feedback Form */}
        <div className="flex-1 bg-white border border-gray-200 rounded-md p-4 lg:p-5 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Message Form</h2>
              <p className="text-[13px] text-gray-500">Please fill out the details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="First Name"
                type="text" 
                placeholder="John"
                required
              />
              <Input 
                label="Last Name"
                type="text" 
                placeholder="Doe"
                required
              />
            </div>

            <Input 
              label="Subject"
              type="text" 
              placeholder="e.g., Feature Request or Bug Report"
              required
            />

            <Textarea 
              label="Feedback Details"
              rows={4}
              required
              placeholder="Tell us what you think or what we can improve..."
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting} variant="primary" className="min-w-[140px]">
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Send Message
                    <Send className="w-3 h-3 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
