
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
  Send,
  Users,
  CalendarDays,
  Sparkles,
  ListChecks,
  Globe,
  FolderKanban,
  IndianRupee,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AgentSection from '@/components/agent-section';
import ServiceCard from '@/components/service-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { PricingTable } from '@/components/pricing-table';
import { ContactForm } from '@/components/contact-form';
import HeroBackground from '@/components/hero-background';


const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ChartDisplay now always shows the placeholder image.
const ChartDisplay = () => {
  return (
    <Image
      src="https://placehold.co/400x400.png"
      alt="Productivity chart visualization"
      width={400}
      height={400}
      className="w-full h-full object-contain rounded-lg"
      data-ai-hint="abstract 3d chart purple"
      suppressHydrationWarning
    />
  );
};


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  const sectionRefs = {
    home: useRef(null),
    services: useRef(null),
    agents: useRef(null),
    whyLazify: useRef(null),
    pricing: useRef(null),
    faq: useRef(null),
    aiWorkflow: useRef(null),
    demo: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, -100]);
  const whyLazifyContainerParallaxY = useTransform(scrollYProgress, [0.35, 0.65], ['-50px', '50px']);

  const chartImageParallaxY = useTransform(scrollYProgress, [0.4, 0.55, 0.7], ['30px', '-30px', '30px']);
  const chartImageScale = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0.9, 1.1, 0.9]);


  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.2,
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
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home', ref: sectionRefs.home },
    { href: '#services', label: 'Services', ref: sectionRefs.services },
    { href: '#agents', label: 'Agents', ref: sectionRefs.agents },
    { href: '#why-lazify', label: 'Why Us', ref: sectionRefs.whyLazify },
    { href: '#pricing', label: 'Pricing', ref: sectionRefs.pricing },
    { href: '#faq', label: 'FAQ', ref: sectionRefs.faq },
    { href: '#ai-workflow', label: 'AI Workflow', ref: sectionRefs.aiWorkflow },
    { href: '#demo', label: 'Demo', ref: sectionRefs.demo },
    { href: '#contact', label: 'Contact', ref: sectionRefs.contact },
  ];

  const services = [
    {
      title: 'Automation AI',
      description: 'Schedule meetings, manage your inbox, and create insightful reports automatically.',
      icon: Clock,
      imageHint: 'robot arm organizing calendar icons',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      title: 'AI Content Generation',
      description: 'Generate high-quality blog posts, social media captions, and email newsletters effortlessly.',
      icon: FileText,
      imageHint: 'glowing pen writing on digital paper',
      color: 'from-fuchsia-600 to-pink-600',
    },
    {
      title: 'Custom AI Agents',
      description: 'Specialized AI assistants designed for healthcare, e-commerce, finance, and more.',
      icon: Cog,
      imageHint: 'blueprint with glowing circuit lines',
      color: 'from-violet-600 to-purple-600',
    },
    {
      title: 'AI-Powered Web Solutions',
      description: 'Craft intelligent websites and impactful digital marketing strategies, enhanced by AI insights and automation.',
      icon: Globe,
      imageHint: 'ai website globe digital marketing',
      color: 'from-sky-600 to-cyan-600',
    },
  ];

  const agents = [
    {
      name: "LeadSpark AI",
      description: "Automatically identifies and qualifies potential leads from various sources, enriching your sales pipeline. Your tireless digital prospector.",
      hint: "robot sifting glowing data leads 3d isometric",
      color: "from-green-500 to-emerald-500",
      icon: Users,
      slug: "leadspark-ai",
    },
    {
      name: "InboxZero AI",
      description: "Intelligently sorts emails, drafts contextual replies, and prioritizes your inbox so you focus on what truly matters. Achieve inbox zen.",
      hint: "robot organizing email inbox zero 3d isometric",
      color: "from-blue-500 to-sky-500",
      icon: Mail,
      slug: "inboxzero-ai",
    },
    {
      name: "ScheduleSync AI",
      description: "Effortlessly coordinates meetings, finds optimal times, and manages your calendar invites across platforms. Never double-book again.",
      hint: "robot managing digital calendar appointments 3d isometric",
      color: "from-amber-500 to-yellow-500",
      icon: CalendarDays,
      slug: "schedulesync-ai",
    },
    {
      name: "ContentCraft AI",
      description: "Your AI partner for brainstorming, drafting, and refining engaging content for blogs, social media, and marketing materials.",
      hint: "robot writing on glowing digital scroll 3d isometric",
      color: "from-rose-500 to-red-500",
      icon: Sparkles,
      slug: "contentcraft-ai",
    },
    {
      name: "TaskMaster AI",
      description: "Organizes your to-do lists, sets smart reminders, and helps you manage daily personal and professional tasks with ease.",
      hint: "robot juggling checklist tasks gears 3d isometric",
      color: "from-teal-500 to-cyan-500",
      icon: ListChecks,
      slug: "taskmaster-ai",
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

  const headlineWord = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden items-center">
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
            <span className="gradient-text-animated">
              Lazify
            </span>
          </Link>

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
            <Button
              className="hidden md:inline-flex cta-button"
              size="sm"
              asChild
            >
              <Link href="#demo">Try Our App</Link>
            </Button>

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

      <main className="flex-grow w-full">
        <motion.section
          id="home"
          ref={sectionRefs.home}
          className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden text-center"
          style={{ y: heroParallaxY }}
        >
          <HeroBackground />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <motion.h1
                className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
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
                    <Link href="#demo">
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

        <motion.section
          id="services"
          ref={sectionRefs.services}
          className="w-full section-padding bg-secondary/20"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container mx-auto px-4 md:px-6">
             <motion.div className="mb-12 md:mb-16 text-center md:text-left" variants={fadeInUp}>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-2">
                Our Services
              </span>
               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Automate Your World with AI
              </h2>
               <p className="max-w-3xl mt-4 text-muted-foreground">
                Lazify offers a suite of intelligent services designed to handle your repetitive tasks and boost creative output.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
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

        <motion.section
          id="agents"
          ref={sectionRefs.agents}
          className="w-full section-padding overflow-hidden text-center"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp}
        >
          <div className="container mx-auto px-4 md:px-6">
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
            <AgentSection agents={agents} />
          </div>
        </motion.section>

        <motion.section
          id="why-lazify"
          ref={sectionRefs.whyLazify}
          className="w-full section-padding bg-gradient-to-b from-secondary/20 to-background text-center md:text-left"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div variants={fadeInUp}>
                 <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-2">
                  The Lazify Advantage
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Unlock Unprecedented Efficiency
                </h2>
                <p className="text-muted-foreground mb-8 lg:max-w-md mx-auto lg:mx-0">
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
               <motion.div
                 className="flex items-center justify-center"
                 style={{ y: whyLazifyContainerParallaxY }}
                 variants={fadeInUp}
               >
                <div className="w-full h-[400px] relative">
                  {isClient && (
                    <motion.div
                      className="w-full h-full"
                      style={{
                        y: chartImageParallaxY,
                        scale: chartImageScale,
                      }}
                    >
                      <ChartDisplay />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="pricing"
          ref={sectionRefs.pricing}
          className="w-full section-padding text-center"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container mx-auto px-4 md:px-6">
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

        <motion.section
          id="faq"
          ref={sectionRefs.faq}
          className="w-full section-padding bg-secondary/10 text-center"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <motion.div className="mb-12 md:mb-16 text-center" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground">Have questions? We've got answers.</p>
            </motion.div>
            <Accordion type="single" collapsible className="w-full text-left">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <AccordionItem value={`item-${index}`} className="border-b border-primary/10 last:border-b-0">
                    <AccordionTrigger className="py-4 text-lg font-medium hover:text-primary transition-colors [&[data-state=open]>svg]:text-primary" suppressHydrationWarning>
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

        <motion.section
          id="ai-workflow"
          ref={sectionRefs.aiWorkflow}
          className="w-full section-padding bg-secondary/20"
          initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
              <motion.div className="order-2 lg:order-1" variants={fadeInUp}>
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-3">
                  Exclusive Offer
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Unlock Powerful AI Workflows
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg">
                  Get access to our curated **AI Workflow Folder**, packed with ready-to-use templates, prompts, and guides to supercharge your productivity. Streamline complex tasks and automate your processes for just ₹9!
                </p>
                <p className="text-2xl font-bold text-primary mb-8">
                  Special Price: <IndianRupee className="inline-block h-6 w-6 relative -top-0.5" />9
                </p>
                <Button size="lg" className="cta-button bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/workflow-payment">
                    Get Workflow for <IndianRupee className="inline-block h-5 w-5 mx-1" />9 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                className="order-1 lg:order-2 flex justify-center items-center"
                variants={fadeInUp}
                transition={{ delay: 0.2, ...fadeInUp.transition }}
              >
                <Image
                  src="https://placehold.co/500x350.png"
                  alt="AI Workflow Folder"
                  width={500}
                  height={350}
                  className="rounded-xl shadow-2xl border-2 border-primary/30"
                  data-ai-hint="ai workflow folder product screen purple"
                  suppressHydrationWarning
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
           id="demo"
           ref={sectionRefs.demo}
           className="section-padding text-center w-full"
           initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}
         >
          <div className="container mx-auto container-padding">
            <motion.div
               className="bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-xl p-8 md:p-12 lg:p-16 text-center"
               variants={fadeInUp}
             >
               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Try Lazify Free for 1 Day</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience the power of AI automation firsthand. No commitment required. See how Lazify can save you time and boost your efficiency.
              </p>
               <Button className="cta-button" size="lg" asChild>
                   <Link href="#contact">
                     Request Your Free Demo <CheckCircle className="ml-2 h-5 w-5" />
                   </Link>
               </Button>
            </motion.div>
          </div>
        </motion.section>

         <motion.section
           id="contact"
           ref={sectionRefs.contact}
           className="w-full section-padding bg-card"
           initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
         >
           <div className="container mx-auto px-4 md:px-6">
             <motion.div
               className="max-w-2xl mx-auto bg-secondary/20 p-8 md:p-12 rounded-xl shadow-2xl border border-border/50"
               variants={fadeInUp}
             >
               <div className="text-center mb-8 md:mb-10">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Get in Touch</h2>
                 <p className="mt-4 text-lg text-muted-foreground">
                   Have a question, need a custom solution, or want to request your demo? Reach out to us!
                 </p>
               </div>
               <ContactForm />
             </motion.div>
           </div>
         </motion.section>
      </main>

      <motion.footer
         className="w-full py-12 md:py-16 bg-secondary/30 border-t border-border/50 text-center"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, amount: 0.1 }}
         transition={{ duration: 0.8 }}
       >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3 items-center md:items-start text-center md:text-left">
            <motion.div className="space-y-2 md:col-span-1" variants={fadeInUp}>
              <Link href="#home" className="flex items-center justify-center md:justify-start gap-2 text-xl font-bold">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="gradient-text-animated">
                  Lazify
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Lazify AI. All rights reserved.
              </p>
              <Link
                href="mailto:contact@lazify.ai"
                className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center md:justify-start gap-1 transition-colors"
              >
                <Mail className="h-4 w-4" /> contact@lazify.ai
              </Link>
            </motion.div>

            <motion.div className="space-y-2 md:col-span-1" variants={fadeInUp} transition={{ delay: 0.1, ...fadeInUp.transition }}>
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <nav className="flex flex-col gap-1 items-center md:items-start">
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

            <motion.div className="space-y-4 md:col-span-1" variants={fadeInUp} transition={{ delay: 0.2, ...fadeInUp.transition }}>
              <h4 className="font-semibold text-foreground">Connect With Us</h4>
              <p className="text-sm text-muted-foreground">
                 Follow us on social media for the latest updates and insights on AI automation.
               </p>
              <div className="flex justify-center md:justify-start gap-4 pt-2">
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

