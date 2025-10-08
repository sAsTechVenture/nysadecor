"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Users, Award } from 'lucide-react';
import { api } from '@/utils/apiClient';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.products.get(productId);
        setProduct(response);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product?.isComingSoon) {
      toast('This product is coming soon!', { icon: 'ℹ️' });
      return;
    }
    // TODO: Implement add to cart functionality
    toast.success(`${product?.name} added to cart!`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
            
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-40" />
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => router.push('/products')}>
            View All Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🪟</span>
                    </div>
                    <p className="text-lg">{product.name}</p>
                  </div>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isBestSeller && (
                  <Badge style={{ backgroundColor: '#eb152e' }}>Best Seller</Badge>
                )}
                {product.isComingSoon && (
                  <Badge variant="secondary" style={{ backgroundColor: '#48468a', color: 'white' }}>
                    Coming Soon
                  </Badge>
                )}
              </div>
            </div>
            
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.category.replace('_', ' ')}</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.8/5)</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.isComingSoon}
                style={{ backgroundColor: product.isComingSoon ? '#6b7280' : '#eb152e' }}
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.isComingSoon ? 'Coming Soon' : 'Add to Cart'}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Why Choose This Product?</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                      <Shield className="w-5 h-5" style={{ color: '#eb152e' }} />
                    </div>
                    <div>
                      <h4 className="font-medium">Quality Guarantee</h4>
                      <p className="text-sm text-gray-600">Premium materials</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                      <Truck className="w-5 h-5" style={{ color: '#eb152e' }} />
                    </div>
                    <div>
                      <h4 className="font-medium">Free Installation</h4>
                      <p className="text-sm text-gray-600">Professional setup</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                      <Users className="w-5 h-5" style={{ color: '#eb152e' }} />
                    </div>
                    <div>
                      <h4 className="font-medium">Expert Support</h4>
                      <p className="text-sm text-gray-600">24/7 assistance</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(235, 21, 46, 0.1)' }}>
                      <Award className="w-5 h-5" style={{ color: '#eb152e' }} />
                    </div>
                    <div>
                      <h4 className="font-medium">Warranty</h4>
                      <p className="text-sm text-gray-600">5-year coverage</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="ml-2">{product.category.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Material:</span>
                    <span className="ml-2">Premium Quality</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Installation:</span>
                    <span className="ml-2">Professional</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Warranty:</span>
                    <span className="ml-2">5 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
