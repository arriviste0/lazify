
import type { Metadata } from 'next';
// Removed GeistSans import
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
      <body className="bg-background text-foreground antialiased"> {/* Removed GeistSans.variable */}
        <SmoothCursor />
        <ScrollProgressBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
