import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Project, ProjectCategory } from '@/types';
import { colors } from '@/config/theme';
import { Upload, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectFormProps {
	project?: Project;
	onSubmit: (data: FormData) => Promise<void>;
	onClose: () => void;
	isOpen: boolean;
	isLoading: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
	project,
	onSubmit,
	onClose,
	isOpen,
	isLoading,
}) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: '',
		completedDate: '',
		client: '',
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
	const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

	useEffect(() => {
		if (project) {
			setFormData({
				title: project.title,
				description: project.description,
				category: project.category,
				completedDate: project.completedDate.split('T')[0], // Convert to YYYY-MM-DD format
				client: project.client,
			});
			setImagePreview(project.image);
			setGalleryPreviews(project.gallery);
		} else {
			setFormData({
				title: '',
				description: '',
				category: '',
				completedDate: '',
				client: '',
			});
			setImagePreview('');
			setGalleryPreviews([]);
			setImageFile(null);
			setGalleryFiles([]);
		}
	}, [project, isOpen]);

	const handleInputChange = (field: string, value: string) => {
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

	const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length > 0) {
			setGalleryFiles(prev => [...prev, ...files]);
			
			// Create previews for new files
			files.forEach(file => {
				const reader = new FileReader();
				reader.onload = () => {
					setGalleryPreviews(prev => [...prev, reader.result as string]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeGalleryImage = (index: number) => {
		setGalleryFiles(prev => prev.filter((_, i) => i !== index));
		setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.title || !formData.description || !formData.category || !formData.completedDate || !formData.client) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!imageFile && !imagePreview) {
			toast.error('Please select a main image');
			return;
		}

		const data = new FormData();
		data.append('title', formData.title);
		data.append('description', formData.description);
		data.append('category', formData.category);
		data.append('completedDate', formData.completedDate);
		data.append('client', formData.client);
		
		if (imageFile) {
			data.append('image', imageFile);
		}

		// Add gallery files
		galleryFiles.forEach((file) => {
			data.append(`gallery`, file);
		});

		try {
			await onSubmit(data);
			onClose();
		} catch (error) {
			console.error('Error submitting project:', error);
		}
	};

	const projectCategories = Object.values(ProjectCategory);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle style={{ color: colors.textPrimary }}>
						{project ? 'Edit Project' : 'Add New Project'}
					</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="title">Project Title *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => handleInputChange('title', e.target.value)}
								placeholder="Enter project title"
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="client">Client *</Label>
							<Input
								id="client"
								value={formData.client}
								onChange={(e) => handleInputChange('client', e.target.value)}
								placeholder="Enter client name"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
									{projectCategories.map((category) => (
										<SelectItem key={category} value={category}>
											{category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="completedDate">Completed Date *</Label>
							<Input
								id="completedDate"
								type="date"
								value={formData.completedDate}
								onChange={(e) => handleInputChange('completedDate', e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description *</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleInputChange('description', e.target.value)}
							placeholder="Enter project description"
							rows={4}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="image">Main Image *</Label>
						<div className="space-y-4">
							{imagePreview && (
								<div className="relative w-full h-48 border rounded-lg overflow-hidden">
									<Image
										src={imagePreview}
										alt="Project preview"
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

					<div className="space-y-2">
						<Label htmlFor="gallery">Gallery Images</Label>
						<div className="space-y-4">
							{galleryPreviews.length > 0 && (
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{galleryPreviews.map((preview, index) => (
										<div key={index} className="relative w-full h-32 border rounded-lg overflow-hidden">
											<Image
												src={preview}
												alt={`Gallery ${index + 1}`}
												fill
												className="object-cover"
											/>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="absolute top-1 right-1"
												onClick={() => removeGalleryImage(index)}
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
								</div>
							)}
							
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="gallery-upload"
									className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<Plus className="w-8 h-8 mb-4 text-gray-500" />
										<p className="mb-2 text-sm text-gray-500">
											<span className="font-semibold">Add gallery images</span>
										</p>
										<p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB each)</p>
									</div>
									<input
										id="gallery-upload"
										type="file"
										className="hidden"
										accept="image/*"
										multiple
										onChange={handleGalleryChange}
									/>
								</label>
							</div>
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
							{isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
