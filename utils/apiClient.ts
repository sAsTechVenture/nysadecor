import { supabase } from './supabaseClient';

export const API_BASE = '/api/v1';

async function authenticatedRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	// Get the current session
	const { data: { session } } = await supabase.auth.getSession();
	
	if (!session) {
		throw new Error('No active session');
	}

	const res = await fetch(
		`${API_BASE}${endpoint}`,
		{
			headers: {
				...(options.body instanceof FormData
					? {}
					: {
							'Content-Type': 'application/json',
						}),
				'Authorization': `Bearer ${session.access_token}`,
			},
			...options,
		}
	);

	if (!res.ok) {
		let errorMessage = 'API Error';
		try {
			const error = await res.json();
			errorMessage = error.error || errorMessage;
		} catch {
			// If response is not JSON, use status text or default message
			errorMessage = res.statusText || `HTTP ${res.status} Error`;
		}
		throw new Error(errorMessage);
	}
	return res.json();
}

// Public request function (no auth required)
async function publicRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const res = await fetch(
		`${API_BASE}${endpoint}`,
		{
			headers: {
				...(options.body instanceof FormData
					? {}
					: {
							'Content-Type': 'application/json',
						}),
			},
			...options,
		}
	);

	if (!res.ok) {
		let errorMessage = 'API Error';
		try {
			const error = await res.json();
			errorMessage = error.error || errorMessage;
		} catch {
			// If response is not JSON, use status text or default message
			errorMessage = res.statusText || `HTTP ${res.status} Error`;
		}
		throw new Error(errorMessage);
	}
	return res.json();
}

export const api = {
	enquiries: {
		list: (page = 1, limit = 10, search?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			return publicRequest<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(
				`/enquiries?${params.toString()}`,
				{
					method: 'GET',
				}
			);
		},
		create: (data: any) => {
			return publicRequest<any>('/enquiries', {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		get: (id: string) =>
			publicRequest<any>(`/enquiries/${id}`, {
				method: 'GET',
			}),
		delete: (id: string) =>
			authenticatedRequest<any>(`/enquiries/${id}`, {
				method: 'DELETE',
			}),
	},
	products: {
		list: (page = 1, limit = 10, search?: string, category?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (category) {
				params.append('category', category);
			}
			return publicRequest<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/products?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			publicRequest<any>(`/products/${id}`, {
				method: 'GET',
			}),
		create: (data: FormData) =>
			authenticatedRequest<any>('/products', {
				method: 'POST',
				body: data,
			}),
		update: (id: string, data: FormData) =>
			authenticatedRequest<any>(`/products/${id}`, {
				method: 'PUT',
				body: data,
			}),
		delete: (id: string) =>
			authenticatedRequest<any>(`/products/${id}`, {
				method: 'DELETE',
			}),
		toggleStatus: (id: string, isBestSeller?: boolean, isComingSoon?: boolean) =>
			authenticatedRequest<any>(`/products/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ isBestSeller, isComingSoon }),
			}),
	},
	projects: {
		list: (page = 1, limit = 10, search?: string, category?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (category) {
				params.append('category', category);
			}
			return publicRequest<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/projects?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			publicRequest<any>(`/projects/${id}`, {
				method: 'GET',
			}),
		create: (data: FormData) =>
			authenticatedRequest<any>('/projects', {
				method: 'POST',
				body: data,
			}),
		update: (id: string, data: FormData) =>
			authenticatedRequest<any>(`/projects/${id}`, {
				method: 'PUT',
				body: data,
			}),
		delete: (id: string) =>
			authenticatedRequest<any>(`/projects/${id}`, {
				method: 'DELETE',
			}),
	},
	blog: {
		list: (page = 1, limit = 10, search?: string, category?: string, published = true, featured?: boolean) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				published: published.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (category) {
				params.append('category', category);
			}
			if (featured !== undefined) {
				params.append('featured', featured.toString());
			}
			return authenticatedRequest<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/blogs?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			authenticatedRequest<any>(`/blogs/${id}`, {
				method: 'GET',
			}),
		getBySlug: (slug: string) =>
			authenticatedRequest<any>(`/blogs/slug/${slug}`, {
				method: 'GET',
			}),
		create: (data: FormData) =>
			authenticatedRequest<any>('/blogs', {
				method: 'POST',
				body: data,
			}),
		update: (id: string, data: FormData) =>
			authenticatedRequest<any>(`/blogs/${id}`, {
				method: 'PUT',
				body: data,
			}),
		delete: (id: string) =>
			authenticatedRequest<any>(`/blogs/${id}`, {
				method: 'DELETE',
			}),
		toggleStatus: (id: string, isPublished?: boolean, isFeatured?: boolean) =>
			authenticatedRequest<any>(`/blogs/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ isPublished, isFeatured }),
			}),
		featured: (limit = 6) =>
			authenticatedRequest<{
				data: any[];
				total: number;
			}>(`/blogs/featured?limit=${limit}`, {
				method: 'GET',
			}),
		recent: (limit = 6) =>
			authenticatedRequest<{
				data: any[];
				total: number;
			}>(`/blogs/recent?limit=${limit}`, {
				method: 'GET',
			}),
	},
	blogs: {
		list: (page = 1, limit = 10, search?: string, category?: string, published?: boolean) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (category) {
				params.append('category', category);
			}
			if (published !== undefined) {
				params.append('published', published.toString());
			}
			return publicRequest<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/blogs?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			publicRequest<any>(`/blogs/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			authenticatedRequest<any>('/blogs', {
				method: 'POST',
				body: data instanceof FormData ? data : JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			authenticatedRequest<any>(`/blogs/${id}`, {
				method: 'PUT',
				body: data instanceof FormData ? data : JSON.stringify(data),
			}),
		delete: (id: string) =>
			authenticatedRequest<any>(`/blogs/${id}`, {
				method: 'DELETE',
			}),
	},
};
