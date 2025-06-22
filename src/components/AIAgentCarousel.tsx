"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import styles from "./SmoothCarousel.module.css";

const agents = [
  {
    icon: "🤖",
    name: "InboxZero AI",
    description: "Cleans your inbox, flags priority emails, archives spam, and drafts replies.",
    cta: "Try InboxZero",
  },
  {
    icon: "🧲",
    name: "LeadSpark AI",
    description: "Captures, qualifies leads from LinkedIn, web forms, or email, and syncs to CRM/Sheets.",
    cta: "Try LeadSpark",
  },
  {
    icon: "✍️",
    name: "ContentCraft AI",
    description: "Generates high-quality content for blogs, social media, and more.",
    cta: "Try ContentCraft",
  },
  {
    icon: "📅",
    name: "ScheduleSync AI",
    description: "Automates meeting scheduling and calendar management.",
    cta: "Try ScheduleSync",
  },
  {
    icon: "✅",
    name: "TaskMaster AI",
    description: "Manages your to-dos and automates repetitive tasks.",
    cta: "Try TaskMaster",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.15 } },
};

const slideVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
};

export default function AIAgentCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const controls = useAnimation();
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setSlideProgress(progress * (agents.length - 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div style={{color:'white', fontWeight:'bold', fontSize:'2rem', textAlign:'center', margin:'2rem 0'}}>Slider Debug</div>
      <motion.section
        className={styles.carouselSection}
        ref={sectionRef}
        variants={sectionVariants}
        initial="hidden"
        animate={controls}
      >
        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack}>
            {agents.map((agent, i) => {
              const distance = i - slideProgress;
              const absDistance = Math.abs(distance);
              const scale = Math.max(0.7, 1 - absDistance * 0.15);
              const opacity = Math.max(0.3, 1 - absDistance * 0.4);
              const translateX = distance * 100;
              const translateZ = -absDistance * 200;
              const rotateY = distance * 15;
              const isActive = Math.round(slideProgress) === i;
              return (
                <motion.div
                  key={i}
                  className={styles.carouselSlide}
                  data-active={isActive ? "true" : undefined}
                  style={{
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: 100 - absDistance * 10,
                    filter: `blur(${absDistance * 2}px)`,
                  }}
                  variants={slideVariants}
                >
                  <div className={styles.slideContent}>
                    <div className={styles.slideNumber}>{String(i + 1).padStart(2, "0")}</div>
                    <div className={styles.slideIcon}>{agent.icon}</div>
                    <h3 className={styles.slideTitle}>{agent.name}</h3>
                    <p className={styles.slideDescription}>{agent.description}</p>
                    <button className={styles.slideCta}>{agent.cta}</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className={styles.carouselProgress}>
          {agents.map((_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${Math.round(slideProgress) === i ? styles.active : ""}`}
              onClick={() => {
                if (!sectionRef.current) return;
                const rect = sectionRef.current.getBoundingClientRect();
                const carouselTop = window.pageYOffset + rect.top;
                const dotProgress = i / (agents.length - 1);
                const targetScroll = carouselTop + (rect.height - window.innerHeight) * dotProgress;
                window.scrollTo({ top: targetScroll, behavior: "smooth" });
              }}
            />
          ))}
        </div>
      </motion.section>
    </>
  );
} 