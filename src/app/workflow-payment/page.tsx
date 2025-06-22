"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, BrainCircuit, Mail, Star, ShieldCheck } from "lucide-react";
import { ParticleBackground } from '@/components/ui/particle-background';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#agent-carousel", label: "AI Agents" },
  { href: "/#why-lazify", label: "Why Us" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#ai-workflow", label: "AI Workflow" },
  { href: "/#contact", label: "Contact" },
];

const product = {
  id: 1,
  title: "Complete N8N Templates Bundle",
  description:
    "Get ALL premium N8N automation templates in one incredible package! Includes AI, Social Media, Communication, Email, Database, and much more.",
  price: 9,
  originalPrice: 599,
  icon: <span className="text-4xl text-indigo-500"><i className="fas fa-gem" /></span>,
  features: [
    "✨ AI Research & RAG Templates",
    "📱 Social Media Automation (Instagram, Twitter)",
    "💬 Communication Hub (Slack, Telegram, WhatsApp, Discord)",
    "📧 Email & Gmail Automation",
    "🗃️ Google Workspace Templates",
    "🗄️ Database & Storage Solutions",
    "📄 PDF & Document Processing",
    "🤖 OpenAI & LLM Integration",
    "👥 HR & Recruitment Suite",
    "📋 Forms & Survey Automation",
    "🌐 WordPress Integration",
    "📊 Airtable Automation",
    "📝 Notion Workspace Templates",
    "🎁 BONUS: Exclusive Templates",
    "🚀 Future Updates Included",
    "💎 Premium Support",
  ],
};

const reviews = [
  {
    text: "The N8N bundle from Lazify is a total game-changer. I automated my business in a weekend!",
    name: "Priya S. (Delhi)",
  },
  {
    text: "Superb value for money. The templates are plug-and-play and saved me weeks of work.",
    name: "Rahul M. (Mumbai)",
  },
  {
    text: "I love the support and the regular updates. Highly recommended for any automation enthusiast!",
    name: "Ayesha K. (Bangalore)",
  },
  {
    text: "Easy to use, well documented, and the price is unbeatable. 10/10!",
    name: "Vikram P. (Hyderabad)",
  },
  {
    text: "Helped me automate my agency's reporting and social media. Clients are happy, so am I!",
    name: "Sneha R. (Pune)",
  },
  {
    text: "I was skeptical at first, but this bundle is the real deal. Worth every rupee.",
    name: "Arjun T. (Chennai)",
  },
];

export default function WorkflowPaymentPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  // Razorpay handler
  const handleRazorpay = () => {
    setIsPaying(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const options = {
        key: "rzp_test_YourKeyHere", // TODO: Replace with your real Razorpay key
        amount: product.price * 100,
        currency: "INR",
        name: "Lazify Agency",
        description: product.title,
        image: "/images/ai_automation.png",
        handler: function (response: any) {
          setIsPaying(false);
          setPurchased(true);
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIdx((idx) => (idx + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
      {/* Particle background */}
      <ParticleBackground 
        particleCount={35} 
        particleSize={1.3} 
        particleSpeed={0.22} 
        particleOpacity={0.35}
      />
      
      {/* Animated BG */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-90 animate-gradient-move" />
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1200" cy="200" r="300" fill="#6366f1" fillOpacity="0.2" />
          <circle cx="200" cy="700" r="200" fill="#a78bfa" fillOpacity="0.15" />
        </svg>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-block"><BrainCircuit className="h-6 w-6 text-primary" /></span>
            <span className="gradient-text-animated">Lazify</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative transition-colors duration-300 text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border/50 px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-base py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 md:py-28 relative">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-400 text-white px-4 py-2 rounded-full font-semibold shadow mb-6 animate-fadeInUp">
            <Star className="w-5 h-5" /> Limited Time Mega Offer
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow animate-fadeInUp">Get the Complete N8N Templates Bundle</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fadeInUp delay-200">Unlock <span className="text-primary font-bold">ALL</span> Premium Automation Templates for Just <span className="text-green-400 font-bold">₹9</span> <span className="line-through text-gray-400 text-lg">₹599</span></p>
          <a href="#bundle" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all animate-fadeInUp delay-400">
            Browse Templates
          </a>
        </div>
        {/* Animated shapes */}
        <div className="absolute left-0 right-0 mx-auto w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30 top-0 animate-bounce-slow" />
      </section>

      {/* Product Section */}
      <section className="max-w-4xl mx-auto bg-card/95 backdrop-blur rounded-2xl shadow-2xl p-8 my-10 relative overflow-hidden" id="bundle">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-2 animate-fadeInUp">{product.title}</h3>
            <p className="text-muted-foreground mb-4 animate-fadeInUp delay-200">{product.description}</p>
            <div className="flex items-center gap-4 mb-4 animate-fadeInUp delay-300">
              <span className="text-4xl font-bold text-green-500">₹{product.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
            </div>
            <ul className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground text-base animate-fadeInUp delay-400">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-lg font-bold text-xl shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/60"
              onClick={handleRazorpay}
              disabled={isPaying}
            >
              🚀 Get Complete Bundle for ₹9
            </button>
            <div className="flex items-center gap-2 mt-6 text-green-600 font-semibold animate-fadeInUp delay-500">
              <ShieldCheck className="w-5 h-5" /> 100% Secure Payment & Instant Access
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Badge - Slideshow */}
      <section className="max-w-2xl mx-auto text-center mb-12 animate-fadeInUp delay-600">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold shadow mb-4">
          <Star className="w-5 h-5 text-yellow-300" /> Trusted by 1000+ Automation Enthusiasts
        </div>
        <div className="relative h-28 flex flex-col items-center justify-center">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className={`absolute left-0 right-0 transition-all duration-700 ease-in-out ${idx === reviewIdx ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0'}`}
            >
              <blockquote className="text-lg text-muted-foreground italic">“{review.text}”</blockquote>
              <div className="mt-2 text-sm text-muted-foreground font-semibold">— {review.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Notification */}
      {purchased && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold animate-fadeInUp">
          Purchase completed! Check your email for download links.
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-muted-foreground border-t border-border/50 bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="gradient-text-animated">Lazify</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://mail.google.com/mail/?view=cm&to=lazify.agency@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <Mail className="h-4 w-4" /> lazify.agency@gmail.com
              </Link>
            </div>
            <div className="text-sm">&copy; {new Date().getFullYear()} Lazify AI. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* FontAwesome CDN for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite alternate cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes bounce-slow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-18px); }
        }
        .animate-gradient-move {
          animation: gradient-move 12s ease-in-out infinite alternate;
        }
        @keyframes gradient-move {
          0% { filter: blur(0px); }
          100% { filter: blur(8px); }
        }
      `}</style>
    </div>
  );
}
