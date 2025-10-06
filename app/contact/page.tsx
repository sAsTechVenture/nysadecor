'use client';

import React, { useState } from 'react';
import {heroBadges,contactInfo, faqs, consultationFeatures } from '../../data/contactData';
import { colors } from '../../config/theme';
import { Button } from '../../components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { HeroSection } from '../../components/common';
import { Send, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Hero Section */}
      <HeroSection
        title="Get In Touch"
        paragraph="Ready to transform your space? Get in touch for a free consultation and custom quote tailored to your needs."
        badges={heroBadges}
      />

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, idx) => (
          <Card
            key={idx}
            className="text-center border shadow-sm rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              borderColor: colors.border,
              background: colors.primary+10,
            }}
          >
            <CardHeader>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <info.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">{info.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {info.details.map((detail, i) => (
                <p key={i} className="text-muted-foreground">
                  {detail}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form and FAQs */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="border shadow-md rounded-xl p-6" style={{ borderColor: colors.border }}>
          <CardHeader>
            <CardTitle
              className="flex items-center gap-3 text-2xl font-semibold"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <Send className="h-6 w-6" /> Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project..."
                  required
                  rows={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white"
                style={{ background: colors.primary, color: '#fff' }}
              >
                Send Message <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQs & Consultation */}
        <div className="space-y-6">
          <Card
            className="border shadow-md rounded-xl p-6"
            style={{
              borderColor: colors.border,
              background: colors.primary+10
            }}
          >
            <CardHeader>
              <CardTitle
                className="flex items-center gap-3 text-xl font-semibold"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <Calendar className="h-6 w-6" /> Free In-Home Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consultationFeatures.map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" style={{ color: colors.secondary }} />
                  <span>{item}</span>
                </div>
              ))}
              <Button
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white"
                style={{ background: colors.secondary, color: '#fff' }}
              >
                Schedule Consultation <Calendar className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border shadow-md rounded-xl p-6" style={{ borderColor: colors.border }}>
            <CardHeader>
              <CardTitle
                className="text-xl font-semibold"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <faq.icon className="h-5 w-5" style={{ color: colors.secondary }} />
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
