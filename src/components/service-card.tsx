
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
  const cardStyle = {
    '--card-actual-index': index,
    '--numcards-from-prop': totalCards,
  } as React.CSSProperties;

  return (
    <motion.div
      className="service-card-wrapper"
      style={cardStyle}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeInOut" }} // Adjusted ease and duration
      viewport={{ once: false, amount: 0.2 }}
    >
      <motion.div
        className="card__content group h-full flex flex-col text-center items-center p-6 md:p-8 transition-all duration-300 modern-card bg-card overflow-hidden relative isolate rounded-xl"
        whileHover={{ y: -8, boxShadow: "0 20px 30px -10px hsla(var(--primary-rgb), 0.3)" }} // Simplified hover: removed scale
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className={`mb-5 rounded-full bg-gradient-to-r ${gradientColors} p-4 text-white shadow-lg`}>
          <Icon className="h-10 w-10" />
        </div>
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-2xl font-semibold text-foreground transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col items-center">
          <CardDescription className="mb-6 text-muted-foreground max-w-xs">
            {description}
          </CardDescription>
          <div className="mt-auto relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6">
            <Image
                src={`https://placehold.co/200x200.png?text=${title.split(" ")[0]}+${index}`}
                alt={`${title} 3D illustration`}
                width={200}
                height={200}
                className="object-contain w-full h-full rounded-md"
                data-ai-hint={`${imageHint} ${gradientColors.split("-")[1]}`}
                loading="lazy"
            />
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
