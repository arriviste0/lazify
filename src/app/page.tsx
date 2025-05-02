'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, FileText, Cog, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link

// Placeholder 3D element component (using Image for now)
const Placeholder3DElement = ({ hint }: { hint: string }) => (
  <div className="relative aspect-square w-full max-w-sm mx-auto lg:max-w-none">
     <Image
        src={`https://picsum.photos/seed/${hint.replace(/\s+/g, '-')}/500/500`} // Use seed for consistency
        alt="Abstract 3D element"
        fill
        className="object-cover rounded-lg shadow-xl"
        data-ai-hint={hint} // Add hint for potential future replacement
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
     />
  </div>
);

export default function Home() {
  const services = [
    {
      title: 'Automation AI',
      description: 'Handle repetitive tasks like scheduling, email management, and report generation effortlessly.',
      icon: Bot,
      imageHint: 'robot hand typing keyboard',
    },
    {
      title: 'AI Content Generation',
      description: 'Create high-quality blog posts, social media updates, and marketing copy with AI assistance.',
      icon: FileText,
      imageHint: 'glowing pen writing text',
    },
    {
      title: 'Custom AI Agents',
      description: 'Get tailored AI solutions designed specifically for your industry needs, from healthcare to e-commerce.',
      icon: Cog,
      imageHint: 'interconnected gears glowing',
    },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
           <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Meet Lazify: Your AI Agent Agency
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Reclaim your time. Lazify provides powerful AI agents to automate tasks, generate content, and boost productivity for businesses and individuals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="#services">
                    Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                 <Button size="lg" variant="outline" asChild>
                   <Link href="#contact">
                    Get Started
                   </Link>
                </Button>
              </div>
            </div>
             <div className="flex items-center justify-center">
               <Placeholder3DElement hint="abstract network connection glowing" />
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Services</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">What We Automate For You</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Lazify offers a suite of AI-powered services designed to streamline your workflow and free up your valuable time.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-1 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="shadow-md hover:shadow-xl border hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
                <CardHeader className="pb-4">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="bg-primary/10 p-3 rounded-full">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                    <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                  </div>
                   <div className="aspect-video relative w-full mb-4 rounded-md overflow-hidden">
                     <Image
                        src={`https://picsum.photos/seed/${service.imageHint.replace(/\s+/g, '-')}/400/225`}
                        alt={`${service.title} visual representation`}
                        fill
                        className="object-cover"
                        data-ai-hint={service.imageHint}
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                   </div>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto"> {/* Push button to bottom */}
                  <Button variant="link" className="p-0 h-auto text-primary" asChild>
                     <Link href="#contact">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

       {/* How It Works / Features Section (Optional - Simple version) */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
              Effortless Integration, Powerful Results
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI agents seamlessly integrate with your existing tools and workflows. Experience increased efficiency and productivity without the hassle.
            </p>
             <ul className="grid gap-2 py-4">
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-accent" />
                Save hours on repetitive tasks.
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-accent" />
                Generate creative content on demand.
              </li>
              <li>
                 <CheckIcon className="mr-2 inline-block h-4 w-4 text-accent" />
                Access custom solutions built for your needs.
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
             <Placeholder3DElement hint="glowing data streams connecting nodes" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t bg-primary/5">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
              Ready to Lazify Your Workflow?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Let our AI agents handle the busywork so you can focus on what matters most. Get started today.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            {/* Replace with actual contact form or link later */}
             <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
               Request a Demo
             </Button>
             <p className="text-xs text-muted-foreground">
               Or <Link href="mailto:hello@lazify.ai" className="underline underline-offset-2 hover:text-primary">contact us</Link> to discuss custom solutions.
             </p>
          </div>
        </div>
      </section>

      {/* Footer */}
       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Lazify AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </main>
  );
}

// Dummy CheckIcon component (replace or ensure lucide-react import)
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
