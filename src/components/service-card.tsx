"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageHint: string;
  gradientColors: string; // e.g., "from-purple-600 to-indigo-600"
  index: number;
  totalCards: number;
  fallbackAnimation?: boolean;
  imageUrl?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, imageHint, gradientColors, index, totalCards, fallbackAnimation, imageUrl }) => {
  const cardStyle = {
    '--card-actual-index': index,
    '--numcards-from-prop': totalCards,
  } as React.CSSProperties;

  // Fallback animation logic
  const ref = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!fallbackAnimation) return;
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Calculate progress: 0 when card is fully in view, 1 when stacked
      let p = 0;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visible = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
        p = 1 - visible / rect.height;
      } else if (rect.top >= windowHeight) {
        p = 0;
      } else {
        p = 1;
      }
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [fallbackAnimation]);

  // Calculate fallback transform
  let fallbackTransform = {};
  if (fallbackAnimation) {
    const stackOffset = -1 * (totalCards - (index + 1));
    const scale = 1 - 0.001 * (totalCards - (index + 1));
    const opacity = 1 - 0.01 * (totalCards - (index + 1));
    fallbackTransform = {
      transform: `translateY(${progress * stackOffset}px) scale(${1 - progress * (1 - scale)})`,
      opacity: 1 - progress * (1 - opacity),
      transition: 'transform 1.5s, opacity 1.5s',
    };
  }

  return (
    <motion.div
      className="service-card-wrapper"
      style={cardStyle}
      ref={fallbackAnimation ? ref : undefined}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeInOut" }}
      viewport={{ once: false, amount: 0.2 }}
      whileHover={{ zIndex: 10 }}
    >
      <motion.div
        className="card__content group h-full flex flex-col text-center items-center p-6 md:p-8 transition-all duration-300 modern-card bg-card overflow-visible relative isolate rounded-xl"
        whileHover={{
          y: -8,
          scale: 1.04,
          boxShadow: "0 24px 40px -12px hsla(var(--primary-rgb), 0.25), 0 8px 16px hsla(0,0%,0%,0.10)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={fallbackAnimation ? fallbackTransform : {}}
      >
        <div className={`mb-5 rounded-full bg-gradient-to-r ${gradientColors} p-4 text-white shadow-lg`}>
          <Icon className="h-10 w-10" />
        </div>
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-2xl font-semibold text-foreground transition-colors" style={{zIndex:2,position:'relative',background:'inherit'}}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col items-center">
          <CardDescription className="mb-6 text-muted-foreground max-w-xs" style={{zIndex:2,position:'relative',background:'inherit'}}>
            {description}
          </CardDescription>
          <div className="mt-auto relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6">
            <Image
                src={imageUrl || `https://placehold.co/200x200.png?text=${title.split(" ")[0]}+${index}`}
                alt={`${title} 3D illustration`}
                width={200}
                height={200}
                className="object-contain w-full h-full rounded-md"
                data-ai-hint={`${imageHint} ${gradientColors.split("-")[1]}`}
                loading="lazy"
                style={{zIndex:2,position:'relative',background:'inherit'}}
            />
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
