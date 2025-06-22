import type { Metadata } from 'next';
// Removed GeistSans import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ScrollProgressBar } from '@/components/scroll-progress-bar';
import SmoothCursor from '@/components/ui/smooth-cursor';
import { ParticleBackground } from '@/components/ui/particle-background';

export const metadata: Metadata = {
  title: 'Lazify | AI Automation Agency',
  description: 'High-end AI automation solutions to boost your productivity. Lazify saves you time and effort.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased"> {/* Removed GeistSans.variable */}
        <div className="noise-overlay" aria-hidden="true" />
        <ParticleBackground 
          particleCount={30} 
          particleSize={1.5} 
          particleSpeed={0.2} 
          particleOpacity={0.3}
        />
        <SmoothCursor />
        <ScrollProgressBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
