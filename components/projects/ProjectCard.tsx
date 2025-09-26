import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  date: string;
  client: string;
}

export const ProjectCard = ({
  id,
  image,
  category,
  title,
  description,
  date,
  client,
}: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category Tag */}
        <div className="flex items-start">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>{client}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          variant="outline"
          className="w-full justify-between group hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
          asChild
        >
          <Link href={`/projects/${id}`}>
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
