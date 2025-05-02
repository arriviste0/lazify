
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Cog,
  ArrowRight,
  BrainCircuit,
  BarChart,
  Mail,
  Clock,
  CheckCircle,
  Linkedin,
  Twitter,
  Youtube,
  Menu,
  X,
  ChevronRight,
  Send, // Added Send icon
} from 'lucide-react';
import dynamic from 'next/dynamic'; // Import dynamic
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AgentSection from '@/components/agent-section';
// Removed HeroScene import
import ServiceCard from '@/components/service-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { PricingTable } from '@/components/pricing-table'; // Import PricingTable
import { ContactForm } from '@/components/contact-form'; // Import ContactForm
import HeroBackground from '@/components/hero-background'; // Import the placeholder background

// Reusable animation variant for fadeInUp effect
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
};

// Reusable stagger container variant
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Dynamically import the Chart iframe rendering part
const ChartDisplay = dynamic(() => Promise.resolve(({ isMobile }: { isMobile: boolean }) => {
  if (!isMobile) {
    return (
      <iframe
        src="/chart-scene"
        className="w-full h-full border-0 rounded-lg shadow-xl bg-transparent"
        title="3D Chart Visualization"
        loading="lazy"
      />
    );
  } else {
    return (
      <Image
        src="https://picsum.photos/400/400" // Replace with actual placeholder
        alt="Productivity chart visualization"
        width={400}
        height={400}
        className="w-full h-full object-contain rounded-lg"
        data-ai-hint="abstract 3d chart purple"
      />
    );
  }
}), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><p>Loading chart...</p></div> });


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const isMobile = useIsMobile();
  const sectionRefs = {
    home: useRef(null),
    services: useRef(null),
    agents: useRef(null),
    whyLazify: useRef(null),
    pricing: useRef(null), // Added ref for Pricing
    faq: useRef(null),
    demo: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on the client
  }, []);


  // --- Framer Motion Scroll Animations ---
  const { scrollY, scrollYProgress } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, -100]); // Parallax for hero background elements
  const whyLazifyParallaxY = useTransform(scrollYProgress, [0.45, 0.65], ['-50px', '50px']); // Adjusted parallax range

  // Intersection observer remains the same
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Adjust margin to trigger slightly earlier/later
      threshold: 0.2, // Lowered threshold slightly
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
    return () => observers.forEach((observer) => observer.disconnect());
  }, []); // Empty dependency array is correct here

  const navLinks = [
    { href: '#home', label: 'Home', ref: sectionRefs.home },
    { href: '#services', label: 'Services', ref: sectionRefs.services },
    { href: '#agents', label: 'Agents', ref: sectionRefs.agents },
    { href: '#why-lazify', label: 'Why Us', ref: sectionRefs.whyLazify },
    { href: '#pricing', label: 'Pricing', ref: sectionRefs.pricing }, // Added Pricing link
    { href: '#faq', label: 'FAQ', ref: sectionRefs.faq },
    { href: '#demo', label: 'Demo', ref: sectionRefs.demo },
    { href: '#contact', label: 'Contact', ref: sectionRefs.contact },
  ];

  const services = [
    {
      title: 'Automation AI',
      description: 'Schedule meetings, manage your inbox, and create insightful reports automatically.',
      icon: Clock,
      imageHint: 'robot arm organizing calendar icons',
      color: 'from-purple-600 to-indigo-600', // Updated color
    },
    {
      title: 'AI Content Generation',
      description: 'Generate high-quality blog posts, social media captions, and email newsletters effortlessly.',
      icon: FileText,
      imageHint: 'glowing pen writing on digital paper',
      color: 'from-fuchsia-600 to-pink-600', // Updated color
    },
    {
      title: 'Custom AI Agents',
      description: 'Specialized AI assistants designed for healthcare, e-commerce, finance, and more.',
      icon: Cog,
      imageHint: 'blueprint with glowing circuit lines',
      color: 'from-violet-600 to-purple-600', // Updated color
    },
  ];

  const agents = [
     {
      name: "InboxBot",
      description: "Filters emails, drafts replies, and manages your schedule.",
      hint: "robot sorting mail envelopes 3d isometric purple",
      color: "from-purple-600 to-indigo-600",
    },
    {
      name: "BlogGenie",
      description: "Researches topics and writes engaging blog articles.",
      hint: "magic lamp emitting blog post icons 3d isometric purple",
      color: "from-fuchsia-600 to-pink-600",
    },
    {
      name: "ShopHelper",
      description: "Analyzes sales data and optimizes product listings.",
      hint: "robot analyzing shopping cart data 3d isometric purple",
      color: "from-violet-600 to-purple-600",
    },
    {
      name: "ReportWizard",
      description: "Compiles data from various sources into clear reports.",
      hint: "wizard hat creating charts graphs 3d isometric purple",
      color: "from-indigo-500 to-blue-500",
    },
    {
      name: "SocialSpark",
      description: "Creates and schedules engaging social media posts.",
      hint: "megaphone generating social media icons 3d isometric purple",
      color: "from-rose-500 to-red-500",
    },
  ];

  const metrics = [
    { value: '10+', label: 'Hours Saved/Week', icon: Clock },
    { value: '90%', label: 'Task Accuracy', icon: CheckCircle },
    { value: '40%', label: 'Productivity Boost', icon: BarChart },
  ];

  const faqs = [
    {
      q: 'How secure is Lazify?',
      a: 'We use industry-standard encryption and security protocols to protect your data. Your privacy and security are our top priorities.',
    },
    {
      q: 'Do I need technical knowledge to use Lazify?',
      a: 'Not at all! Our platform is designed to be user-friendly. We provide easy setup guides and support to get you started quickly.',
    },
    {
      q: 'Can Lazify integrate with my existing tools?',
      a: 'Yes, Lazify is built to integrate seamlessly with many popular business tools like Google Workspace, Slack, CRMs, and more.',
    },
    {
      q: 'What kind of tasks can be automated?',
      a: 'A wide range! From email management, scheduling, data entry, report generation, content creation, customer support tasks, and much more.',
    },
     {
      q: 'What is the pricing model?',
      a: 'We offer flexible pricing plans based on usage and features. Check out our pricing section for details. We also offer custom enterprise solutions.',
    },
  ];

   // Headline animation variants
  const headlineWord = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation Bar */}
       <motion.header
         className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50"
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         transition={{ duration: 0.5, ease: 'easeOut' }}
       >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 text-xl font-bold">
            <motion.div
              whileHover={{ rotate: [0, 15, -10, 15, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <BrainCircuit className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="gradient-text-animated"> {/* Apply animated gradient */}
              Lazify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative transition-colors duration-300 ${activeSection === link.href.substring(1) ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                {link.label}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="navIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             {/* Use cta-button style */}
            <Button
              className="hidden md:inline-flex cta-button"
              size="sm"
              asChild
            >
              <Link href="#demo">Try Our App</Link>
            </Button>

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
              <SheetContent side="right" className="w-[280px] bg-background p-4">
                 <Link href="#home" className="flex items-center gap-2 text-xl font-bold mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <span className="gradient-text-animated">Lazify</span>
                 </Link>
                <nav className="flex flex-col gap-6 text-lg font-medium mt-8">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.label}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center text-muted-foreground hover:text-primary transition-colors ${activeSection === link.href.substring(1) ? 'text-primary font-semibold' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ChevronRight
                          className={`mr-2 h-4 w-4 transition-opacity ${activeSection === link.href.substring(1) ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <Button className="mt-6 w-full cta-button" size="lg" asChild>
                      <Link href="#demo" onClick={() => setIsMobileMenuOpen(false)}>
                        Try Our App
                      </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          id="home"
          ref={sectionRefs.home}
          className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden" // Full viewport height minus header
          style={{ y: heroParallaxY }} // Apply parallax
        >
          {/* Placeholder Background - Replace HeroScene */}
          <HeroBackground />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                 {/* Animate words */}
                {"AI Agents That Work While You Rest".split(" ").map((word, i) => (
                  <motion.span key={i} variants={headlineWord} className="inline-block mr-2 md:mr-4">
                    {word}
                  </motion.span>
                ))}
                 <span className="gradient-text-animated">Lazify.</span>
              </motion.h1>
              <motion.p
                className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-muted-foreground"
                variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.5, ...fadeInUp.transition }}
              >
                Delegate routine tasks to intelligent AI agents and reclaim your focus for what truly matters. Boost productivity, effortlessly.
              </motion.p>
              <motion.div
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.7, ...fadeInUp.transition }}
              >
                <Button size="lg" className="cta-button" asChild>
                    <Link href="#demo"> {/* Changed link to demo section */}
                      Get Your AI Agent Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                 <Button size="lg" variant="outline" className="outline-button-glow" asChild>
                    <Link href="#services">Explore Services</Link>
                  </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          id="services"
          ref={sectionRefs.services}
          className="w-full section-padding bg-secondary/20" // Use darker secondary
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container px-4 md:px-6">
            <motion.div className="text-center mb-12 md:mb-16" variants={fadeInUp}>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-2">
                Our Services
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Automate Your World with AI
              </h2>
              <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">
                Lazify offers a suite of intelligent services designed to handle your repetitive tasks and boost creative output.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-6 md:gap-8 lg:grid-cols-3"
              variants={staggerContainer}
            >
              {services.map((service, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    imageHint={service.imageHint}
                    gradientColors={service.color}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Agents Gallery Section */}
        <motion.section
          id="agents"
          ref={sectionRefs.agents}
          className="w-full section-padding overflow-hidden"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp}
        >
          <div className="container px-4 md:px-6">
            <motion.div className="text-center mb-12 md:mb-16" variants={fadeInUp}>
               <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent mb-2">
                Meet Your Agents
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Your Dedicated AI Workforce
              </h2>
              <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">
                Explore some of our specialized AI agents ready to take on specific tasks.
              </p>
            </motion.div>
            <AgentSection agents={agents} /> {/* AgentSection already has internal animations */}
          </div>
        </motion.section>

        {/* Why Lazify Section */}
        <motion.section
          id="why-lazify"
          ref={sectionRefs.whyLazify}
          className="w-full section-padding bg-gradient-to-b from-secondary/20 to-background"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div variants={fadeInUp}>
                 <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-2">
                  The Lazify Advantage
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Unlock Unprecedented Efficiency
                </h2>
                <p className="text-muted-foreground mb-8">
                  Lazify isn't just automation; it's intelligent delegation. Experience tangible benefits that transform how you work.
                </p>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  variants={staggerContainer}
                >
                  {metrics.map((metric, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <Card className="p-4 text-center modern-card bg-card/70 backdrop-blur-sm border-primary/10 hover:border-primary/30">
                        <metric.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-3xl font-bold text-foreground">
                          {metric.value}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
               {/* Apply parallax to the chart container */}
               <motion.div
                 className="flex items-center justify-center"
                 style={{ y: whyLazifyParallaxY }}
                 variants={fadeInUp}
               >
                <div className="w-full h-[400px] relative">
                  <div className="absolute inset-0">
                     {isClient && <ChartDisplay isMobile={isMobile} />}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

         {/* Pricing Section */}
        <motion.section
          id="pricing"
          ref={sectionRefs.pricing}
          className="w-full section-padding"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container px-4 md:px-6">
             <motion.div className="text-center mb-12 md:mb-16" variants={fadeInUp}>
                <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent mb-2">
                  Pricing Plans
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                  Choose Your Automation Level
                </h2>
                <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">
                  Simple, transparent pricing to fit your needs, whether you're an individual or a large enterprise.
                </p>
             </motion.div>
             <PricingTable />
          </div>
        </motion.section>


        {/* FAQ Section */}
        <motion.section
          id="faq"
          ref={sectionRefs.faq}
          className="w-full section-padding bg-secondary/10" // Subtle background for FAQ
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <motion.div className="text-center mb-12 md:mb-16" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground">Have questions? We've got answers.</p>
            </motion.div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <AccordionItem value={`item-${index}`} className="border-b border-primary/10 last:border-b-0">
                    <AccordionTrigger className="py-4 text-lg font-medium text-left hover:text-primary transition-colors [&[data-state=open]>svg]:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pt-2 pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.section>

         {/* Demo CTA Section */}
        <motion.section
           id="demo"
           ref={sectionRefs.demo}
           className="section-padding"
           initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}
         >
          <div className="container container-padding">
            <motion.div
               className="bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-xl p-8 md:p-12 lg:p-16 text-center"
               variants={fadeInUp}
             >
               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Try Lazify Free for 1 Day</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience the power of AI automation firsthand. No commitment required. See how Lazify can save you time and boost your efficiency.
              </p>
               <Button className="cta-button" size="lg" asChild>
                   <Link href="#contact"> {/* Link to contact form for demo request */}
                     Request Your Free Demo <CheckCircle className="ml-2 h-5 w-5" />
                   </Link>
               </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
         <motion.section
           id="contact"
           ref={sectionRefs.contact}
           className="w-full section-padding bg-secondary/20"
           initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
         >
           <div className="container px-4 md:px-6">
             <motion.div className="text-center mb-12 md:mb-16" variants={fadeInUp}>
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Get in Touch</h2>
               <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                 Have a question, need a custom solution, or want to request your demo? Reach out to us!
               </p>
             </motion.div>
             <div className="max-w-xl mx-auto">
               <ContactForm />
             </div>
           </div>
         </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
         className="w-full py-12 md:py-16 bg-secondary/30 border-t border-border/50" // Darker secondary, less prominent border
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, amount: 0.1 }}
         transition={{ duration: 0.8 }}
       >
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3 items-start">
            {/* Logo & Info */}
            <motion.div className="space-y-2" variants={fadeInUp}>
              <Link href="#home" className="flex items-center gap-2 text-xl font-bold">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="gradient-text-animated"> {/* Use animated gradient */}
                  Lazify
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Lazify AI. All rights reserved.
              </p>
              <Link
                href="mailto:contact@lazify.ai"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <Mail className="h-4 w-4" /> contact@lazify.ai
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div className="space-y-2" variants={fadeInUp} transition={{ delay: 0.1, ...fadeInUp.transition }}>
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <nav className="flex flex-col gap-1">
                 {/* Added Privacy & Terms */}
                {[...navLinks.slice(1, 6), { href: '#', label: 'Privacy Policy' }, { href: '#', label: 'Terms of Service' }].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors group flex items-center"
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Social Links */}
            <motion.div className="space-y-4" variants={fadeInUp} transition={{ delay: 0.2, ...fadeInUp.transition }}>
              <h4 className="font-semibold text-foreground">Connect With Us</h4>
              <p className="text-sm text-muted-foreground">
                 Follow us on social media for the latest updates and insights on AI automation.
               </p>
              <div className="flex justify-start gap-4 pt-2">
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
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

