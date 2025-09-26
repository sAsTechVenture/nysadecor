// data/about.ts
import { Award, Users, Clock, Shield, Target, Heart } from "lucide-react";

export const heroBadges = [
  "Established 2008",
  "500+ Projects",
  "Award Winning"
];

export const story = {
  title: "Our Story",
  paragraphs: [
    "BlindCraft was born from a simple vision: to make premium window treatments accessible to everyone. What started as a small family business has grown into a trusted name in the industry, serving both residential and commercial clients.",
    "Our founder, Sarah Johnson, recognized the need for high-quality, custom window solutions that didn't break the bank. With a background in interior design and a passion for craftsmanship, she set out to create a company that would prioritize both quality and customer service.",
    "Today, we're proud to have completed over 500 projects, from intimate residential spaces to large commercial installations. Our commitment to excellence has earned us numerous industry awards and, more importantly, the trust of our customers.",
  ],
  image: "/about/workshop.jpg",
};

export const stats = [
  { number: "15+", label: "Years Experience" },
  { number: "500+", label: "Projects Completed" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "24/7", label: "Customer Support" },
];

export const values = [
  {
    icon: Target,
    title: "Quality First",
    description:
      "We never compromise on quality, using only premium materials and proven manufacturing processes.",
  },
  {
    icon: Heart,
    title: "Customer Focused",
    description:
      "Every decision we make is guided by what's best for our customers and their satisfaction.",
  },
  {
    icon: Shield,
    title: "Trust & Reliability",
    description:
      "We build lasting relationships through honest communication and dependable service.",
  },
];

export const certifications = [
  { icon: Award, title: "ISO 9001", subtitle: "Quality Management" },
  { icon: Users, title: "BBB A+", subtitle: "Better Business Bureau" },
  { icon: Clock, title: "5-Year Warranty", subtitle: "Product Guarantee" },
  { icon: Shield, title: "Insured & Bonded", subtitle: "Complete Protection" },
];

export const cta = {
  title: "Ready to Work With Us?",
  description:
    "Experience the BlindCraft difference for yourself. Contact us today for a free consultation and discover how we can transform your space.",
};
