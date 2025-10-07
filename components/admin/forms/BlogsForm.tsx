'use client';

import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { colors } from '@/config/theme';

const BLOG_CATEGORIES = [
	{ value: 'WINDOW_TREATMENTS', label: 'Window Treatments' },
	{ value: 'INTERIOR_DESIGN', label: 'Interior Design' },
	{ value: 'HOME_DECOR', label: 'Home Decor' },
	{ value: 'DIY_TIPS', label: 'DIY Tips' },
	{ value: 'MAINTENANCE', label: 'Maintenance' },
	{ value: 'TRENDS', label: 'Trends' },
	{ value: 'PRODUCT_SPOTLIGHT', label: 'Product Spotlight' },
	{ value: 'CASE_STUDIES', label: 'Case Studies' },
	{ value: 'NEWS', label: 'News' },
	{ value: 'LIFESTYLE', label: 'Lifestyle' },
];

export interface BlogFormValues {
	title: string;
	category: string;
	author: string;
	excerpt: string;
	content: string;
	image: File | null;
	isPublished: boolean;
	isFeatured: boolean;
	tags: string;
	metaTitle: string;
	metaDescription: string;
}

interface BlogsFormProps {
	values: BlogFormValues;
	onChange: (values: BlogFormValues) => void;
	onSubmit: (formData: FormData) => void;
	onCancel?: () => void;
	submitting?: boolean;
}

export const BlogsForm: React.FC<
	BlogsFormProps
> = ({
	values,
	onChange,
	onSubmit,
	onCancel,
	submitting = false,
}) => {
	const fileInputRef =
		useRef<HTMLInputElement | null>(null);
	const [errors, setErrors] = useState<
		Record<string, string>
	>({});

	const handleChange = (
		field: keyof BlogFormValues,
		value: string | File | null | boolean
	) => {
		onChange({ ...values, [field]: value });
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!values.title.trim())
			newErrors.title = 'Title is required';
		if (!values.category.trim())
			newErrors.category = 'Category is required';
		if (!values.author.trim())
			newErrors.author = 'Author is required';
		if (!values.excerpt.trim()) {
			newErrors.excerpt = 'Excerpt is required';
		}
		if (!values.content.trim()) {
			newErrors.content = 'Content is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const formData = new FormData();
		formData.append('title', values.title);
		formData.append('category', values.category);
		formData.append('author', values.author);
		formData.append('excerpt', values.excerpt);
		formData.append('content', values.content);
		formData.append('isPublished', values.isPublished.toString());
		formData.append('isFeatured', values.isFeatured.toString());
		formData.append('tags', values.tags);
		formData.append('metaTitle', values.metaTitle);
		formData.append('metaDescription', values.metaDescription);

		if (values.image) {
			formData.append('image', values.image);
		}

		onSubmit(formData);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 max-w-full"
		>
			{/* Basic Information Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
				
				{/* Title */}
				<div>
					<label className="mb-1 block text-sm font-medium">
						Title
					</label>
					<Input
						value={values.title}
						onChange={e =>
							handleChange('title', e.target.value)
						}
						placeholder="Enter blog title"
						className={
							errors.title ? 'border-red-500' : ''
						}
					/>
					{errors.title && (
						<p className="mt-1 text-xs text-red-500">
							{errors.title}
						</p>
					)}
				</div>

				{/* Category and Author Row */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="mb-1 block text-sm font-medium">
							Category
						</label>
						<Select
							value={values.category}
							onValueChange={(value) => handleChange('category', value)}
						>
							<SelectTrigger className={errors.category ? 'border-red-500' : ''}>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{BLOG_CATEGORIES.map((category) => (
									<SelectItem key={category.value} value={category.value}>
										{category.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.category && (
							<p className="mt-1 text-xs text-red-500">
								{errors.category}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">
							Author
						</label>
						<Input
							value={values.author}
							onChange={e =>
								handleChange('author', e.target.value)
							}
							placeholder="Author name"
							className={
								errors.author ? 'border-red-500' : ''
							}
						/>
						{errors.author && (
							<p className="mt-1 text-xs text-red-500">
								{errors.author}
							</p>
						)}
					</div>
				</div>

			</div>

			{/* Content Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b pb-2">Content</h3>
				
				{/* Excerpt */}
				<div>
					<label className="mb-1 block text-sm font-medium">
						Excerpt
					</label>
					<Textarea
						value={values.excerpt}
						onChange={e =>
							handleChange(
								'excerpt',
								e.target.value
							)
						}
						placeholder="Short summary or description"
						rows={3}
						className={`resize-y break-words ${errors.excerpt ? 'border-red-500' : ''}`}
					/>
					{errors.excerpt && (
						<p className="mt-1 text-xs text-red-500">
							{errors.excerpt}
						</p>
					)}
				</div>

				{/* Content */}
				<div>
					<label className="mb-1 block text-sm font-medium">
						Content
					</label>
					<Textarea
						value={values.content}
						onChange={e =>
							handleChange(
								'content',
								e.target.value
							)
						}
						placeholder="Write your blog content here..."
						rows={6}
						className={`resize-y break-words ${errors.content ? 'border-red-500' : ''}`}
					/>
					{errors.content && (
						<p className="mt-1 text-xs text-red-500">
							{errors.content}
						</p>
					)}
				</div>
			</div>

			{/* Media & Settings Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b pb-2">Media & Settings</h3>
				
				{/* Image File */}
				<div>
					<label className="mb-1 block text-sm font-medium">
						Image
					</label>
					<Input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={e =>
							handleChange(
								'image',
								e.target.files
									? e.target.files[0]
									: null
							)
						}
					/>
					{values.image && (
						<p className="mt-1 text-xs break-words text-gray-500">
							Selected: {values.image.name}
						</p>
					)}
				</div>

				{/* Status Controls */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex items-center space-x-2">
						<Switch
							id="isPublished"
							checked={values.isPublished}
							onCheckedChange={(checked) => handleChange('isPublished', checked)}
						/>
						<label htmlFor="isPublished" className="text-sm font-medium">
							Published
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<Switch
							id="isFeatured"
							checked={values.isFeatured}
							onCheckedChange={(checked) => handleChange('isFeatured', checked)}
						/>
						<label htmlFor="isFeatured" className="text-sm font-medium">
							Featured
						</label>
					</div>
				</div>

				{/* Tags */}
				<div>
					<label className="mb-1 block text-sm font-medium">
						Tags
					</label>
					<Input
						value={values.tags}
						onChange={e =>
							handleChange('tags', e.target.value)
						}
						placeholder="Enter tags separated by commas (e.g., nutrition, health, tips)"
						className={errors.tags ? 'border-red-500' : ''}
					/>
					<p className="mt-1 text-xs text-gray-500">
						Separate multiple tags with commas
					</p>
				</div>
			</div>

			{/* SEO Fields */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b pb-2">SEO Settings</h3>
				
				<div>
					<label className="mb-1 block text-sm font-medium">
						Meta Title
					</label>
					<Input
						value={values.metaTitle}
						onChange={e =>
							handleChange('metaTitle', e.target.value)
						}
						placeholder="SEO title for search engines"
						className={errors.metaTitle ? 'border-red-500' : ''}
					/>
					<p className="mt-1 text-xs text-gray-500">
						{values.metaTitle.length}/60 characters
					</p>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">
						Meta Description
					</label>
					<Textarea
						value={values.metaDescription}
						onChange={e =>
							handleChange('metaDescription', e.target.value)
						}
						placeholder="SEO description for search engines"
						rows={3}
						className={`resize-y ${errors.metaDescription ? 'border-red-500' : ''}`}
					/>
					<p className="mt-1 text-xs text-gray-500">
						{values.metaDescription.length}/160 characters
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					disabled={submitting}
					className="w-full sm:w-auto"
					style={{
						backgroundColor: colors.primary,
						color: '#fff',
					}}
				>
					{submitting ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
							Saving...
						</>
					) : (
						'Save Blog'
					)}
				</Button>
			</div>
		</form>
	);
};
