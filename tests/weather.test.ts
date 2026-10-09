import { afterEach, describe, expect, it, vi } from 'vitest';
import { dataService } from '../src/services/dataService';
afterEach(() => vi.unstubAllGlobals());
describe('BMKG weather integrity', () => {
  it('rejects failed requests instead of returning an official-looking sample', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(dataService.getBMKGWeather()).rejects.toThrow('Tidak dapat memuat');
  });
  it('keeps unavailable measurements empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [{ cuaca: [[{ weather_desc: 'Berawan', local_datetime: '2026-10-09 12:00:00' }]] }] }) }));
    const result = await dataService.getBMKGWeather();
    expect(result.data.cuaca[0].t).toBeNull();
    expect(result.data.cuaca[0].hu).toBeNull();
    expect(result.data.cuaca[0].ws).toBeNull();
  });
});
