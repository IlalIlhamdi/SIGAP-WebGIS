import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface PhotoCaptureResult {
  dataUrl?: string;
  format?: string;
  error?: string;
  cancelled?: boolean;
}

// Compress data URL in web browser via HTML5 Canvas
export async function compressImageWeb(file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = maxHeight;
            height = Math.round((height * maxWidth) / width);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function pickOrCapturePhoto(source: 'camera' | 'photos' | 'prompt' = 'prompt'): Promise<PhotoCaptureResult> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Check permissions
      const perm = await Camera.checkPermissions();
      if (perm.camera !== 'granted' || perm.photos !== 'granted') {
        const req = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
        if (req.camera === 'denied' && req.photos === 'denied') {
          return {
            error: 'Izin kamera atau galeri ditolak. Mohon aktifkan izin di pengaturan aplikasi.',
          };
        }
      }

      let camSource = CameraSource.Prompt;
      if (source === 'camera') camSource = CameraSource.Camera;
      else if (source === 'photos') camSource = CameraSource.Photos;

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: camSource,
        width: 1280,
        height: 1280,
        correctOrientation: true,
        saveToGallery: false,
      });

      if (!image.dataUrl) {
        return { error: 'Gagal memproses data gambar dari kamera.' };
      }

      return {
        dataUrl: image.dataUrl,
        format: image.format,
      };
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('user cancelled')) {
        return { cancelled: true };
      }
      return {
        error: err?.message || 'Gagal mengambil foto menggunakan kamera perangkat.',
      };
    }
  }

  // Web fallback: programmatically trigger file input
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    if (source === 'camera') {
      input.capture = 'environment';
    }

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve({ cancelled: true });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        resolve({ error: 'Ukuran file foto terlalu besar (maksimal 10 MB).' });
        return;
      }

      try {
        const compressed = await compressImageWeb(file, 1280, 1280, 0.8);
        resolve({ dataUrl: compressed, format: file.type.replace('image/', '') });
      } catch (e: any) {
        resolve({ error: 'Gagal mengompresi gambar: ' + (e?.message || 'Error tidak diketahui') });
      }
    };

    input.oncancel = () => {
      resolve({ cancelled: true });
    };

    input.click();
  });
}
