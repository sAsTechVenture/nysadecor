"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className = "",
}) => {
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isComingSoon) {
      toast('This product is coming soon!', { icon: 'ℹ️' });
      return;
    }
    onAddToCart?.(product);
    toast.success(`${product.name} added to cart`);
  };


  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Card 
      className={`h-full group hover:shadow-xl transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="relative flash-container">
          {/* Product Image */}
          <div className="relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🪟</span>
                  </div>
                  <p className="text-sm">{product.name}</p>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {product.isBestSeller && (
                <Badge style={{ backgroundColor: '#eb152e' }}>Best Seller</Badge>
              )}
              {product.isComingSoon && (
                <Badge variant="secondary" style={{ backgroundColor: '#48468a', color: 'white' }}>Coming Soon</Badge>
              )}
            </div>
          </div>

          {/* Flash Overlay */}
          <div className="flash-overlay">
            <div className="flash-text">
              <Eye className="w-8 h-8" />
              <span>View Details</span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{product.category.replace('_', ' ')}</p>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="text-xl font-bold">₹{product.price}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={product.isComingSoon}
          style={{ backgroundColor: product.isComingSoon ? '#6b7280' : '#eb152e' }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.isComingSoon ? 'Coming Soon' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
