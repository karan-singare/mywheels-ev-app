import { supabase } from '../config/supabase.constant';

export async function uploadImage(
  bucket: string,
  path: string,
  fileUri: string,
): Promise<string> {
  console.log('[storage] uploadImage start', { bucket, path, fileUri: fileUri.substring(0, 80) });

  const response = await fetch(fileUri);
  console.log('[storage] fetch response status:', response.status, 'ok:', response.ok);

  const blob = await response.blob();
  console.log('[storage] blob size:', blob.size, 'type:', blob.type);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });

  if (error) {
    console.error('[storage] upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  console.log('[storage] upload success:', data);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  console.log('[storage] publicUrl:', urlData.publicUrl);
  return urlData.publicUrl;
}

export async function getSignedUrl(
  bucket: string,
  path: string,
): Promise<string> {
  console.log('[storage] getSignedUrl', { bucket, path });
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);
  if (error) {
    console.error('[storage] signedUrl error:', error);
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }
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
