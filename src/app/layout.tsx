import type { Metadata } from 'next';
// Import Geist Sans and Mono fonts directly from the 'geist' package
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Lazify | AI Agents That Work While You Rest', // Updated title
  description: 'Delegate your routine tasks to intelligent AI agents. Lazify provides AI-powered automation solutions for businesses and individuals.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth"> {/* Added scroll-smooth */}
      {/* Apply Geist Sans as the primary font and Geist Mono as the monospace font */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
