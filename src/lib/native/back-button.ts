import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

type BackButtonHandler = () => boolean | void;

interface HandlerEntry {
  id: string;
  priority: number;
  handler: BackButtonHandler;
}

const handlers: HandlerEntry[] = [];
let isInitialized = false;
let lastBackPressTime = 0;
let exitToastTimer: any = null;

export function registerBackButtonHandler(handler: BackButtonHandler, priority = 10): () => void {
  const id = `handler-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  handlers.push({ id, priority, handler });
  handlers.sort((a, b) => b.priority - a.priority);

  return () => {
    const idx = handlers.findIndex(h => h.id === id);
    if (idx !== -1) {
      handlers.splice(idx, 1);
    }
  };
}

export function initGlobalBackButton(options: {
  getCurrentPath: () => string;
  goBack: () => void;
  goToDashboard: () => void;
  showToast?: (message: string) => void;
}): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  if (isInitialized) {
    return () => {};
  }
  isInitialized = true;

  const backListenerPromise = App.addListener('backButton', ({ canGoBack }) => {
    // 1. Try custom active handlers (e.g. modals, drawers, search dropdowns)
    for (const entry of handlers) {
      const consumed = entry.handler();
      if (consumed !== false) {
        return; // Consumed by top handler
      }
    }

    const currentPath = options.getCurrentPath();
    const isRoot = currentPath === '/' || currentPath === '/dashboard';

    // 2. If not root, go back in history
    if (!isRoot) {
      options.goBack();
      return;
    }

    // 3. Double-tap back button to exit on root
    const now = Date.now();
    if (now - lastBackPressTime < 2000) {
      App.exitApp();
    } else {
      lastBackPressTime = now;
      if (options.showToast) {
        options.showToast('Tekan tombol kembali sekali lagi untuk keluar dari SIGAP.');
      } else {
        // Fallback transient banner
        showTransientExitBanner();
      }
    }
  });

  return () => {
    isInitialized = false;
    backListenerPromise.then(handle => handle.remove()).catch(() => {});
  };
}

function showTransientExitBanner() {
  const existing = document.getElementById('sigap-exit-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'sigap-exit-toast';
  toast.innerText = 'Tekan sekali lagi untuk keluar dari aplikasi SIGAP';
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(13, 101, 58, 0.92)';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '9999px';
  toast.style.fontSize = '12px';
  toast.style.fontWeight = '700';
  toast.style.zIndex = '99999';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
  toast.style.pointerEvents = 'none';
  toast.style.transition = 'opacity 0.2s ease';

  document.body.appendChild(toast);
  clearTimeout(exitToastTimer);
  exitToastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 2000);
}
