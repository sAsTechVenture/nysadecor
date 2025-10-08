import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Product, ProductCategory } from '@/types';
import { colors } from '@/config/theme';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductFormProps {
	product?: Product;
	onSubmit: (data: FormData) => Promise<void>;
	onClose: () => void;
	isOpen: boolean;
	isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
	product,
	onSubmit,
	onClose,
	isOpen,
	isLoading,
}) => {
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		description: '',
		category: '',
		isBestSeller: false,
		isComingSoon: false,
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				price: product.price.toString(),
				description: product.description,
				category: product.category,
				isBestSeller: product.isBestSeller,
				isComingSoon: product.isComingSoon,
			});
			setImagePreview(product.image);
		} else {
			setFormData({
				name: '',
				price: '',
				description: '',
				category: '',
				isBestSeller: false,
				isComingSoon: false,
			});
			setImagePreview('');
			setImageFile(null);
		}
	}, [product, isOpen]);

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.name || !formData.price || !formData.description || !formData.category) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!imageFile && !imagePreview) {
			toast.error('Please select an image');
			return;
		}

		const data = new FormData();
		data.append('name', formData.name);
		data.append('price', formData.price);
		data.append('description', formData.description);
		data.append('category', formData.category);
		data.append('isBestSeller', formData.isBestSeller.toString());
		data.append('isComingSoon', formData.isComingSoon.toString());
		
		if (imageFile) {
			data.append('image', imageFile);
		}

		try {
			await onSubmit(data);
			onClose();
		} catch (error) {
			console.error('Error submitting product:', error);
		}
	};

	const productCategories = Object.values(ProductCategory);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle style={{ color: colors.textPrimary }}>
						{product ? 'Edit Product' : 'Add New Product'}
					</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Product Name *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								placeholder="Enter product name"
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="price">Price *</Label>
							<Input
								id="price"
								type="number"
								step="0.01"
								value={formData.price}
								onChange={(e) => handleInputChange('price', e.target.value)}
								placeholder="0.00"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">Category *</Label>
						<Select
							value={formData.category}
							onValueChange={(value) => handleInputChange('category', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{productCategories.map((category) => (
									<SelectItem key={category} value={category}>
										{category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description *</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleInputChange('description', e.target.value)}
							placeholder="Enter product description"
							rows={4}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="image">Product Image *</Label>
						<div className="space-y-4">
							{imagePreview && (
								<div className="relative w-full h-48 border rounded-lg overflow-hidden">
									<Image
										src={imagePreview}
										alt="Product preview"
										fill
										className="object-cover"
									/>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										className="absolute top-2 right-2"
										onClick={() => {
											setImagePreview('');
											setImageFile(null);
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							)}
							
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="image-upload"
									className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<Upload className="w-8 h-8 mb-4 text-gray-500" />
										<p className="mb-2 text-sm text-gray-500">
											<span className="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
									</div>
									<input
										id="image-upload"
										type="file"
										className="hidden"
										accept="image/*"
										onChange={handleImageChange}
									/>
								</label>
							</div>
						</div>
					</div>

					<div className="flex space-x-6">
						<div className="flex items-center space-x-2">
							<Switch
								id="isBestSeller"
								checked={formData.isBestSeller}
								onCheckedChange={(checked) => handleInputChange('isBestSeller', checked)}
							/>
							<Label htmlFor="isBestSeller">Best Seller</Label>
						</div>
						
						<div className="flex items-center space-x-2">
							<Switch
								id="isComingSoon"
								checked={formData.isComingSoon}
								onCheckedChange={(checked) => handleInputChange('isComingSoon', checked)}
							/>
							<Label htmlFor="isComingSoon">Coming Soon</Label>
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							style={{ backgroundColor: colors.primary }}
						>
							{isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
