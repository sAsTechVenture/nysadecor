'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection, ProjectInMindSection } from '@/components/common';
import { ProductCard, FilterProducts } from '@/components/products';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { api } from '@/utils/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Product } from '@/types';

interface ProductsResponse {
  data: Product[];
  total: number;
  totalPages: number;
  page: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All Categories',
    'VERTICAL_BLINDS',
    'HORIZONTAL_BLINDS',
    'ROLLER_BLINDS',
    'VENETIAN_BLINDS',
    'ROMAN_BLINDS',
    'PLEATED_BLINDS',
    'HONEYCOMB_BLINDS',
    'MOTORIZED_BLINDS',
    'OUTDOOR_BLINDS',
    'CUSTOM_BLINDS'
  ];

  const fetchProducts = async (page: number = 1, category?: string, search?: string) => {
    try {
      setLoading(true);
      const response: ProductsResponse = await api.products.list(
        page,
        9, // 9 products per page
        search || undefined,
        category === 'All Categories' ? undefined : category
      );
      
      setProducts(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, selectedCategory, searchTerm);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProducts(1, category, searchTerm);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchProducts(1, selectedCategory, search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, selectedCategory, searchTerm);
  };

  const clearFilters = () => {
    setSelectedCategory('All Categories');
    setSearchTerm('');
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    toast.success(`${product.name} added to cart!`);
  };


  const ProductSkeleton = () => (
    <Card className="group">
      <div className="relative">
        <Skeleton className="w-full h-64 rounded-t-lg" />
        <Skeleton className="absolute top-4 left-4 h-6 w-20 rounded" />
      </div>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection 
        title="Premium Window Solutions" 
        paragraph="Discover our complete collection of luxury blinds, curtains, and smart window treatments designed to transform any space." 
        badges={["Trusted by 10,000+ customers worldwide"]} 
      />

      {/* Products Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 lg:p-12">
            {/* Filter Section */}
            <FilterProducts
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={handleSearch}
              onCategoryChange={handleCategoryChange}
              onClearFilters={clearFilters}
              totalProducts={total}
              categories={categories}
            />

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(9)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Showing {products.length} of {total} products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <ProjectInMindSection 
        title="Need Custom Solutions?" 
        description="Our experts can help you find the perfect window treatments for your unique needs. Get personalized recommendations and professional advice." 
        buttons={[{text: 'Get Free Consultation', href: '/contact', variant: 'outline'}]} 
      />
    </div>
  );
};

export default ProductsPage;