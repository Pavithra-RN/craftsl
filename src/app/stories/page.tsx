'use client';

import React from 'react';

import { Sparkles, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function StoriesPage() {
  const stories = [
    {
      id: 1,
      title: 'Preserving Batik Craft in Galle Fort',
      excerpt: 'How one family workshop keeps the delicate wax-resist fabric dyeing techniques of the Southern coast alive amidst changing tourism tides.',
      category: 'Batik & Heritage',
      date: 'May 12, 2026',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'The Clay Custodians of Kegalle Pottery',
      excerpt: 'Inside the cooperative kiln fires keeping Sri Lankan clay pottery and traditional cooking vessel designs in constant production.',
      category: 'Pottery & Ceramics',
      date: 'May 04, 2026',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'The Mask Carvers of Ambalangoda',
      excerpt: 'Exploring the mythical folklore and intricate woodwork behind Sri Lankan traditional devil-warding masks and devil dancing heritage.',
      category: 'Woodwork & Folklore',
      date: 'April 28, 2026',
      readTime: '8 min read'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Voices of the Workshops</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Artisan <span className="text-[#8B1A1A]">Stories</span>
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          Journey into the heart of Sri Lankan villages and explore the heritage, struggle, and triumph behind each handmade creation.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group"
          >
            {/* Header placeholder */}
            <div className="h-48 w-full bg-gradient-to-br from-[#8B1A1A]/5 to-[#D4890A]/5 flex items-center justify-center p-6 border-b border-gray-50">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-[#8B1A1A]/30">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>

            {/* Info */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>{story.category}</span>
                  <span className="flex items-center gap-1 font-bold">
                    <Clock className="h-3 w-3" />
                    {story.readTime}
                  </span>
                </div>
                <h3 className="font-extrabold text-xl text-[#1E1E1E] group-hover:text-[#8B1A1A] transition-colors leading-snug">
                  {story.title}
                </h3>
                <p className="text-xs text-[#5A5A5A] leading-relaxed line-clamp-3">
                  {story.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400">{story.date}</span>
                <span className="text-xs font-bold text-[#8B1A1A] group-hover:text-[#D4890A] transition-colors flex items-center gap-0.5 cursor-pointer">
                  Read Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
