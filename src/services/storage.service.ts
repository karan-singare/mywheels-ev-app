import { supabase } from '../config/supabase.constant';

export async function uploadImage(
  bucket: string,
  path: string,
  fileUri: string,
): Promise<string> {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { upsert: true });
  if (error) throw new Error(`Failed to upload image: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function getSignedUrl(
  bucket: string,
  path: string,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);
  if (error) throw new Error(`Failed to get signed URL: ${error.message}`);
  return data.signedUrl;
}

export async function deleteFile(
  bucket: string,
  path: string,
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  if (error) throw new Error(`Failed to delete file: ${error.message}`);
}
