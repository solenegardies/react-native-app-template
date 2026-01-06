import { supabase } from './auth/supabase';
import * as ImagePicker from 'expo-image-picker';

export async function uploadImage(
  bucket: string,
  path: string,
  uri: string
): Promise<string | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

export async function pickAndUploadImage(
  bucket: string,
  userId: string
): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;

  const uri = result.assets[0]?.uri;
  if (!uri) return null;

  const path = `${userId}/${Date.now()}.jpg`;

  return uploadImage(bucket, path, uri);
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
}
