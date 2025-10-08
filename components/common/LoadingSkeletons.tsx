import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const HeroSkeleton = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <Skeleton className="h-16 md:h-20 lg:h-24 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-12 md:h-16 lg:h-20 w-2/3 mx-auto mb-6" />
      <Skeleton className="h-6 md:h-8 w-1/2 mx-auto mb-8" />
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Skeleton className="h-12 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-12 w-40 mx-auto sm:mx-0" />
      </div>
    </div>
  </section>
);

export const FeatureCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="text-center p-6">
        <CardContent className="p-0">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ProductCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="group">
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
    ))}
  </div>
);

export const GalleryCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="group">
        <div className="relative overflow-hidden">
          <Skeleton className="w-full h-64" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TestimonialCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="p-6">
        <CardContent className="p-0">
          <div className="flex mb-4">
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-5 w-5 mr-1" />
            ))}
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ComingSoonCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[...Array(2)].map((_, i) => (
      <Card key={i} className="group">
        <div className="relative">
          <Skeleton className="w-full h-64 rounded-t-lg" />
          <Skeleton className="absolute top-4 left-4 h-6 w-24 rounded" />
        </div>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
