import { Capacitor } from '@capacitor/core';
import { Network, type ConnectionStatus } from '@capacitor/network';

export interface AppNetworkStatus {
  connected: boolean;
  connectionType: string;
}

export async function getNetworkStatus(): Promise<AppNetworkStatus> {
  if (Capacitor.isNativePlatform()) {
    try {
      const status: ConnectionStatus = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType,
      };
    } catch {
      // Fallback
    }
  }

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  return {
    connected: isOnline,
    connectionType: isOnline ? 'web-unknown' : 'none',
  };
}

export function subscribeNetworkStatus(callback: (status: AppNetworkStatus) => void): () => void {
  let isNative = Capacitor.isNativePlatform();

  if (isNative) {
    let handlePromise = Network.addListener('networkStatusChange', (status) => {
      callback({
        connected: status.connected,
        connectionType: status.connectionType,
      });
    });

    return () => {
      handlePromise.then(handle => handle.remove()).catch(() => {});
    };
  }

  // Web fallback
  const handleOnline = () => callback({ connected: true, connectionType: 'web-online' });
  const handleOffline = () => callback({ connected: false, connectionType: 'none' });

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
