"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { colors } from "@/config/theme";

interface ButtonConfig {
  text: string;
  href: string;
  variant?: "default" | "outline";
  className?: string;
}

interface ProjectInMindSectionProps {
  title: string;
  description: string;
  buttons: ButtonConfig[];
  className?: string;
}

export const ProjectInMindSection: React.FC<ProjectInMindSectionProps> = ({
  title,
  description,
  buttons,
  className = "",
}) => {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl py-20 lg:py-32"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
        >
          <div className="px-8 lg:px-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {title}
              </h2>
              <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 leading-relaxed">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    size="lg"
                    variant={button.variant || "default"}
                    className={`min-w-[200px] flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 group ${
                      button.variant === "outline"
                        ? "border-white bg-transparent text-white hover:bg-white hover:text-red-600"
                        : "bg-white text-red-600 hover:bg-gray-50"
                    } ${button.className || ""}`}
                    asChild
                  >
                    <a href={button.href}>
                      <span>{button.text}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
