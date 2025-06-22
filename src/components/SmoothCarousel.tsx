"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./SmoothCarousel.module.css";

const slides = [
  {
    icon: "🚀",
    title: "Innovation",
    description: "Pushing the boundaries of web animation with cutting-edge scroll-driven effects that feel native and responsive.",
    cta: "Learn More",
  },
  {
    icon: "⚡",
    title: "Performance",
    description: "Optimized animations that maintain 60fps performance across all devices with hardware acceleration.",
    cta: "Discover",
  },
  {
    icon: "🎨",
    title: "Design",
    description: "Beautiful, modern interfaces that adapt to user interactions with smooth, natural motion patterns.",
    cta: "Explore",
  },
  {
    icon: "🔧",
    title: "Technology",
    description: "Built with modern web standards and progressive enhancement for maximum compatibility.",
    cta: "Build",
  },
  {
    icon: "🌟",
    title: "Experience",
    description: "Creating memorable user experiences that engage and delight through thoughtful interaction design.",
    cta: "Experience",
  },
];

export default function SmoothCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const slideProgress = progress * (slides.length - 1);
      setActive(Math.round(slideProgress));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={styles.carouselSection} ref={sectionRef}>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          {slides.map((slide, i) => {
            const distance = i - active;
            const absDistance = Math.abs(distance);
            const scale = Math.max(0.7, 1 - absDistance * 0.15);
            const opacity = Math.max(0.3, 1 - absDistance * 0.4);
            const translateX = distance * 100;
            const translateZ = -absDistance * 200;
            const rotateY = distance * 15;
            return (
              <div
                key={i}
                className={styles.carouselSlide}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 100 - absDistance * 10,
                  filter: `blur(${absDistance * 2}px)`,
                }}
              >
                <div className={styles.slideContent}>
                  <div className={styles.slideNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.slideIcon}>{slide.icon}</div>
                  <h3 className={styles.slideTitle}>{slide.title}</h3>
                  <p className={styles.slideDescription}>{slide.description}</p>
                  <button className={styles.slideCta}>{slide.cta}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.carouselProgress}>
        {slides.map((_, i) => (
          <div
            key={i}
            className={`${styles.progressDot} ${i === active ? styles.active : ""}`}
            onClick={() => {
              if (!sectionRef.current) return;
              const rect = sectionRef.current.getBoundingClientRect();
              const carouselTop = window.pageYOffset + rect.top;
              const slideProgress = i / (slides.length - 1);
              const targetScroll = carouselTop + (rect.height - window.innerHeight) * slideProgress;
              window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }}
          />
        ))}
      </div>
    </section>
  );
} 