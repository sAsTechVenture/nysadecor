"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroSection, ProjectInMindSection } from "@/components/common";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { colors } from "@/config/theme";
import { heroBadges, story, stats, values, certifications, cta } from "@/data/about";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="About BlindCraft"
        paragraph="For over 15 years, we've been transforming spaces with premium window treatments, combining traditional craftsmanship with modern design innovation."
        badges={heroBadges}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="slide-up-animation">
            <h2
              className="text-4xl font-bold mb-6"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {story.title}
            </h2>
            <div className="space-y-6 text-muted-foreground">
              {story.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-lg" : ""}
                  style={{ color: colors.textSecondary }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="relative slide-up-animation stagger-1">
            <div
              className="rounded-xl overflow-hidden relative w-full h-[400px]"
              style={{
                border: `2px solid ${colors.primary}`,
              }}
            >
              <Image
                src={story.image}
                alt="BlindCraft Workshop"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg"
              style={{
                border: `2px solid ${colors.primary}`,
              }}
            >
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  15+
                </div>
                <div style={{ color: colors.textSecondary }}>
                  Years of Excellence
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="text-center slide-up-animation"
              style={{
                animationDelay: `${i * 100}ms`,
                background: `${colors.background}`,
                border: `2px solid ${colors.primary}`,
              }}
            >
              <CardContent className="p-6">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.number}
                </div>
                <div style={{ color: colors.textSecondary }}>{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12 slide-up-animation">
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Values
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              These core principles guide everything we do and shape our
              relationships with customers, partners, and the community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <Card
                key={i}
                className="text-center hover:shadow-lg transition-all duration-300 slide-up-animation"
                style={{
                  animationDelay: `${i * 150}ms`,
                  background: `${colors.background}`,
                  border: `2px solid ${colors.primary}`,
                }}
              >
                <CardHeader>
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: colors.textSecondary }}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <div className="text-center mb-12 slide-up-animation">
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Certifications & Awards
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              Our commitment to excellence is recognized by industry leaders and
              regulatory bodies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {certifications.map((cert, i) => (
              <Card
                key={i}
                className="text-center hover:shadow-lg transition-all duration-300 slide-up-animation"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: `${colors.primary}20`,
                    }}
                  >
                    <cert.icon
                      className="h-6 w-6"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <h4 className="font-semibold mb-2">{cert.title}</h4>
                  <p style={{ color: colors.textSecondary }}>
                    {cert.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <ProjectInMindSection
          title={cta.title}
          description={cta.description}
          buttons={[
            {
              text: "Get Free Consultation",
              href: "/contact",
              variant: "default",
            },
            {
              text: "View Our Work",
              href: "/projects",
              variant: "outline",
            },
          ]}
        />
      </div>
    </div>
  );
}
