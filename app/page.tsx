"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Truck, Users, Award, Star } from "lucide-react";
import { ProductCard } from "@/components/products";
import { useHomeData } from "@/hooks/useHomeData";
import { 
  HeroSkeleton, 
  FeatureCardsSkeleton, 
  ProductCardsSkeleton, 
  GalleryCardsSkeleton, 
  TestimonialCardsSkeleton, 
  ComingSoonCardsSkeleton 
} from "@/components/common/LoadingSkeletons";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Home() {
  const { data, loading, error } = useHomeData();

  if (loading) {
    return (
      <div className="min-h-screen">
        <HeroSkeleton />
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-12 w-80 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
            </div>
            <FeatureCardsSkeleton />
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-12 w-48 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
            </div>
            <ProductCardsSkeleton />
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-12 w-80 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
            </div>
            <GalleryCardsSkeleton />
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-12 w-48 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
            </div>
            <ComingSoonCardsSkeleton />
          </div>
        </section>
        <section className="py-16 bg-gradient-to-r from-pink-100 to-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-12 w-80 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
            </div>
            <TestimonialCardsSkeleton />
          </div>
        </section>
        <section className="py-16 bg-gradient-to-r from-purple-900 to-pink-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-12 w-80 mx-auto mb-4 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-96 mx-auto mb-8 bg-white/20 rounded animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-48 mx-auto sm:mx-0 bg-white/20 rounded animate-pulse"></div>
              <div className="h-12 w-40 mx-auto sm:mx-0 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Chair Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🪑</span>
              </div>
              <p className="text-lg">Hero Background Image</p>
              <p className="text-sm">Replace with actual chair image</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            Transform Your Space
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
            with Premium Window Treatments
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Custom blinds, curtains, and shutters designed to elevate your home or office. Expert installation and lifetime support included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#eb152e' }} className="hover:opacity-90 text-white px-8 py-4 text-lg">
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-gray-100 px-8 py-4 text-lg" style={{ color: '#eb152e', borderColor: '#eb152e' }}>
              View Our Work
            </Button>
          </div>
        </div>
      </section>


      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BlindCraft?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering exceptional quality and service that exceeds your expectations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                  <Shield className="h-8 w-8" style={{ color: '#eb152e' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
                <p className="text-gray-600">
                  Premium materials and craftsmanship with comprehensive warranty coverage for peace of mind.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(235, 21, 46, 0.2)' }}>
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                  <Truck className="h-8 w-8" style={{ color: '#eb152e' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Professional Installation</h3>
                <p className="text-gray-600">
                  Expert installation service with precise measurements and perfect fitting every time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                  <Users className="h-8 w-8" style={{ color: '#eb152e' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                <p className="text-gray-600">
                  Tailored window treatments designed to match your unique style and functional needs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                  <Award className="h-8 w-8" style={{ color: '#eb152e' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Award Winning</h3>
                <p className="text-gray-600">
                  Recognized for excellence in design and customer service by industry professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Sellers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our most popular window blinds trusted by thousands of satisfied customers worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.bestSellers?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => toast.success(`${product.name} added to cart!`)}
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="hover:bg-gray-50" style={{ borderColor: '#48468a', color: '#48468a' }}>
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Premium Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our exceptional collection with interactive previews. Click on any project to see detailed information and explore our craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.featuredProjects?.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-shadow cursor-pointer">
                <div className="relative overflow-hidden">
                  {project.image ? (
            <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🪟</span>
                        </div>
                        <p className="text-sm">{project.title}</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {project.category.replace('_', ' ')}
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" style={{ backgroundColor: '#eb152e' }} className="hover:opacity-90">
              Explore Full Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Exciting new products launching soon. Be the first to experience our latest innovations!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.comingSoon?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => toast('This product is coming soon!', { icon: 'ℹ️' })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16" style={{ background: 'linear-gradient(to right, rgba(235, 21, 46, 0.05), rgba(72, 70, 138, 0.05))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#48468a' }}>
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Real feedback from real customers who have transformed their spaces with BlindCraft.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Absolutely stunning blinds! The quality exceeded my expectations and the installation was flawless."
                </p>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600">Homeowner</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "I recommend BlindCraft to all my clients. Their custom solutions are unmatched in the industry."
                </p>
                <div>
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-gray-600">Interior Designer</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Professional service from start to finish. The team was knowledgeable and efficient throughout."
                </p>
                <div>
                  <p className="font-semibold text-gray-900">Emma Williams</p>
                  <p className="text-gray-600">Property Manager</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16" style={{ background: 'linear-gradient(to right, #48468a, #eb152e)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto">
            Get a free consultation and custom quote for your window treatment needs. Our experts are ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white hover:bg-gray-100 border-white" style={{ color: '#48468a' }}>
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}