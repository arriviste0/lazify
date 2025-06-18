
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ScrollProgressBar } from '@/components/scroll-progress-bar';
import SmoothCursor from '@/components/ui/smooth-cursor';

export const metadata: Metadata = {
  title: 'Lazify | AI Automation Agency',
  description: 'High-end AI automation solutions to boost your productivity. Lazify saves you time and effort.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} bg-background text-foreground antialiased`}>
        <SmoothCursor />
        <ScrollProgressBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
