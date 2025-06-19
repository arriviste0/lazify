
"use client";

import type React from "react";
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
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, imageHint, gradientColors, index, totalCards }) => {
  // CSS variables are passed to the wrapper div to be used by CSS for the scroll animation
  const cardStyle = {
    '--card-actual-index': index,
    '--numcards-from-prop': totalCards,
  } as React.CSSProperties;

  return (
    <motion.div
      className="service-card-wrapper" // Wrapper for scroll-driven animation CSS
      style={cardStyle}
    >
      <Card className="card__content group h-full flex flex-col text-center items-center p-6 transition-all duration-300 modern-card overflow-hidden relative isolate">
         <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradientColors} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
        <div className={`mb-4 rounded-full bg-gradient-to-r ${gradientColors} p-4 text-white shadow-lg`}>
          <Icon className="h-8 w-8" />
        </div>
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-xl font-semibold text-foreground transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col">
          <CardDescription className="mb-4 text-muted-foreground">{description}</CardDescription>
          <div className="mt-auto relative w-48 h-48 mx-auto">
            <motion.div
              className="w-full h-full"
              style={{ perspective: 1000 }}
              whileHover={{
                scale: 1.08,
                transition: { type: 'spring', stiffness: 200, damping: 10 }
              }}
            >
               <motion.div
                 className="w-full h-full"
                 style={{ transformStyle: 'preserve-3d' }}
                 whileHover={{
                   rotateY: 15,
                   rotateX: -10,
                   transition: { type: 'spring', stiffness: 200, damping: 10 }
                 }}
               >
                  <div className={`absolute inset-4 bg-gradient-to-br ${gradientColors} opacity-30 blur-xl -z-10 rounded-full`}></div>
                   <Image
                     src={`https://placehold.co/200x200.png?text=${title.split(" ")[0]}+${index}`}
                     alt={`${title} 3D illustration`}
                     width={200}
                     height={200}
                     className="object-contain w-full h-full rounded-lg"
                     data-ai-hint={`${imageHint} ${gradientColors.split("-")[1]}`}
                     loading="lazy"
                   />
               </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
