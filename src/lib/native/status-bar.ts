import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export async function initStatusBar(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Style.Dark means dark background -> light/white icons (clock, battery)
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0D653A' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (err) {
    console.warn('[StatusBar] Init status bar ignored:', err);
  }
}
