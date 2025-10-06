'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/projects';
import { HeroSection, ProjectInMindSection } from '@/components/common';
import { Filter, ChevronDown, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/utils/apiClient';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  client: string;
  completedDate: string;
  createdAt: string;
}

interface ProjectsResponse {
  data: Project[];
  total: number;
  totalPages: number;
  page: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All Categories', 'Commercial', 'Residential', 'Office', 'Hotel', 'Restaurant', 'Retail', 'Healthcare', 'Education', 'Other'];

  const fetchProjects = async (page: number = 1, category?: string, search?: string) => {
    try {
      setLoading(true);
      const response: ProjectsResponse = await api.projects.list(
        page,
        6, // 6 projects per page
        search || undefined,
        category === 'All Categories' ? undefined : category
      );
      
      setProjects(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1, selectedCategory, searchTerm);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProjects(1, category, searchTerm);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchProjects(1, selectedCategory, search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProjects(page, selectedCategory, searchTerm);
  };

  const clearFilters = () => {
    setSelectedCategory('All Categories');
    setSearchTerm('');
    setCurrentPage(1);
    fetchProjects(1);
  };

  return (
    <div className="min-h-screen bg-white">      
      {/* Hero Section */}
      <HeroSection
        title="Our Projects"
        paragraph="Take a look at some of our completed projects showcasing our expertise in commercial and residential window treatments."
        badges={["500+ Projects", "15+ Years", "98% Satisfaction"]}
      />

      {/* Featured Projects Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 lg:p-12">
            {/* Section Header with Gradient Border */}
            <div className="border-gradient-primary rounded-lg p-6 mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-3">
                    Featured Projects
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Browse our portfolio of successful installations
                  </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-red-600" />
                    <span className="text-gray-700 font-medium">Filter by:</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Category Dropdown */}
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-[140px] bg-gray-100 hover:bg-gray-200 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Clear Filter Button */}
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex items-center gap-2 border border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear Filter</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    image={project.image || '/api/placeholder/400/300'}
                    category={project.category}
                    title={project.title}
                    description={project.description}
                    date={new Date(project.completedDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                    client={project.client}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects found</p>
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
                Showing {projects.length} of {total} projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <ProjectInMindSection
        title="Have a Project in Mind?"
        description="Let us help you transform your space with custom window treatments. From concept to completion, we're here for you."
        buttons={[
          {
            text: "Start Your Project",
            href: "/contact",
            variant: "default",
          },
        ]}
      />
    </div>
  );
}
