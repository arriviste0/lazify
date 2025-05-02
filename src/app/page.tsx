'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, FileText, Cog, ArrowRight, BrainCircuit, BarChart, Mail, Clock, CheckCircle, Linkedin, Twitter, Youtube, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile nav

// Placeholder 3D element component
const Placeholder3DElement = ({ hint, className = '', animated = false }: { hint: string; className?: string; animated?: boolean }) => (
  <div className={`relative aspect-square w-full mx-auto lg:max-w-none ${className} ${animated ? 'animate-float' : ''}`}>
    <Image
      src={`https://picsum.photos/seed/${hint.replace(/\s+/g, '-')}/600/600`}
      alt={`Abstract 3D element: ${hint}`}
      fill
      className="object-contain rounded-lg" // Use contain to avoid cropping potentially important details
      data-ai-hint={hint}
      sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
      priority={hint.includes('dashboard')} // Prioritize hero image
    />
  </div>
);

// Agent Card Component
const AgentCard = ({ name, description, hint }: { name: string; description: string; hint: string }) => (
  <Card className="w-full min-w-[280px] max-w-sm snap-center shrink-0 shadow-lg hover:shadow-primary/20 transition-all duration-300 group overflow-hidden">
    <CardHeader className="p-0">
      <div className="aspect-video relative w-full overflow-hidden">
        <Image
          src={`https://picsum.photos/seed/${hint.replace(/\s+/g, '-')}/400/225`}
          alt={`${name} agent visual`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={hint}
          sizes="(max-width: 768px) 80vw, 300px"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4 space-y-2">
      <CardTitle className="text-lg font-semibold text-primary group-hover:gradient-text">{name}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      <Button variant="link" size="sm" className="p-0 h-auto text-accent group-hover:text-primary" asChild>
        <Link href="#demo">
          See in Action <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

// Metric Box Component
const MetricBox = ({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) => (
  <Card className="p-4 text-center bg-card/50 backdrop-blur-md">
    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
    <div className="text-3xl font-bold text-foreground animated-metric">{value}</div>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </Card>
);


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#agents', label: 'Agents' },
    { href: '#demo', label: 'Demo' },
    { href: '#contact', label: 'Contact' },
  ];

  const services = [
    {
      title: 'Automation AI',
      description: 'Schedule meetings, manage your inbox, and create insightful reports automatically.',
      icon: Clock,
      imageHint: 'robot arm organizing calendar icons',
    },
    {
      title: 'AI Content Generation',
      description: 'Generate high-quality blog posts, social media captions, and email newsletters effortlessly.',
      icon: FileText,
      imageHint: 'glowing pen writing on digital paper',
    },
    {
      title: 'Custom AI Agents',
      description: 'Specialized AI assistants designed for healthcare, e-commerce, finance, and more.',
      icon: Cog,
      imageHint: 'blueprint with glowing circuit lines',
    },
  ];

  const agents = [
    { name: 'InboxBot', description: 'Filters emails, drafts replies, and manages your schedule.', hint: 'robot sorting mail envelopes 3d isometric' },
    { name: 'BlogGenie', description: 'Researches topics and writes engaging blog articles.', hint: 'magic lamp emitting blog post icons 3d isometric' },
    { name: 'ShopHelper', description: 'Analyzes sales data and optimizes product listings.', hint: 'robot analyzing shopping cart data 3d isometric' },
    { name: 'ReportWizard', description: 'Compiles data from various sources into clear reports.', hint: 'wizard hat creating charts graphs 3d isometric' },
    { name: 'SocialSpark', description: 'Creates and schedules engaging social media posts.', hint: 'megaphone generating social media icons 3d isometric' },
  ];

  const metrics = [
     { value: '10+', label: 'Hours Saved per Week', icon: Clock },
     { value: '90%', label: 'Task Accuracy Rate', icon: CheckCircle },
     { value: '40%', label: 'Productivity Boost', icon: BarChart },
  ];

  const faqs = [
    { q: 'How secure is Lazify?', a: 'We use industry-standard encryption and security protocols to protect your data. Your privacy and security are our top priorities.' },
    { q: 'Do I need technical knowledge to use Lazify?', a: 'Not at all! Our platform is designed to be user-friendly. We provide easy setup guides and support to get you started quickly.' },
    { q: 'Can Lazify integrate with my existing tools?', a: 'Yes, Lazify is built to integrate seamlessly with many popular business tools like Google Workspace, Slack, CRMs, and more.' },
    { q: 'What kind of tasks can be automated?', a: 'A wide range! From email management, scheduling, data entry, report generation, content creation, customer support tasks, and much more.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 text-xl font-bold text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span>Lazify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
              <Button className="hidden md:inline-flex bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity" size="sm" asChild>
                 <Link href="#demo">Try Our App</Link>
               </Button>

             {/* Mobile Navigation Trigger */}
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-background p-4">
                   <nav className="flex flex-col gap-6 text-lg font-medium mt-8">
                      {navLinks.map(link => (
                       <Link
                         key={link.label}
                         href={link.href}
                         className="text-muted-foreground hover:text-primary transition-colors"
                         onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                       >
                         {link.label}
                       </Link>
                     ))}
                     <Button className="w-full mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity" size="lg" asChild>
                         <Link href="#demo" onClick={() => setIsMobileMenuOpen(false)}>Try Our App</Link>
                      </Button>
                   </nav>
                </SheetContent>
             </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden animated-background">
           {/* Subtle background shapes */}
           <div className="absolute inset-0 opacity-10 dark:opacity-5">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/50 rounded-full filter blur-3xl animate-pulse"></div>
             <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/50 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
           </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl gradient-text">
                  AI Agents That Work While You Rest
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mx-auto lg:mx-0">
                  Delegate your routine tasks to intelligent AI agents and reclaim your focus for what truly matters. Boost productivity, effortlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all" asChild>
                    <Link href="#demo">
                      Get a Free Demo <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-background/50 backdrop-blur-sm" asChild>
                    <Link href="#services">Explore Services</Link>
                  </Button>
                </div>
              </div>
               <div className="flex items-center justify-center lg:justify-end">
                 {/* Increased size of 3D element */}
                 <Placeholder3DElement hint="futuristic dashboard showing scheduling emails reports 3d isometric" className="w-full max-w-lg lg:max-w-xl" animated={true}/>
               </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-2">Our Services</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Automate Your World with AI
              </h2>
              <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">
                Lazify offers a suite of intelligent services designed to handle your repetitive tasks and boost creative output.
              </p>
            </div>
            <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
              {services.map((service, index) => (
                <Card key={index} className="group flex flex-col text-center items-center p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                     <service.icon className="h-8 w-8 text-primary" />
                   </div>
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription>{service.description}</CardDescription>
                    {/* Use image placeholder for 3d render */}
                     <div className="mt-4 aspect-square relative w-48 h-48 mx-auto">
                       <Image
                         src={`https://picsum.photos/seed/${service.imageHint.replace(/\s+/g, '-')}/200/200`}
                         alt={`${service.title} 3D illustration`}
                         fill
                         className="object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                         data-ai-hint={`${service.imageHint} 3d isometric render`}
                         sizes="200px"
                       />
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Agents Gallery Section */}
        <section id="agents" className="w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent mb-2">Meet Your Agents</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Your Dedicated AI Workforce
              </h2>
              <p className="max-w-3xl mx-auto mt-4 text-muted-foreground">
                Explore some of our specialized AI agents ready to take on specific tasks.
              </p>
            </div>
             {/* Simple Horizontal Scroll for Carousel Effect */}
             <div className="flex overflow-x-auto space-x-6 md:space-x-8 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
               {agents.map((agent, index) => (
                 <AgentCard key={index} name={agent.name} description={agent.description} hint={agent.hint} />
               ))}
            </div>
          </div>
        </section>

        {/* Why Lazify Section */}
        <section id="why-lazify" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
               <div>
                 <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-2">The Lazify Advantage</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Unlock Unprecedented Efficiency
                </h2>
                <p className="text-muted-foreground mb-8">
                  Lazify isn't just automation; it's intelligent delegation. Experience tangible benefits that transform how you work.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {metrics.map((metric, index) => (
                     <MetricBox key={index} value={metric.value} label={metric.label} icon={metric.icon} />
                   ))}
                </div>
               </div>
               <div className="flex items-center justify-center">
                  {/* Placeholder for graph/chart */}
                 <Placeholder3DElement hint="glowing bar chart showing upward trend 3d isometric" className="w-full max-w-md" />
               </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground">
                Have questions? We've got answers.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section - Merged with Footer for simplicity */}

      </main>

      {/* Footer */}
      <footer id="contact" className="w-full py-12 md:py-16 bg-secondary/50 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3 items-start">
             {/* Logo & Info */}
            <div className="space-y-2">
               <Link href="#home" className="flex items-center gap-2 text-xl font-bold text-primary">
                 <BrainCircuit className="h-6 w-6" />
                 <span>Lazify</span>
               </Link>
               <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Lazify AI. All rights reserved.</p>
               <Link href="mailto:contact@lazify.ai" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                 <Mail className="h-4 w-4" /> contact@lazify.ai
               </Link>
             </div>

             {/* Quick Links */}
             <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Quick Links</h4>
                <nav className="flex flex-col gap-1">
                  {navLinks.slice(1,5).map(link => ( // Exclude Home, include up to Contact
                     <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                       {link.label}
                     </Link>
                   ))}
                   <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                   <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                   <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                </nav>
             </div>

             {/* Get Started & Social */}
             <div id="demo" className="space-y-4">
                <h4 className="font-semibold text-foreground">Ready to Lazify?</h4>
                <p className="text-sm text-muted-foreground">Request a personalized demo and see how our AI agents can transform your workflow.</p>
                 <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
                   Request a Demo
                 </Button>
                 <div className="flex justify-start gap-4 pt-2">
                   <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
                   <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                   <Link href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary"><Youtube className="h-5 w-5" /></Link>
                 </div>
             </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

// Remove the dummy CheckIcon if not needed or replace with lucide import if used elsewhere.
// const CheckIcon = ... (Removed as CheckCircle from lucide is used)
