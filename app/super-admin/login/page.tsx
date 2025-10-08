'use client';
import React, {
	useState,
	ChangeEvent,
	MouseEvent,
} from 'react';
import {
	Alert,
	AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Eye,
	EyeOff,
	Shield,
	AlertCircle,
	CheckCircle,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

interface FormData {
	email: string;
	password: string;
}

interface AlertState {
	type: 'success' | 'error' | 'info';
	message: string;
}

export default function AdminLogin(): React.ReactElement {
	const { login } = useAuth();
	const [formData, setFormData] =
		useState<FormData>({
			email: '',
			password: '',
		});
	const [showPassword, setShowPassword] =
		useState<boolean>(false);
	const [isLoading, setIsLoading] =
		useState<boolean>(false);
	const [alert, setAlert] =
		useState<AlertState | null>(null);

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>
	): void => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLButtonElement>
	): Promise<void> => {
		e.preventDefault();
		setIsLoading(true);
		setAlert(null);

		try {
			await login(
				formData.email,
				formData.password
			);
			setAlert({
				type: 'success',
				message:
					'Login successful! Redirecting...',
			});
			window.location.reload();
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
			setAlert({
				type: 'error',
				message: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="flex min-h-screen items-center justify-center p-4"
			style={{ backgroundColor: '#f8f9fa' }}
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 25% 25%, #48468a 2px, transparent 2px)`,
						backgroundSize: '50px 50px',
					}}
				></div>
			</div>

			<div className="relative z-10 w-full max-w-md">
				{/* Header Section */}
				<div className="mb-8 text-center">
					<div
						className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
						style={{
							backgroundColor: '#48468a',
						}}
					>
						<Shield className="h-8 w-8 text-white" />
					</div>
					<h1
						className="mb-2 text-3xl font-bold"
						style={{ color: '#1f2937' }}
					>
						Admin Portal
					</h1>
					<p
						className="text-sm"
						style={{
							color: '#6b7280',
						}}
					>
						Sign in to access the administration
						dashboard
					</p>
				</div>

				{/* Login Card */}
				<Card
					className="border-0 shadow-lg"
					style={{
						backgroundColor: '#ffffff',
					}}
				>
					<CardHeader className="space-y-1 pb-6">
						<CardTitle
							className="text-center text-2xl font-semibold"
							style={{
								color: '#1f2937',
							}}
						>
							Welcome Back
						</CardTitle>
						<CardDescription
							className="text-center"
							style={{
								color: '#6b7280',
							}}
						>
							Please enter your credentials to
							continue
						</CardDescription>
					</CardHeader>

					<CardContent>
						{/* Alert Messages */}
						{alert && (
							<Alert
								className={`mb-4 border ${
									alert.type === 'error'
										? 'border-red-200 bg-red-50'
										: alert.type === 'success'
											? 'border-green-200 bg-green-50'
											: 'border-blue-200 bg-blue-50'
								}`}
							>
								{alert.type === 'error' && (
									<AlertCircle
										className="h-4 w-4"
										style={{ color: '#ef4444' }}
									/>
								)}
								{alert.type === 'success' && (
									<CheckCircle
										className="h-4 w-4"
										style={{
											color: '#22c55e',
										}}
									/>
								)}
								<AlertDescription
									style={{
										color:
											alert.type === 'error'
												? '#ef4444'
												: alert.type === 'success'
													? '#22c55e'
													: '#3b82f6',
									}}
								>
									{alert.message}
								</AlertDescription>
							</Alert>
						)}

						<div className="space-y-6">
							{/* Email Field */}
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium"
									style={{
										color: '#1f2937',
									}}
								>
									Email Address
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="admin@example.com"
									value={formData.email}
									onChange={handleInputChange}
									className="h-12 border-2 transition-colors duration-200"
									style={{
										borderColor: '#e5e7eb',
										color: '#1f2937',
									}}
									onFocus={e =>
										(e.target.style.borderColor =
											'#48468a')
									}
									onBlur={e =>
										(e.target.style.borderColor =
											'#e5e7eb')
									}
									required
								/>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium"
									style={{
										color: '#1f2937',
									}}
								>
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={
											showPassword
												? 'text'
												: 'password'
										}
										placeholder="Enter your password"
										value={formData.password}
										onChange={handleInputChange}
										className="h-12 border-2 pr-12 transition-colors duration-200"
										style={{
											borderColor: '#e5e7eb',
											color: '#1f2937',
										}}
										onFocus={e =>
											(e.target.style.borderColor =
												'#48468a')
										}
										onBlur={e =>
											(e.target.style.borderColor =
												'#e5e7eb')
										}
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(
												!showPassword
											)
										}
										className="absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200"
										style={{
											color: '#6b7280',
										}}
										onMouseEnter={(
											e: MouseEvent<HTMLButtonElement>
										) => {
											(
												e.target as HTMLButtonElement
											).style.color =
												'#48468a';
										}}
										onMouseLeave={(
											e: MouseEvent<HTMLButtonElement>
										) => {
											(
												e.target as HTMLButtonElement
											).style.color =
												'#6b7280';
										}}
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								{/* <div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="remember"
										className="h-4 w-4 rounded border-2 transition-colors duration-200"
										style={{
											borderColor: '#e5e7eb',
											accentColor: '#48468a',
										}}
									/>
									<Label
										htmlFor="remember"
										className="cursor-pointer text-sm"
										style={{
											color: '#6b7280',
										}}
									>
										Remember me
									</Label>
								</div> */}
								<a
									href="#"
									className="text-sm font-medium transition-colors duration-200"
									style={{
										color: '#48468a',
									}}
									onMouseEnter={(
										e: MouseEvent<HTMLAnchorElement>
									) => {
										(
											e.target as HTMLAnchorElement
										).style.color =
											'#1f2937';
									}}
									onMouseLeave={(
										e: MouseEvent<HTMLAnchorElement>
									) => {
										(
											e.target as HTMLAnchorElement
										).style.color =
											'#48468a';
									}}
								>
									Forgot password?
								</a>
							</div>

							{/* Login Button */}
							<Button
								type="submit"
								onClick={handleSubmit}
								disabled={isLoading}
								className="h-12 w-full cursor-pointer font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
								style={{
									backgroundColor: '#48468a',
									borderColor: '#48468a',
								}}
								onMouseEnter={e => {
									if (!isLoading) {
										(
											e.target as HTMLButtonElement
										).style.backgroundColor =
											'#005a43';
									}
								}}
								onMouseLeave={e => {
									if (!isLoading) {
										(
											e.target as HTMLButtonElement
										).style.backgroundColor =
											'#48468a';
									}
								}}
							>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									</div>
								) : (
									'Sign In'
								)}
							</Button>
						</div>

						{/* Demo Credentials */}
						<div
							className="mt-6 rounded-lg p-4"
							style={{
								backgroundColor: '#f8f9fa',
							}}
						>
							<p
								className="mb-2 text-xs font-medium"
								style={{
									color: '#6b7280',
								}}
							>
								Demo Credentials:
							</p>
							<p
								className="text-xs"
								style={{
									color: '#6b7280',
								}}
							>
								Email: admin@example.com
							</p>
							<p
								className="text-xs"
								style={{
									color: '#6b7280',
								}}
							>
								Password: password
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center">
					<p
						className="text-xs"
						style={{
							color: '#6b7280',
						}}
					>
						© 2025 Admin Portal. All rights
						reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
