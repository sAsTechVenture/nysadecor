import React, {
	useEffect,
	useState,
} from 'react';
import {
	Mail,
	Phone,
	Trash2,
	Search,
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
import { EnquiryForm } from '@/types';
import { api } from '@/utils/apiClient';
import toast from 'react-hot-toast';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

export const EnquiriesManagement: React.FC<{
	isLoading: boolean;
}> = ({ isLoading }) => {
	const [searchTerm, setSearchTerm] =
		useState('');
	// Removed channel filter as it's not in the new schema
	const [enquiries, setEnquiries] = useState<
		EnquiryForm[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<string | null>(null);

	// Pagination
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	// Debounce search term to avoid too many API calls
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

	// Fetch enquiries on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await api.enquiries.list(page, limit, debouncedSearchTerm || undefined);
				setEnquiries(Array.isArray(res?.data) ? res.data : []);
				setTotalPages(Number(res?.totalPages) || 1);
			} catch (err) {
				console.error(
					'Failed to load enquiries',
					err
				);
				toast.error('Failed to load enquiries');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [page, limit, debouncedSearchTerm]);

	const handleDelete = async (id: string) => {
		try {
			setDeleting(id);
			await api.enquiries.delete(id);
			setEnquiries(prev =>
				prev.filter(
					e => e.id !== id
				)
			);
			toast.success('Enquiry deleted successfully!');
		} catch (err) {
			console.error(
				'Failed to delete enquiry',
				err
			);
			// Check if it's a 404 error (enquiry not found)
			const errorMessage = err instanceof Error ? err.message : 'Failed to delete enquiry';
			if (errorMessage.includes('not found') || errorMessage.includes('404')) {
				toast.error('Enquiry not found. It may have been already deleted.');
				// Remove from UI even if not found on server
				setEnquiries(prev =>
					prev.filter(
						e => e.id !== id
					)
				);
			} else {
				toast.error('Failed to delete enquiry. Please try again.');
			}
		} finally {
			setDeleting(null);
		}
	};

	// No filtering needed as we removed channel filter
	const filteredEnquiries = enquiries;

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
								<Skeleton
									key={i}
									className="h-20 w-full"
								/>
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
						Enquiries
					</h1>
					<p
						style={{
							color: colors.textSecondary,
						}}
					>
						View and manage customer enquiries
					</p>
				</div>
				{/* <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button> */}
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
						placeholder="Search enquiries..."
						value={searchTerm}
						onChange={e =>
							setSearchTerm(e.target.value)
						}
						className="pl-10"
					/>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Contact</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>Message</TableHead>
									<TableHead>Items</TableHead>
									<TableHead>Date</TableHead>
									<TableHead className="text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredEnquiries.map(
									enquiry => (
										<TableRow key={enquiry.id}>
											<TableCell className="font-medium">
												{enquiry.name}
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													{enquiry.email && (
														<div className="flex items-center space-x-2 text-sm">
															<Mail className="h-3 w-3" />
															<span>
																{enquiry.email}
															</span>
														</div>
													)}
													{enquiry.phone && (
														<div className="flex items-center space-x-2 text-sm">
															<Phone className="h-3 w-3" />
															<span>
																{enquiry.phone}
															</span>
														</div>
													)}
												</div>
											</TableCell>
											<TableCell className="max-w-xs truncate">
												{enquiry.address}
											</TableCell>
											<TableCell className="max-w-xs truncate">
												{enquiry.message}
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{enquiry.items.length} items
												</Badge>
											</TableCell>
											<TableCell>
												{new Date(
													enquiry.createdAt
												).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<Button
													size="sm"
													variant="ghost"
													disabled={deleting === enquiry.id}
													style={{
														color: colors.destructive,
													}}
													onClick={() =>
														handleDelete(
															enquiry.id
														)
													}
												>
													{deleting === enquiry.id ? (
														<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
													) : (
														<Trash2 className="h-4 w-4" />
													)}
												</Button>
											</TableCell>
										</TableRow>
									)
								)}
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
		</div>
	);
};
