'use client';

import {
	useState,
	useEffect,
	useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import {
	setCookie,
	destroyCookie,
	parseCookies,
} from 'nookies';

export function useAuth() {
	const [user, setUser] = useState<User | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				console.error(error.message);
				setUser(null);
				destroyCookie(null, 'sb-access-token');
			} else {
				setUser(session?.user ?? null);
				if (session?.access_token) {
					setCookie(
						null,
						'sb-access-token',
						session.access_token,
						{
							maxAge: 60 * 60 * 24 * 7, // 7 days
							path: '/',
							secure:
								process.env.NODE_ENV ===
								'production',
							sameSite: 'strict',
						}
					);
				}
			}
			setLoading(false);
		};

		getUser();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
				if (session?.access_token) {
					setCookie(
						null,
						'sb-access-token',
						session.access_token,
						{
							maxAge: 60 * 60 * 24 * 7,
							path: '/',
							secure:
								process.env.NODE_ENV ===
								'production',
							sameSite: 'strict',
						}
					);
				} else {
					destroyCookie(null, 'sb-access-token');
				}
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	// Login
	const login = useCallback(
		async (email: string, password: string) => {
			const { data, error } =
				await supabase.auth.signInWithPassword({
					email,
					password,
				});

			if (error) throw new Error(error.message);

			setUser(data.user);

			if (data.session?.access_token) {
				setCookie(
					null,
					'sb-access-token',
					data.session.access_token,
					{
						maxAge: 60 * 60 * 24 * 7,
						path: '/',
						secure:
							process.env.NODE_ENV ===
							'production',
						sameSite: 'strict',
					}
				);
			}
		},
		[]
	);

	// Logout
	const logout = useCallback(async () => {
		const { error } =
			await supabase.auth.signOut();
		if (error) throw new Error(error.message);

		setUser(null);
		destroyCookie(null, 'sb-access-token', {
			path: '/',
		});
		setCookie(null, 'sb-access-token', '', {
			maxAge: -1,
			path: '/',
		});
		router.push('/super-admin/login');
	}, []);

	return {
		user,
		isAuthenticated: !!user,
		loading,
		login,
		logout,
	};
}