import React from 'react';

export default function CraftSLLogo({ 
  className = "" 
}: { 
  className?: string 
}) {
  return (
    <svg 
      viewBox="0 0 300 90" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- SYMBOL GROUP --- */}
      <g transform="translate(5, -2)">
        {/* Central Gold Petal (Solid Teardrop) */}
        <path 
          d="M 45 28 C 41.5 35.5 41 42.5 45 48 C 49 42.5 48.5 35.5 45 28 Z" 
          fill="#D4890A" 
        />

        {/* Central Maroon Petal Outline */}
        <path 
          d="M 45 19 C 39.5 29.5 38.5 42 45 50.5 C 51.5 42 50.5 29.5 45 19 Z" 
          stroke="#8B1A1A" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Left Inner Maroon Petal Outline */}
        <path 
          d="M 42 49 C 31 46 27.5 33.5 35 25.5 C 39.5 31.5 40 40 42 47.5" 
          stroke="#8B1A1A" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Right Inner Maroon Petal Outline */}
        <path 
          d="M 48 49 C 59 46 62.5 33.5 55 25.5 C 50.5 31.5 50 40 48 47.5" 
          stroke="#8B1A1A" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Left Outer Maroon Petal Outline */}
        <path 
          d="M 37.5 46.5 C 24 43.5 20.5 33 28 25 C 31.5 29.5 32 37 34.5 43.5" 
          stroke="#8B1A1A" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Right Outer Maroon Petal Outline */}
        <path 
          d="M 52.5 46.5 C 66 43.5 69.5 33 62 25 C 58.5 29.5 58 37 55.5 43.5" 
          stroke="#8B1A1A" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Left Gold Scroll (Traditional Sinhala Liya-wela flourish) */}
        <path 
          d="M 36.5 49 C 27 52.5 21.5 47 23 39.5 C 24.5 35 28.5 36.5 30.5 42 C 30.5 45.5 27 47.5 23 44" 
          stroke="#D4890A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Right Gold Scroll */}
        <path 
          d="M 53.5 49 C 63 52.5 68.5 47 67 39.5 C 65.5 35 61.5 36.5 59.5 42 C 59.5 45.5 63 47.5 67 44" 
          stroke="#D4890A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Left Maroon Bottom Scroll */}
        <path 
          d="M 32.5 52 C 24.5 55.5 20.5 50 22 43 C 23.5 39.5 27 41 28.5 45.5" 
          stroke="#8B1A1A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Right Maroon Bottom Scroll */}
        <path 
          d="M 57.5 52 C 65.5 55.5 69.5 50 68 43 C 66.5 39.5 63 41 61.5 45.5" 
          stroke="#8B1A1A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Woven Lattice Base (Traditional Knotted Pattern) */}
        <path 
          d="M 31 52 L 45 67.5 L 59 52" 
          stroke="#D4890A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        <path 
          d="M 35 52 L 45 62.5 L 55 52" 
          stroke="#8B1A1A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        <path 
          d="M 39.5 52 L 45 57.5 L 50.5 52" 
          stroke="#D4890A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        
        {/* Lattice Interlacing Crosses */}
        <path 
          d="M 34.5 56.5 L 45 74 L 55.5 56.5" 
          stroke="#D4890A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        <path 
          d="M 38 61 L 45 80.5 L 52 61" 
          stroke="#D4890A" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
      </g>

      {/* --- TEXT GROUP --- */}
      {/* Brand Name "CraftSL" */}
      <text 
        x="90" 
        y="47" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="bold" 
        fontSize="34"
        letterSpacing="-0.5px"
      >
        <tspan fill="#8B1A1A">Craft</tspan>
        <tspan fill="#D4890A">SL</tspan>
      </text>

      {/* Subtitle "Sri Lankan Artisan Marketplace" */}
      <text 
        x="90" 
        y="67" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="600" 
        fontSize="12.5"
        letterSpacing="0.2px"
        fill="#8B1A1A"
      >
        Sri Lankan Artisan Marketplace
      </text>
    </svg>
  );
}
