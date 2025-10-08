'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/utils/apiClient';
import toast from 'react-hot-toast';
import { Project } from '@/types';

interface RelatedProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch the main project
        const projectData = await api.projects.get(params.id as string);
        setProject(projectData);

        // Fetch related projects (same category, excluding current project)
        const relatedData = await api.projects.list(1, 4, undefined, projectData.category);
        const filteredRelated = relatedData.data
          .filter((p: { id: string }) => p.id !== params.id)
          .slice(0, 3)
          .map((p: { id: string; title: string; description: string; image: string; category: string }) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.image,
            category: p.category
          }));
        setRelatedProjects(filteredRelated);

      } catch (error) {
        console.error('Error fetching project:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load project details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error.includes('404') || error.includes('not found') ? 'Project Not Found' : 'Error Loading Project'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error.includes('404') || error.includes('not found') 
              ? 'The project you\'re looking for doesn\'t exist.' 
              : error
            }
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/projects')} 
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/projects')} 
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/projects')}
          className="mb-6 text-gray-600 hover:text-gray-900 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          {/* Project Metadata */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-sm text-gray-600">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
              {project.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{formatDate(project.completedDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{project.client}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-700 max-w-4xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Main Image */}
            <div className="lg:col-span-3 order-1">
              <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                <Image
                  src={project.gallery?.[selectedImageIndex] || project.image || '/api/placeholder/800/600'}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {project.gallery && project.gallery.length > 1 && (
              <div className="lg:col-span-1 h-[60vh] sm:h-[70vh] lg:h-[80vh] order-2 lg:order-2 flex flex-col gap-3 lg:gap-4">
                {project.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-1 w-full rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 touch-manipulation ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-red-500 ring-offset-2'
                        : 'hover:opacity-80 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Project Overview */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Challenge</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The project required careful planning and execution to meet the client&apos;s specific requirements for both functionality and aesthetic appeal. We needed to ensure that the window treatments would provide optimal light control while maintaining the modern, professional look of the office space.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Solution</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We implemented a comprehensive solution using premium materials and innovative installation techniques. Our team worked closely with the client to ensure every detail met their specifications, completing the project on time and exceeding expectations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Results</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The installation successfully met all functional requirements while enhancing the overall ambiance of the office space. The client was extremely satisfied with the attention to detail and the professional finish of the project.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Details & CTA */}
          <div className="space-y-4 sm:space-y-6">
            {/* Project Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Category:</span>
                  <span className="text-gray-700 text-sm sm:text-base">{project.category || 'N/A'}</span>
                </div>
                {project.client && (
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-900 text-sm sm:text-base">Client:</span>
                    <span className="text-gray-700 text-sm sm:text-base truncate ml-2">{project.client}</span>
                  </div>
                )}
                {project.completedDate && (
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-900 text-sm sm:text-base">Completed:</span>
                    <span className="text-gray-700 text-sm sm:text-base">{formatDate(project.completedDate)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Duration:</span>
                  <span className="text-gray-700 text-sm sm:text-base">2-3 weeks</span>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                  Interested in Similar Work?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Contact us to discuss your project requirements and get a custom quote.
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-10"
                    onClick={() => router.push('/contact')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-10"
                    onClick={() => router.push('/products')}
                  >
                    View Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.id}`}
                  className="group block"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <CardContent className="p-4 flex flex-col h-full">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors text-sm sm:text-base line-clamp-2">
                        {relatedProject.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 flex-grow">
                        {relatedProject.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
