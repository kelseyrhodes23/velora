import { Platform } from 'react-native';
import { supabase } from './supabase';

export async function uploadProfilePhoto(userId: string, uri: string): Promise<string | null> {
  // Get file extension
  const ext = uri.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${ext}`;
  const path = `${userId}/${fileName}`;

  // Fetch the file as a blob
  let file: Blob;
  if (Platform.OS === 'web') {
    const res = await fetch(uri);
    file = await res.blob();
  } else {
    // For React Native, use fetch and convert to blob
    const res = await fetch(uri);
    file = await res.blob();
  }

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: `image/${ext}`,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(data.path);

  return urlData?.publicUrl ?? null;
} 