'use client';
import React, {
	useEffect,
	useState,
} from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	MessageSquare,
	Package,
	FolderOpen,
	Users,
	Star,
	Clock,
} from 'lucide-react';
import { colors } from '@/config/theme';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { api } from '@/utils/apiClient';

export const DashboardOverview: React.FC<{
	isLoading: boolean;
}> = ({ isLoading }) => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<{
		enquiries: number;
		products: number;
		projects: number;
		bestSellers: number;
		comingSoon: number;
		recentEnquiries: Array<{
			name?: string;
			email?: string;
			phone?: string;
			createdAt?: string;
		}>;
		recentProducts: Array<{
			name?: string;
			category?: string;
			isBestSeller?: boolean;
		}>;
		recentProjects: Array<{
			title?: string;
			client?: string;
			category?: string;
		}>;
	}>({
		enquiries: 0,
		products: 0,
		projects: 0,
		bestSellers: 0,
		comingSoon: 0,
		recentEnquiries: [],
		recentProducts: [],
		recentProjects: [],
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const [enquiriesRes, productsRes, projectsRes] =
					await Promise.all([
						api.enquiries.list(1, 100),
						api.products.list(1, 100),
						api.projects.list(1, 100),
					]);

				const enquiries = Array.isArray(enquiriesRes?.data) ? enquiriesRes.data : [];
				const products = Array.isArray(productsRes?.data) ? productsRes.data : [];
				const projects = Array.isArray(projectsRes?.data) ? projectsRes.data : [];
				
				const bestSellers = products.filter((p: { isBestSeller: boolean }) => p.isBestSeller).length;
				const comingSoon = products.filter((p: { isComingSoon: boolean }) => p.isComingSoon).length;
				
				setStats({
					enquiries: enquiries.length,
					products: products.length,
					projects: projects.length,
					bestSellers,
					comingSoon,
					recentEnquiries: enquiries
						.slice(-3)
						.reverse(),
					recentProducts: products.slice(-3).reverse(),
					recentProjects: projects.slice(-3).reverse(),
				});
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const statCards = [
		{
			title: 'Total Enquiries',
			value: stats.enquiries,
			icon: MessageSquare,
			color: colors.primary,
		},
		{
			title: 'Total Products',
			value: stats.products,
			icon: Package,
			color: colors.secondary,
		},
		{
			title: 'Total Projects',
			value: stats.projects,
			icon: FolderOpen,
			color: colors.accent,
		},
		{
			title: 'Best Sellers',
			value: stats.bestSellers,
			icon: Star,
			color: colors.primary,
		},
		{
			title: 'Coming Soon',
			value: stats.comingSoon,
			icon: Clock,
			color: colors.secondary,
		},
	];

	if (isLoading || loading) {
		return (
			<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{[1, 2, 3, 4, 5].map(i => (
						<Card key={i}>
							<CardContent className="p-6">
								<Skeleton className="mb-2 h-4 w-24" />
								<Skeleton className="mb-2 h-8 w-16" />
								<Skeleton className="h-4 w-12" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1
					className="text-3xl font-bold"
					style={{ color: colors.textPrimary }}
				>
					Dashboard Overview
				</h1>
				<p
					style={{ color: colors.textSecondary }}
				>
					Welcome back! Here&apos;s what&apos;s happening
					with your business today.
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card
							key={index}
							className="transition-shadow duration-200 hover:shadow-lg"
						>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p
											className="text-sm font-medium"
											style={{
												color:
													colors.textSecondary,
											}}
										>
											{stat.title}
										</p>
										<p
											className="text-3xl font-bold"
											style={{
												color: colors.textPrimary,
											}}
										>
											{stat.value}
										</p>
									</div>
									<div
										className="rounded-full p-3"
										style={{
											backgroundColor: `${stat.color}20`,
										}}
									>
										<Icon
											className="h-6 w-6"
											style={{
												color: stat.color,
											}}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Recent Data */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>
							Recent Enquiries
						</CardTitle>
						<CardDescription>
							Latest customer inquiries
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentEnquiries.length >
							0 ? (
								stats.recentEnquiries.map(
									(enq, i: number) => (
										<div
											key={i}
											className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3"
										>
											<div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
												<Users
													className="h-5 w-5"
													style={{
														color: colors.primary,
													}}
												/>
											</div>
											<div className="flex-1">
												<p
													className="font-medium"
													style={{
														color:
															colors.textPrimary,
													}}
												>
													{enq.name ||
														'Unknown'}
												</p>
												<p
													className="text-sm"
													style={{
														color:
															colors.textSecondary,
													}}
												>
													{enq.email || enq.phone || 'Contact info not available'}
												</p>
											</div>
											<Badge variant="secondary">
												{new Date(enq.createdAt || '').toLocaleDateString()}
											</Badge>
										</div>
									)
								)
							) : (
								<p className="text-sm text-gray-500">
									No enquiries yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Products</CardTitle>
						<CardDescription>
							Latest added products
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentProducts.length > 0 ? (
								stats.recentProducts.map(
									(product, i: number) => (
										<div
											key={i}
											className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
										>
											<div>
												<span
													className="font-medium"
													style={{
														color:
															colors.textPrimary,
													}}
												>
													{product.name ||
														'Unnamed Product'}
												</span>
												<p
													className="text-sm"
													style={{
														color:
															colors.textSecondary,
													}}
												>
													{product.category?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
												</p>
											</div>
											{product.isBestSeller && (
												<Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
													<Star className="h-3 w-3 mr-1" />
													Best Seller
												</Badge>
											)}
										</div>
									)
								)
							) : (
								<p className="text-sm text-gray-500">
									No products added yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Projects</CardTitle>
						<CardDescription>
							Latest completed projects
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentProjects.length > 0 ? (
								stats.recentProjects.map(
									(project, i: number) => (
										<div
											key={i}
											className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
										>
											<div>
												<span
													className="font-medium"
													style={{
														color:
															colors.textPrimary,
													}}
												>
													{project.title ||
														'Unnamed Project'}
												</span>
												<p
													className="text-sm"
													style={{
														color:
															colors.textSecondary,
													}}
												>
													{project.client || 'Client not specified'}
												</p>
											</div>
											<Badge variant="outline">
												{project.category?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
											</Badge>
										</div>
									)
								)
							) : (
								<p className="text-sm text-gray-500">
									No projects completed yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
