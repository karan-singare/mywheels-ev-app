import { supabase } from '../config/supabase.constant';
import { decode } from 'base64-arraybuffer';

export async function uploadImageBase64(
  bucket: string,
  path: string,
  base64: string,
  contentType: string,
): Promise<string> {
  console.log('[storage] uploadImageBase64 start', { bucket, path, base64Length: base64.length, contentType });

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, decode(base64), { upsert: true, contentType });

  if (error) {
    console.error('[storage] upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  console.log('[storage] upload success:', data);

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
  if (error) {
    console.warn('[storage] signedUrl not found:', path);
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
