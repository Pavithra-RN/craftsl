'use client';

import React, { useState } from 'react';
import { Mail, Globe, MapPin, Send, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Contact <span className="text-[#8B1A1A]">CraftSL</span>
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          Questions about shipments, products, or artisan partnerships? Drop us a line and our Colombo support desk will respond shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Contact Form */}
        <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#8B1A1A]">Send a Message</h2>
            {success ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold">
                Thank you! Your message has been received. Our team will contact you within 24 hours.
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] bg-[#FAFAFA]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] bg-[#FAFAFA]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5A5A]">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write message details..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] bg-[#FAFAFA]"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow hover:bg-[#8B1A1A]/95 transition-all disabled:opacity-50 space-x-2"
              >
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Info & Map Placeholders */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6 flex-grow">
            <h2 className="text-2xl font-extrabold text-[#8B1A1A]">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-[#D4890A]" />
                <span className="font-semibold">support@craftsl.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Globe className="h-5 w-5 text-[#D4890A]" />
                <span className="font-semibold">Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-[#D4890A]" />
                <span className="font-semibold">Instagram: @CraftSL_Official</span>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col items-center justify-center h-64">
            <div className="absolute inset-0 bg-[#8B1A1A]/5 flex items-center justify-center pointer-events-none">
              {/* Simple stylized SVG of Sri Lanka */}
              <svg className="w-32 h-44 opacity-20 text-[#8B1A1A]" viewBox="0 0 100 150" fill="currentColor">
                <path d="M 50 10 C 65 30, 75 55, 75 80 C 75 105, 60 130, 45 140 C 35 130, 25 110, 25 80 C 25 50, 35 25, 50 10 Z" />
              </svg>
            </div>
            <div className="relative text-center space-y-2 z-10">
              <MapPin className="h-8 w-8 text-[#8B1A1A] mx-auto animate-bounce" />
              <h3 className="font-extrabold text-sm text-[#1E1E1E]">Headquarters</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
