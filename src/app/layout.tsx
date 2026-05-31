import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CraftSL | Sri Lankan Artisan Marketplace",
  description: "Connecting Sri Lankan artisan craftspeople with buyers worldwide. Purchase authentic traditional masks, batik, clay ceramics, brassware, and handmade jewelry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#FAFAFA] text-[#1E1E1E] antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}

