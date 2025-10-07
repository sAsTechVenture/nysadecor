'use client';

import React, {
	useEffect,
	useState,
} from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogsForm } from './forms';
import { BlogFormValues } from './forms/BlogsForm';
import { colors } from '@/config/theme';
import { api } from '@/utils/apiClient';
import toast from 'react-hot-toast';
import {
	Plus,
	Edit,
	Trash2,
	Search,
	Eye,
	Star,
	Globe,
} from 'lucide-react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface Blog {
	id: string;
	title: string;
	slug: string;
	category: string;
	author: string;
	excerpt: string;
	content: string;
	image: string;
	isPublished: boolean;
	isFeatured: boolean;
	viewCount: number;
	tags: string[];
	metaTitle: string;
	metaDescription: string;
	createdAt: string;
	updatedAt: string;
}

export const BlogsManagement: React.FC<{
	isLoading: boolean;
}> = ({ isLoading }) => {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [toggling, setToggling] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [editingBlog, setEditingBlog] =
		useState<Blog | null>(null);
	const [searchQuery, setSearchQuery] =
		useState('');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [publishedFilter, setPublishedFilter] = useState('all');

	// Pagination
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	// Form state
	const [form, setForm] =
		useState<BlogFormValues>({
			title: '',
			category: '',
			author: '',
			excerpt: '',
			content: '',
			image: null,
			isPublished: false,
			isFeatured: false,
			tags: '',
			metaTitle: '',
			metaDescription: '',
		});

	// Debounce search term to avoid too many API calls
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
			setIsSearching(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Reset page when search term changes
	useEffect(() => {
		if (debouncedSearchQuery !== searchQuery) return;
		setPage(1);
	}, [debouncedSearchQuery, searchQuery]);

	// Fetch blogs
	useEffect(() => {
		async function fetchBlogs() {
			try {
				setLoading(true);
				console.log('Fetching blogs with params:', {
					page, 
					limit, 
					search: debouncedSearchQuery || undefined,
					category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
					published: publishedFilter && publishedFilter !== 'all' ? publishedFilter === 'true' : undefined
				});
				
				const res = await api.blogs.list(
					page, 
					limit, 
					debouncedSearchQuery || undefined,
					categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
					publishedFilter && publishedFilter !== 'all' ? publishedFilter === 'true' : undefined
				);
				
				console.log('Blogs API response:', res);
				setBlogs(Array.isArray(res?.data) ? res.data : []);
				setTotalPages(Number(res?.totalPages) || 1);
			} catch (err) {
				console.error(
					'Failed to fetch blogs',
					err
				);
				toast.error('Failed to fetch blogs');
			} finally {
				setLoading(false);
			}
		}
		fetchBlogs();
	}, [page, limit, debouncedSearchQuery, categoryFilter, publishedFilter]);

	const handleOpenDialog = (blog?: Blog) => {
		if (blog) {
			setEditingBlog(blog);
			setForm({
				title: blog.title,
				category: blog.category,
				author: blog.author,
				excerpt: blog.excerpt,
				content: blog.content || '',
				image: null, // existing image is a URL, not a File
				isPublished: blog.isPublished,
				isFeatured: blog.isFeatured,
				tags: blog.tags.join(', '),
				metaTitle: blog.metaTitle || '',
				metaDescription: blog.metaDescription || '',
			});
		} else {
			setEditingBlog(null);
			setForm({
				title: '',
				category: '',
				author: '',
				excerpt: '',
				content: '',
				image: null,
				isPublished: false,
				isFeatured: false,
				tags: '',
				metaTitle: '',
				metaDescription: '',
			});
		}
		setOpen(true);
	};

	const handleSave = async (
		formData: FormData
	) => {
		try {
			setSaving(true);
			if (editingBlog) {
				// Include blog id in formData
				formData.append('id', editingBlog.id);
				const updated = await api.blogs.update(
					editingBlog.id,
					formData
				);
				setBlogs(prev =>
					prev.map(b =>
						b.id === editingBlog.id ? updated : b
					)
				);
				toast.success('Blog updated successfully!');
			} else {
				const created =
					await api.blogs.create(formData);
				setBlogs(prev => [created, ...prev]);
				toast.success('Blog created successfully!');
			}
			setOpen(false);
		} catch (err) {
			console.error('Failed to save blog', err);
			toast.error('Failed to save blog. Please try again.');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			setDeleting(id);
			await api.blogs.delete(id);
			setBlogs(prev =>
				prev.filter(b => b.id !== id)
			);
			toast.success('Blog deleted successfully!');
		} catch (err) {
			console.error('Failed to delete blog', err);
			toast.error('Failed to delete blog. Please try again.');
		} finally {
			setDeleting(null);
		}
	};

	const handleToggleStatus = async (id: string, field: 'isPublished' | 'isFeatured') => {
		try {
			setToggling(id);
			const blog = blogs.find(b => b.id === id);
			if (!blog) return;

			const updated = await api.blogs.update(id, {
				[field]: !blog[field]
			});

			setBlogs(prev =>
				prev.map(b => b.id === id ? updated : b)
			);
			
			toast.success(`Blog ${field === 'isPublished' ? 'publication' : 'feature'} status updated!`);
		} catch (err) {
			console.error(`Failed to toggle ${field}`, err);
			toast.error(`Failed to update ${field === 'isPublished' ? 'publication' : 'feature'} status.`);
		} finally {
			setToggling(null);
		}
	};

	// No client-side filtering needed since search is now server-side

	return (
		<div className="p-6">
			{/* Header */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2
						className="text-2xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Blogs
					</h2>
					<p
						className="text-sm"
						style={{
							color: colors.textSecondary,
						}}
					>
						Manage all blogs published on the
						platform
					</p>
				</div>
				<Button
					onClick={() => handleOpenDialog()}
					style={{
						backgroundColor: colors.primary,
						color: "#fff",
					}}
					disabled={saving}
				>
					{saving ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
							Saving...
						</>
					) : (
						<>
							<Plus className="mr-2 h-4 w-4" /> Add
							Blog
						</>
					)}
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="mb-6 flex flex-col sm:flex-row gap-4">
				{/* Search */}
				<div className="relative w-full max-w-sm">
					<Search
						className="absolute top-2.5 left-2 h-4 w-4"
						style={{ color: colors.textSecondary }}
					/>
					<Input
						placeholder="Search blogs..."
						className="pl-8"
						value={searchQuery}
						onChange={e => {
							setSearchQuery(e.target.value);
							setIsSearching(true);
						}}
					/>
					{isSearching && (
						<div className="absolute top-2.5 right-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
					)}
				</div>

				{/* Category Filter */}
				<Select value={categoryFilter} onValueChange={setCategoryFilter}>
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						<SelectItem value="WINDOW_TREATMENTS">Window Treatments</SelectItem>
						<SelectItem value="INTERIOR_DESIGN">Interior Design</SelectItem>
						<SelectItem value="HOME_DECOR">Home Decor</SelectItem>
						<SelectItem value="DIY_TIPS">DIY Tips</SelectItem>
						<SelectItem value="MAINTENANCE">Maintenance</SelectItem>
						<SelectItem value="TRENDS">Trends</SelectItem>
						<SelectItem value="PRODUCT_SPOTLIGHT">Product Spotlight</SelectItem>
						<SelectItem value="CASE_STUDIES">Case Studies</SelectItem>
						<SelectItem value="NEWS">News</SelectItem>
						<SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
					</SelectContent>
				</Select>

				{/* Published Filter */}
				<Select value={publishedFilter} onValueChange={setPublishedFilter}>
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="true">Published</SelectItem>
						<SelectItem value="false">Draft</SelectItem>
					</SelectContent>
				</Select>
			</div>

		{/* Table */}
		{loading || isLoading ? (
				<div className="space-y-4">
					{[...Array(5)].map((_, i) => (
						<Skeleton
							key={i}
							className="h-12 w-full rounded-md"
						/>
					))}
				</div>
			) : (
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[200px]">Title</TableHead>
								<TableHead className="hidden sm:table-cell">Category</TableHead>
								<TableHead className="hidden md:table-cell">Author</TableHead>
								<TableHead className="hidden lg:table-cell">Status</TableHead>
								<TableHead className="hidden lg:table-cell">Views</TableHead>
								<TableHead className="hidden md:table-cell">Date</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{blogs.map(blog => (
								<TableRow key={blog.id}>
									<TableCell className="font-medium">
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-2">
												<span className="line-clamp-1 text-sm max-w-[200px] truncate" title={blog.title}>{blog.title}</span>
												{blog.isFeatured && (
													<Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
												)}
											</div>
											<div className="flex items-center gap-2 text-xs text-gray-500 sm:hidden">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
													{blog.category.replace('_', ' ')}
												</span>
												<span>{blog.author}</span>
											</div>
											<div className="flex items-center gap-2 text-xs sm:hidden">
												{blog.isPublished ? (
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
														<Globe className="h-3 w-3 mr-1" />
														Published
													</span>
												) : (
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
														Draft
													</span>
												)}
												<div className="flex items-center gap-1">
													<Eye className="h-3 w-3 text-gray-400" />
													<span>{blog.viewCount}</span>
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											{blog.category.replace('_', ' ')}
										</span>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{blog.author}
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										<div className="flex items-center gap-2">
											{blog.isPublished ? (
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
													<Globe className="h-3 w-3 mr-1" />
													Published
												</span>
											) : (
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
													Draft
												</span>
											)}
										</div>
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										<div className="flex items-center gap-1">
											<Eye className="h-4 w-4 text-gray-400" />
											<span>{blog.viewCount}</span>
										</div>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{new Date(
											blog.createdAt
										).toLocaleDateString()}
									</TableCell>
									<TableCell className="space-x-2 text-right">
										<div className="flex justify-end gap-1">
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													handleToggleStatus(blog.id, 'isPublished')
												}
												className="h-8 w-8"
												title={blog.isPublished ? 'Unpublish' : 'Publish'}
												disabled={toggling === blog.id}
											>
												{toggling === blog.id ? (
													<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
												) : (
													<Globe className="h-4 w-4" />
												)}
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													handleToggleStatus(blog.id, 'isFeatured')
												}
												className={`h-8 w-8 ${blog.isFeatured ? 'bg-yellow-100 text-yellow-600' : ''}`}
												title={blog.isFeatured ? 'Remove from featured' : 'Mark as featured'}
												disabled={toggling === blog.id}
											>
												{toggling === blog.id ? (
													<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
												) : (
													<Star className="h-4 w-4" />
												)}
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													handleOpenDialog(blog)
												}
												className="h-8 w-8"
												disabled={saving || toggling === blog.id || deleting === blog.id}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="destructive"
												size="icon"
												onClick={() =>
													handleDelete(blog.id)
												}
												className="h-8 w-8"
												disabled={deleting === blog.id || toggling === blog.id}
											>
												{deleting === blog.id ? (
													<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
												) : (
													<Trash2 className="h-4 w-4" />
												)}
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
							{blogs.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={7}
										className="py-6 text-center"
									>
										No blogs found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<Pagination className="mt-6 flex justify-center">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setPage(p => Math.max(1, p - 1))
								}
								className={
									page <= 1
										? 'pointer-events-none opacity-50'
										: ''
								}
							/>
						</PaginationItem>

						{Array.from({
							length: totalPages,
						}).map((_, i) => (
							<PaginationItem key={i}>
								<PaginationLink
									isActive={page === i + 1}
									onClick={() => setPage(i + 1)}
								>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}

						{totalPages > 5 && (
							<PaginationEllipsis />
						)}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setPage(p =>
										Math.min(totalPages, p + 1)
									)
								}
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

			{/* Dialog */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
					<DialogHeader className="flex-shrink-0">
						<DialogTitle>
							{editingBlog
								? 'Edit Blog'
								: 'Add Blog'}
						</DialogTitle>
					</DialogHeader>
					<div className="flex-1 overflow-y-auto px-1">
						<BlogsForm
							values={form}
							onChange={setForm}
							onSubmit={handleSave} // now passes FormData
							onCancel={() => setOpen(false)}
							submitting={false}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
