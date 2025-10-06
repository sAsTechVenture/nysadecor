"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/config/theme";

interface HeroSectionProps {
  title: string;
  paragraph: string;
  badges: string[];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  paragraph,
  badges,
  className = "",
}) => {
  return (
    <section
      className={`relative py-20 text-white overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 slide-up-animation">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 slide-up-animation stagger-1">
          {paragraph}
        </p>
        <div className="flex flex-wrap justify-center gap-3 slide-up-animation stagger-2">
          {badges.map((badge, i) => (
            <Badge
              key={i}
              variant="secondary"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};
