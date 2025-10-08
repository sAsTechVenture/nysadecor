import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Calendar,
} from 'lucide-react';
import { colors } from '@/config/theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Project, ProjectCategory } from '@/types';
import { api } from '@/utils/apiClient';
import { ProjectForm } from './forms/ProjectForm';
import toast from 'react-hot-toast';

export const ProjectManagement: React.FC<{
	isLoading: boolean;
}> = ({ isLoading }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | undefined>();
	const [formLoading, setFormLoading] = useState(false);

	// Pagination
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	// Debounce search term
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Reset page when search term changes
	useEffect(() => {
		if (debouncedSearchTerm !== searchTerm) return;
		setPage(1);
	}, [debouncedSearchTerm, searchTerm]);

	// Fetch projects
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await api.projects.list(
					page, 
					limit, 
					debouncedSearchTerm || undefined,
					selectedCategory !== 'all' ? selectedCategory : undefined
				);
				setProjects(Array.isArray(res?.data) ? res.data : []);
				setTotalPages(Number(res?.totalPages) || 1);
			} catch (err) {
				console.error('Failed to load projects', err);
				toast.error('Failed to load projects');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [page, limit, debouncedSearchTerm, selectedCategory]);

	const handleDelete = async (id: string) => {
		try {
			setDeleting(id);
			await api.projects.delete(id);
			setProjects(prev => prev.filter(p => p.id !== id));
			toast.success('Project deleted successfully!');
		} catch (err) {
			console.error('Failed to delete project', err);
			toast.error('Failed to delete project. Please try again.');
		} finally {
			setDeleting(null);
		}
	};

	const handleFormSubmit = async (data: FormData) => {
		try {
			setFormLoading(true);
			if (editingProject) {
				await api.projects.update(editingProject.id, data);
				toast.success('Project updated successfully!');
			} else {
				await api.projects.create(data);
				toast.success('Project created successfully!');
			}
			
			// Refresh the list
			const res = await api.projects.list(page, limit, debouncedSearchTerm || undefined, selectedCategory !== 'all' ? selectedCategory : undefined);
			setProjects(Array.isArray(res?.data) ? res.data : []);
			setTotalPages(Number(res?.totalPages) || 1);
		} catch (err) {
			console.error('Failed to save project', err);
			toast.error('Failed to save project. Please try again.');
		} finally {
			setFormLoading(false);
		}
	};

	const handleEdit = (project: Project) => {
		setEditingProject(project);
		setIsFormOpen(true);
	};

	const handleAddNew = () => {
		setEditingProject(undefined);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setEditingProject(undefined);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const formatCategory = (category: ProjectCategory) => {
		return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
	};

	if (isLoading || loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-8 w-48" />
				<div className="flex space-x-4">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-10 w-32" />
				</div>
				<Card>
					<CardContent className="p-0">
						<div className="space-y-4 p-6">
							{[1, 2, 3].map(i => (
								<Skeleton key={i} className="h-20 w-full" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Projects
					</h1>
					<p
						style={{
							color: colors.textSecondary,
						}}
					>
						Manage your project portfolio
					</p>
				</div>
				<Button
					onClick={handleAddNew}
					style={{ backgroundColor: colors.primary }}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Project
				</Button>
			</div>

			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1">
					<Search
						className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
						style={{
							color: colors.textSecondary,
						}}
					/>
					<Input
						placeholder="Search projects..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Select
					value={selectedCategory}
					onValueChange={setSelectedCategory}
				>
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue placeholder="Filter by category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{Object.values(ProjectCategory).map(category => (
							<SelectItem key={category} value={category}>
								{formatCategory(category)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Card>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Image</TableHead>
									<TableHead>Title</TableHead>
									<TableHead>Client</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Completed Date</TableHead>
									<TableHead>Gallery</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{projects.map(project => (
									<TableRow key={project.id}>
										<TableCell>
											<div className="relative w-16 h-16 rounded-lg overflow-hidden">
												<Image
													src={project.image}
													alt={project.title}
													fill
													className="object-cover"
												/>
											</div>
										</TableCell>
										<TableCell className="font-medium">
											<div className="max-w-xs">
												<p className="truncate">{project.title}</p>
												<p className="text-sm text-gray-500 truncate">
													{project.description}
												</p>
											</div>
										</TableCell>
										<TableCell className="font-medium">
											{project.client}
										</TableCell>
										<TableCell>
											<Badge variant="outline">
												{formatCategory(project.category)}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-1 text-sm text-gray-600">
												<Calendar className="h-4 w-4" />
												<span>{formatDate(project.completedDate)}</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{project.gallery.length} images
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end space-x-2">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleEdit(project)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													disabled={deleting === project.id}
													style={{ color: colors.destructive }}
													onClick={() => handleDelete(project.id)}
												>
													{deleting === project.id ? (
														<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
													) : (
														<Trash2 className="h-4 w-4" />
													)}
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<Pagination className="mt-6 flex justify-center">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setPage(p => Math.max(1, p - 1))}
								className={
									page <= 1
										? 'pointer-events-none opacity-50'
										: ''
								}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }).map((_, i) => (
							<PaginationItem key={i}>
								<PaginationLink
									isActive={page === i + 1}
									onClick={() => setPage(i + 1)}
								>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}

						{totalPages > 5 && <PaginationEllipsis />}

						<PaginationItem>
							<PaginationNext
								onClick={() => setPage(p => Math.min(totalPages, p + 1))}
								className={
									page >= totalPages
										? 'pointer-events-none opacity-50'
										: ''
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			{/* Project Form Modal */}
			<ProjectForm
				project={editingProject}
				onSubmit={handleFormSubmit}
				onClose={handleFormClose}
				isOpen={isFormOpen}
				isLoading={formLoading}
			/>
		</div>
	);
};
