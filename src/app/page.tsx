'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap, // Icon for speed/automation
  Bot, // Icon for agent
  Cpu, // Icon for AI/processing
  FileText,
  Cog,
  ArrowRight,
  BrainCircuit,
  BarChart,
  Mail,
  Clock,
  CheckCircle,
  DollarSign,
  Linkedin,
  Twitter,
  Youtube,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { PricingTable } from '@/components/pricing-table'; // Assuming this component exists
import { ContactForm } from '@/components/contact-form'; // Assuming this component exists
import HeroBackground from '@/components/hero-background'; // Assuming this component exists for the 3D background

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = {
    home: useRef(null),
    services: useRef(null),
    agents: useRef(null),
    pricing: useRef(null), // Added pricing ref
    demo: useRef(null),
    contact: useRef(null),
  };

  // --- Framer Motion Scroll Animations ---
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 0.5, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  // Intersection observer to detect active section
  useEffect(() => {
    const observers = [];
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.4, // 40% visibility
    };

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        });
      }, observerOptions);

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []); // Re-run if refs change (shouldn't happen often)

  const navLinks = [
    { href: '#home', label: 'Home', ref: sectionRefs.home },
    { href: '#services', label: 'Services', ref: sectionRefs.services },
    { href: '#agents', label: 'Agents', ref: sectionRefs.agents },
    { href: '#pricing', label: 'Pricing', ref: sectionRefs.pricing },
    { href: '#demo', label: 'Demo', ref: sectionRefs.demo },
    { href: '#contact', label: 'Contact', ref: sectionRefs.contact },
  ];

  const services = [
    {
      title: 'Automation AI',
      description: 'Streamline workflows, manage tasks, and boost efficiency with intelligent automation.',
      icon: Zap, // Changed icon
    },
    {
      title: 'AI Content Generation',
      description: 'Generate high-quality content for marketing, blogs, and communications effortlessly.',
      icon: FileText,
    },
    {
      title: 'Custom AI Agents',
      description: 'Bespoke AI solutions tailored precisely to your unique business needs and goals.',
      icon: Cog,
    },
  ];

  const agents = [
    { name: 'SchedulerPro', description: 'Manages complex scheduling and appointments.', icon: Clock },
    { name: 'ContentCraft', description: 'Writes blog posts and social media updates.', icon: FileText },
    { name: 'SupportSphere', description: 'Handles customer inquiries 24/7.', icon: Bot },
    { name: 'DataSight', description: 'Analyzes data and generates reports.', icon: BarChart },
    { name: 'ConnectFlow', description: 'Automates email outreach and follow-ups.', icon: Mail },
  ];

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

   const sectionTitleVariants = {
     hidden: { opacity: 0, y: 30 },
     visible: {
       opacity: 1,
       y: 0,
       transition: {
         duration: 0.6,
         ease: "easeOut",
       },
     },
   };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container container-padding h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 text-xl font-black">
            {/* Simple text logo for elegance */}
            <span className="text-primary">L</span>
            <span>azify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative transition-colors duration-300 ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                {link.label}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="navIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="hidden md:inline-flex cta-button" // Use CTA style
                size="sm" // Adjust size if needed, cta-button class handles main sizing
                asChild
              >
                <Link href="#demo">Get Started</Link>
              </Button>
            </motion.div>

            {/* Mobile Navigation Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                       <motion.div key="close" initial={{ rotate: 0, scale: 0.8 }} animate={{ rotate: 90, scale: 1 }} exit={{ rotate: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
                         <X className="h-6 w-6" />
                       </motion.div>
                    ) : (
                       <motion.div key="menu" initial={{ rotate: -90, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0.8 }} transition={{ duration: 0.2 }}>
                         <Menu className="h-6 w-6" />
                       </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background p-6">
                 <Link href="#home" className="flex items-center gap-2 text-xl font-black mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                   <span className="text-primary">L</span>
                   <span>azify</span>
                 </Link>
                <nav className="flex flex-col gap-6 text-lg font-medium">
                  {navLinks.map((link) => (
                    <motion.div key={link.label} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                      <Link
                        href={link.href}
                        className={`flex items-center text-muted-foreground hover:text-primary transition-colors ${activeSection === link.href.substring(1) ? "text-primary font-semibold" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ChevronRight className={`mr-2 h-4 w-4 transition-opacity ${activeSection === link.href.substring(1) ? "opacity-100" : "opacity-0"}`} />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                    <Button className="w-full cta-button" size="lg" asChild>
                      <Link href="#demo" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          id="home"
          ref={sectionRefs.home}
          className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Fullscreen 3D Background */}
          <HeroBackground />

          <div className="container container-padding relative z-10">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-foreground">
                Automate. Elevate. <span className="text-primary">Lazify.</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10">
                Unlock peak productivity with bespoke AI agents tailored for your business.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="cta-button" size="lg" asChild>
                  <Link href="#demo">
                    Get Your AI Agent Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section */}
        <section id="services" ref={sectionRefs.services} className="section-padding bg-secondary/20">
          <div className="container container-padding">
            <motion.div
               className="text-center mb-16"
               variants={sectionTitleVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.3 }}
             >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">Our Services</span>
              <h2 className="text-4xl md:text-5xl font-bold">Intelligent Solutions, Simplified</h2>
              <p className="max-w-2xl mx-auto mt-4">We craft AI agents that integrate seamlessly into your workflow.</p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="modern-card h-full text-center hover:-translate-y-2">
                     <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                        <service.icon className="h-8 w-8" />
                      </div>
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-xl md:text-2xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription>{service.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Agent Examples Section */}
        <section id="agents" ref={sectionRefs.agents} className="section-padding">
          <div className="container container-padding">
            <motion.div
               className="text-center mb-16"
               variants={sectionTitleVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.3 }}
             >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">Meet the Agents</span>
              <h2 className="text-4xl md:text-5xl font-bold">Your Dedicated AI Workforce</h2>
              <p className="max-w-2xl mx-auto mt-4">Explore how our specialized agents can transform specific tasks.</p>
            </motion.div>
             {/* Simple Grid Layout for Agent Examples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {agents.map((agent, index) => (
                 <motion.div
                   key={agent.name}
                   custom={index}
                   variants={cardVariants}
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: true, amount: 0.3 }}
                 >
                   <Card className="modern-card h-full flex items-start gap-4 hover:shadow-accent/10">
                      <div className="mt-1 flex-shrink-0 rounded-md bg-accent/10 p-3 text-accent">
                        <agent.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{agent.name}</CardTitle>
                        <CardDescription className="text-sm">{agent.description}</CardDescription>
                      </div>
                   </Card>
                 </motion.div>
               ))}
            </div>
             {/* Add a subtle link to see more */}
             <div className="text-center mt-12">
               <Button variant="link" className="text-primary hover:text-primary/80" asChild>
                 <Link href="#contact">
                   Request a Custom Agent <ArrowRight className="ml-1 h-4 w-4" />
                 </Link>
               </Button>
             </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" ref={sectionRefs.pricing} className="section-padding bg-secondary/20">
          <div className="container container-padding">
            <motion.div
               className="text-center mb-16"
               variants={sectionTitleVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.3 }}
             >
               <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">Pricing Plans</span>
               <h2 className="text-4xl md:text-5xl font-bold">Flexible Options for Every Need</h2>
              <p className="max-w-2xl mx-auto mt-4">Choose the plan that best suits your automation goals.</p>
            </motion.div>
            <PricingTable /> {/* Integrate the PricingTable component */}
          </div>
        </section>

        {/* Free Demo CTA Section */}
        <section id="demo" ref={sectionRefs.demo} className="section-padding">
          <div className="container container-padding">
            <motion.div
               className="bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-xl p-8 md:p-12 lg:p-16 text-center"
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, amount: 0.5 }}
               transition={{ duration: 0.6 }}
             >
               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Try Lazify Free for 1 Day</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience the power of AI automation firsthand. No commitment required.
              </p>
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                 <Button className="cta-button" size="lg" asChild>
                   <Link href="#contact"> {/* Link to contact form for demo request */}
                     Request Your Free Demo <CheckCircle className="ml-2 h-5 w-5" />
                   </Link>
                 </Button>
               </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={sectionRefs.contact} className="section-padding border-t border-border">
          <div className="container container-padding">
            <motion.div
               className="text-center mb-16"
               variants={sectionTitleVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.3 }}
             >
               <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">Get In Touch</span>
               <h2 className="text-4xl md:text-5xl font-bold">Ready to Automate?</h2>
              <p className="max-w-2xl mx-auto mt-4">Contact us to discuss your project or request a personalized demo.</p>
            </motion.div>
            <div className="max-w-xl mx-auto">
              <ContactForm /> {/* Integrate the ContactForm component */}
               <div className="text-center mt-8 text-muted-foreground">
                 Or email us directly at <Link href="mailto:contact@lazify.ai" className="text-primary hover:underline">contact@lazify.ai</Link>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container container-padding flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 text-lg font-black">
             <span className="text-primary">L</span>
             <span>azify</span>
             <span className="text-sm text-muted-foreground ml-2">&copy; {new Date().getFullYear()}</span>
           </div>
          <nav className="flex gap-6">
             <Link href="#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link>
             <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          </nav>
          <div className="flex gap-4">
            {[
              { label: "LinkedIn", icon: Linkedin, href: "#" },
              { label: "Twitter", icon: Twitter, href: "#" },
              { label: "YouTube", icon: Youtube, href: "#" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
