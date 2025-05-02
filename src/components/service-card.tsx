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
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, imageHint, gradientColors }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }} // Enhanced hover effect
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card className="group h-full flex flex-col text-center items-center p-6 transition-all duration-300 modern-card overflow-hidden relative isolate"> {/* Added relative isolate */}
         {/* Subtle gradient background glow on hover */}
         <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradientColors} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>

         {/* Icon with Gradient */}
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

          {/* 3D illustration container */}
          <div className="mt-auto relative w-48 h-48 mx-auto">
            {/* Perspective wrapper for 3D effect */}
            <motion.div
              className="w-full h-full"
              style={{ perspective: 1000 }} // Add perspective
              whileHover={{
                scale: 1.08,
                transition: { type: 'spring', stiffness: 200, damping: 10 }
              }}
            >
               {/* Inner div for rotation */}
               <motion.div
                 className="w-full h-full"
                 style={{ transformStyle: 'preserve-3d' }} // Preserve 3D transforms
                 whileHover={{
                   rotateY: 15,
                   rotateX: -10,
                   transition: { type: 'spring', stiffness: 200, damping: 10 }
                 }}
               >
                  {/* Gradient Blur Background */}
                  <div className={`absolute inset-4 bg-gradient-to-br ${gradientColors} opacity-30 blur-xl -z-10 rounded-full`}></div>
                   <Image
                     src={`https://picsum.photos/200/200?random=${title}`} // Use Picsum with title seed
                     alt={`${title} 3D illustration`}
                     width={200}
                     height={200}
                     className="object-contain w-full h-full rounded-lg"
                     data-ai-hint={`${imageHint} 3d isometric render purple`}
                     loading="lazy" // Add lazy loading
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
