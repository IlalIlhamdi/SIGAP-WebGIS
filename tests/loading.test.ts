import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('SIGAP Loading & Async Resilience Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Angka 0 tidak muncul sebelum data selesai (No Zero Flashing)', () => {
    it('does not evaluate metric counts to 0 while initial load is pending', () => {
      // Simulate dashboard / indicator state model
      type State = {
        isLoading: boolean;
        isRefreshing: boolean;
        data: Array<{ id: string; name: string }> | null;
        error: string | null;
      };

      const pendingState: State = {
        isLoading: true,
        isRefreshing: false,
        data: null,
        error: null,
      };

      // Helper function matching the pattern in DashboardPage / EvacuationPage
      const getDisplayedCount = (state: State): { showSkeleton: boolean; displayValue: number | null } => {
        if (state.isLoading && state.data === null) {
          return { showSkeleton: true, displayValue: null };
        }
        return { showSkeleton: false, displayValue: state.data?.length ?? 0 };
      };

      const result = getDisplayedCount(pendingState);
      expect(result.showSkeleton).toBe(true);
      expect(result.displayValue).toBeNull();
      // Crucial: Value is NOT 0 before data resolves
      expect(result.displayValue).not.toBe(0);
    });

    it('distinguishes between empty state (valid 0 items) and loading state', () => {
      type State = {
        isLoading: boolean;
        data: any[];
      };

      const resolveUIState = (state: State) => {
        if (state.isLoading) return 'SKELETON_LOADING';
        if (state.data.length === 0) return 'EMPTY_STATE';
        return 'DATA_READY';
      };

      // When loading with empty initial array: MUST render skeleton, NOT empty state
      expect(resolveUIState({ isLoading: true, data: [] })).toBe('SKELETON_LOADING');
      // When resolved with 0 items: only then render EMPTY_STATE
      expect(resolveUIState({ isLoading: false, data: [] })).toBe('EMPTY_STATE');
      // When resolved with items: render DATA_READY
      expect(resolveUIState({ isLoading: false, data: [{ id: 1 }] })).toBe('DATA_READY');
    });
  });

  describe('2. Error mengakhiri loading (Error terminates loading gracefully)', () => {
    it('always resets isLoading and isRefreshing to false via finally block on network error', async () => {
      let isLoading = false;
      let isRefreshing = false;
      let error: string | null = null;
      let data: string[] = [];

      const mockFetchWithError = vi.fn().mockRejectedValue(new Error('Koneksi internet terputus'));

      const executeLoad = async (isBackground = false) => {
        if (isBackground || data.length > 0) {
          isRefreshing = true;
        } else {
          isLoading = true;
        }
        error = null;

        try {
          data = await mockFetchWithError();
        } catch (err: any) {
          error = err?.message || 'Gagal memuat data';
        } finally {
          isLoading = false;
          isRefreshing = false;
        }
      };

      // Execute initial fetch
      const loadPromise = executeLoad(false);
      // While running, isLoading must be true
      expect(isLoading).toBe(true);
      expect(isRefreshing).toBe(false);

      await loadPromise;

      // After failure: loading MUST terminate
      expect(isLoading).toBe(false);
      expect(isRefreshing).toBe(false);
      expect(error).toBe('Koneksi internet terputus');
      // Spinner does not hang
      expect(isLoading || isRefreshing).toBe(false);
    });

    it('ensures action button spinners terminate on unhandled exception', async () => {
      let isActionProcessing = false;
      let caughtError = false;

      const actionHandler = async () => {
        isActionProcessing = true;
        try {
          throw new Error('GPS timeout occurred');
        } catch (err) {
          caughtError = true;
        } finally {
          isActionProcessing = false;
        }
      };

      await actionHandler();

      expect(caughtError).toBe(true);
      expect(isActionProcessing).toBe(false);
    });
  });

  describe('3. Refresh mempertahankan data lama (Stale-While-Revalidate)', () => {
    it('retains previous data and does not show full skeleton during background refresh', async () => {
      let isLoading = false;
      let isRefreshing = false;
      let data = [
        { id: 1, name: 'Lhoksukon', status: 'Tinggi' },
        { id: 2, name: 'Matangkuli', status: 'Tinggi' },
      ];
      let error: string | null = null;

      const mockRefresh = vi.fn().mockImplementation(async () => {
        // In the middle of refresh, verify stale data is still accessible
        expect(data.length).toBe(2);
        return [
          { id: 1, name: 'Lhoksukon', status: 'Tinggi' },
          { id: 2, name: 'Matangkuli', status: 'Tinggi' },
          { id: 3, name: 'Pirak Timur', status: 'Tinggi' },
        ];
      });

      const executeRefresh = async () => {
        if (data.length > 0) {
          isRefreshing = true;
        } else {
          isLoading = true;
        }

        try {
          data = await mockRefresh();
        } catch (err: any) {
          error = err?.message;
        } finally {
          isLoading = false;
          isRefreshing = false;
        }
      };

      const refreshPromise = executeRefresh();

      // Crucial: During background refresh, isLoading is FALSE, isRefreshing is TRUE
      expect(isLoading).toBe(false);
      expect(isRefreshing).toBe(true);
      // Existing data is NOT cleared to empty
      expect(data.length).toBe(2);

      await refreshPromise;

      expect(isLoading).toBe(false);
      expect(isRefreshing).toBe(false);
      expect(data.length).toBe(3);
    });

    it('retains existing data if background refresh fails', async () => {
      let isRefreshing = false;
      let error: string | null = null;
      const initialData = [{ id: 'kec-1', name: 'Dewantara' }];
      let currentData = [...initialData];

      const failingRefresh = vi.fn().mockRejectedValue(new Error('Network timeout'));

      const runRefresh = async () => {
        isRefreshing = true;
        try {
          currentData = await failingRefresh();
        } catch (err: any) {
          error = err?.message;
        } finally {
          isRefreshing = false;
        }
      };

      await runRefresh();

      // Refresh finished
      expect(isRefreshing).toBe(false);
      expect(error).toBe('Network timeout');
      // Previous data is completely preserved!
      expect(currentData).toEqual(initialData);
      expect(currentData.length).toBe(1);
    });
  });

  describe('4. Cegah operasi ganda saat proses berjalan (Double Click Prevention)', () => {
    it('blocks subsequent triggers while submitting is in progress', async () => {
      let isSubmitting = false;
      let submissionCount = 0;

      const submitReport = async () => {
        if (isSubmitting) {
          return { status: 'BLOCKED' };
        }
        isSubmitting = true;
        submissionCount++;

        // Simulate async network request
        await new Promise((resolve) => setTimeout(resolve, 50));
        isSubmitting = false;
        return { status: 'SUCCESS' };
      };

      // Fire 3 simultaneous rapid clicks
      const p1 = submitReport();
      const p2 = submitReport();
      const p3 = submitReport();

      const results = await Promise.all([p1, p2, p3]);

      expect(submissionCount).toBe(1);
      expect(results[0].status).toBe('SUCCESS');
      expect(results[1].status).toBe('BLOCKED');
      expect(results[2].status).toBe('BLOCKED');
    });
  });
});
