'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/projects';
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
      <section className="bg-gradient-hero py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Projects
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white max-w-4xl mx-auto mb-12 leading-relaxed">
              Take a look at some of our completed projects showcasing our expertise in commercial and residential window treatments.
            </p>
            
            {/* Statistics Badges */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-8 py-6 border border-white/30 text-center min-w-[200px]">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-white font-semibold text-sm mb-1">Projects Completed</div>
                <div className="text-white/80 text-xs">Across residential and commercial</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-8 py-6 border border-white/30 text-center min-w-[200px]">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-white font-semibold text-sm mb-1">Years Experience</div>
                <div className="text-white/80 text-xs">Serving the community since 2000</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-8 py-6 border border-white/30 text-center min-w-[200px]">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-white font-semibold text-sm mb-1">Client Satisfaction</div>
                <div className="text-white/80 text-xs">Consistently rated excellent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-primary rounded-2xl py-20 lg:py-32">
            <div className="px-8 lg:px-12">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Have a Project in Mind?
                </h2>
                <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 leading-relaxed">
                  Let us help you transform your space with custom window treatments. From concept to completion, we're here for you.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold group"
                >
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
