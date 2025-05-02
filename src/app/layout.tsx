import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider'; // Assuming ThemeProvider exists

export const metadata: Metadata = {
  title: 'Lazify | AI Automation Agency', // Updated title
  description: 'High-end AI automation solutions to boost your productivity. Lazify saves you time and effort.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Use dark theme by default
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {/* Wrap children with ThemeProvider if it exists for potential theme toggling */}
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
          {children}
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
