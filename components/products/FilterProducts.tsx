"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, X } from 'lucide-react';

interface FilterProductsProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
  totalProducts: number;
  categories: string[];
}

export const FilterProducts: React.FC<FilterProductsProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
  totalProducts,
  categories,
}) => {
  return (
    <Card className="gradient-border rounded-2xl p-6 mb-8">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eb152e' }}>
              <Filter className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Filter Products</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 lg:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {/* Category Dropdown */}
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{totalProducts}</span> products found
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
