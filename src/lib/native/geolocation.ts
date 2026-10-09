import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
}

export interface LocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN';
  message: string;
}

export async function getCurrentCoordinates(): Promise<{ coords?: LocationResult; error?: LocationError }> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Check & request runtime permissions
      let perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        perm = await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
      }

      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        return {
          error: {
            code: 'PERMISSION_DENIED',
            message: 'Izin akses lokasi ditolak oleh perangkat. Mohon izinkan lokasi di pengaturan perangkat untuk mendeteksi posisi otomatis.',
          },
        };
      }

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      });

      return {
        coords: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
        },
      };
    } catch (err: any) {
      console.warn('[Native Geolocation] Error:', err);
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('permission')) {
        return {
          error: {
            code: 'PERMISSION_DENIED',
            message: 'Izin akses lokasi ditolak. Anda dapat mengaktifkannya di setelan aplikasi atau memilih titik di peta.',
          },
        };
      }
      if (msg.toLowerCase().includes('disabled') || msg.toLowerCase().includes('location services') || msg.toLowerCase().includes('gps')) {
        return {
          error: {
            code: 'POSITION_UNAVAILABLE',
            message: 'Layanan GPS / Lokasi perangkat sedang nonaktif. Silakan aktifkan GPS perangkat Anda atau pilih titik manual.',
          },
        };
      }
      if (msg.toLowerCase().includes('timeout')) {
        return {
          error: {
            code: 'TIMEOUT',
            message: 'Pencarian sinyal GPS melebihi batas waktu (timeout). Pastikan Anda berada di area dengan visibilitas langit terbuka atau gunakan titik manual.',
          },
        };
      }
      return {
        error: {
          code: 'UNKNOWN',
          message: err?.message || 'Gagal membaca sensor GPS perangkat.',
        },
      };
    }
  }

  // Web Browser fallback
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return {
      error: {
        code: 'POSITION_UNAVAILABLE',
        message: 'Peramban web tidak mendukung fitur pendeteksian lokasi GPS.',
      },
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
          },
        });
      },
      (err) => {
        let code: LocationError['code'] = 'UNKNOWN';
        let message = 'Gagal mendeteksi lokasi.';

        if (err.code === err.PERMISSION_DENIED) {
          code = 'PERMISSION_DENIED';
          message = 'Izin lokasi ditolak oleh peramban web.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          code = 'POSITION_UNAVAILABLE';
          message = 'Sinyal lokasi atau GPS perangkat tidak tersedia.';
        } else if (err.code === err.TIMEOUT) {
          code = 'TIMEOUT';
          message = 'Waktu permintaan lokasi habis (timeout). Coba lagi atau pilih titik manual.';
        }

        resolve({ error: { code, message } });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
  });
}
