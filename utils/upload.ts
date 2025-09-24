import { supabaseAdmin } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload image to a specific Supabase Storage bucket
 *
 * Path format: {bucket}/{entityId}/{uuid}.{ext}
 *
 * @param file - The image file to upload
 * @param bucket - The bucket name ("meals" | "blogs" | etc.)
 * @param entityId - The related entity ID (mealId, blogId, etc.)
 */
export async function uploadImage(
	file: File,
	bucket: string,
	entityId: string
) {
	const ext = file.name.split('.').pop();
	const filePath = `${bucket}/${entityId}/${uuidv4()}.${ext}`;

	const { error } = await supabaseAdmin.storage
		.from(bucket)
		.upload(filePath, file, { upsert: true });

	if (error) throw new Error(error.message);

	const { data } = supabaseAdmin.storage
		.from(bucket)
		.getPublicUrl(filePath);

	return { filePath, publicUrl: data.publicUrl };
}

/**
 * Delete image from a specific Supabase Storage bucket
 *
 * @param bucket - The bucket name
 * @param filePath - Full path of the file to delete
 */
export async function deleteImage(
	bucket: string,
	filePath: string
) {
	if (!filePath) return;

	const { error } = await supabaseAdmin.storage
		.from(bucket)
		.remove([filePath]);

	if (error) throw new Error(error.message);
}