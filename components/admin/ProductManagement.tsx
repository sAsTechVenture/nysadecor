import React, { useEffect, useState } from 'react';
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Eye,
	Star,
	Clock,
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
import { Switch } from '@/components/ui/switch';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Product, ProductCategory } from '@/types';
import { api } from '@/utils/apiClient';
import { ProductForm } from './forms/ProductForm';
import toast from 'react-hot-toast';

export const ProductManagement: React.FC<{
	isLoading: boolean;
}> = ({ isLoading }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [updating, setUpdating] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | undefined>();
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

	// Fetch products
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await api.products.list(
					page, 
					limit, 
					debouncedSearchTerm || undefined,
					selectedCategory !== 'all' ? selectedCategory : undefined
				);
				setProducts(Array.isArray(res?.data) ? res.data : []);
				setTotalPages(Number(res?.totalPages) || 1);
			} catch (err) {
				console.error('Failed to load products', err);
				toast.error('Failed to load products');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [page, limit, debouncedSearchTerm, selectedCategory]);

	const handleDelete = async (id: string) => {
		try {
			setDeleting(id);
			await api.products.delete(id);
			setProducts(prev => prev.filter(p => p.id !== id));
			toast.success('Product deleted successfully!');
		} catch (err) {
			console.error('Failed to delete product', err);
			toast.error('Failed to delete product. Please try again.');
		} finally {
			setDeleting(null);
		}
	};

	const handleToggleStatus = async (id: string, field: 'isBestSeller' | 'isComingSoon', value: boolean) => {
		try {
			setUpdating(id);
			await api.products.toggleStatus(id, field === 'isBestSeller' ? value : undefined, field === 'isComingSoon' ? value : undefined);
			setProducts(prev => prev.map(p => 
				p.id === id ? { ...p, [field]: value } : p
			));
			toast.success('Product updated successfully!');
		} catch (err) {
			console.error('Failed to update product', err);
			toast.error('Failed to update product. Please try again.');
		} finally {
			setUpdating(null);
		}
	};

	const handleFormSubmit = async (data: FormData) => {
		try {
			setFormLoading(true);
			if (editingProduct) {
				await api.products.update(editingProduct.id, data);
				toast.success('Product updated successfully!');
			} else {
				await api.products.create(data);
				toast.success('Product created successfully!');
			}
			
			// Refresh the list
			const res = await api.products.list(page, limit, debouncedSearchTerm || undefined, selectedCategory !== 'all' ? selectedCategory : undefined);
			setProducts(Array.isArray(res?.data) ? res.data : []);
			setTotalPages(Number(res?.totalPages) || 1);
		} catch (err) {
			console.error('Failed to save product', err);
			toast.error('Failed to save product. Please try again.');
		} finally {
			setFormLoading(false);
		}
	};

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
		setIsFormOpen(true);
	};

	const handleAddNew = () => {
		setEditingProduct(undefined);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setEditingProduct(undefined);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	const formatCategory = (category: ProductCategory) => {
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
						Products
					</h1>
					<p
						style={{
							color: colors.textSecondary,
						}}
					>
						Manage your product catalog
					</p>
				</div>
				<Button
					onClick={handleAddNew}
					style={{ backgroundColor: colors.primary }}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Product
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
						placeholder="Search products..."
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
						{Object.values(ProductCategory).map(category => (
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
									<TableHead>Name</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Best Seller</TableHead>
									<TableHead>Coming Soon</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.map(product => (
									<TableRow key={product.id}>
										<TableCell>
											<div className="w-16 h-16 rounded-lg overflow-hidden">
												<img
													src={product.image}
													alt={product.name}
													className="w-full h-full object-cover"
												/>
											</div>
										</TableCell>
										<TableCell className="font-medium">
											<div className="max-w-xs">
												<p className="truncate">{product.name}</p>
												<p className="text-sm text-gray-500 truncate">
													{product.description}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">
												{formatCategory(product.category)}
											</Badge>
										</TableCell>
										<TableCell className="font-medium">
											{formatPrice(product.price)}
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												{product.isBestSeller && (
													<Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
														<Star className="h-3 w-3 mr-1" />
														Best Seller
													</Badge>
												)}
												{product.isComingSoon && (
													<Badge style={{ backgroundColor: colors.secondary, color: 'white' }}>
														<Clock className="h-3 w-3 mr-1" />
														Coming Soon
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Switch
												checked={product.isBestSeller}
												disabled={updating === product.id}
												onCheckedChange={(checked) => 
													handleToggleStatus(product.id, 'isBestSeller', checked)
												}
											/>
										</TableCell>
										<TableCell>
											<Switch
												checked={product.isComingSoon}
												disabled={updating === product.id}
												onCheckedChange={(checked) => 
													handleToggleStatus(product.id, 'isComingSoon', checked)
												}
											/>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end space-x-2">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleEdit(product)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													disabled={deleting === product.id}
													style={{ color: colors.destructive }}
													onClick={() => handleDelete(product.id)}
												>
													{deleting === product.id ? (
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

			{/* Product Form Modal */}
			<ProductForm
				product={editingProduct}
				onSubmit={handleFormSubmit}
				onClose={handleFormClose}
				isOpen={isFormOpen}
				isLoading={formLoading}
			/>
		</div>
	);
};
