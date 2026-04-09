/* eslint-env vitest */
import { saveCache, readCache, clearCache, clearAllCache } from '../services/CacheService';

describe('CacheService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('salva e legge correttamente i dati', async () => {
    await saveCache('test', { value: 123 });
    const data = await readCache('test');
    expect(data).toEqual({ value: 123 });
  });

  it('rimuove cache scaduta', async () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);
    await saveCache('old', { value: 'x' }, 1000);
    vi.spyOn(Date, 'now').mockReturnValue(now + 2000);
    const data = await readCache('old');
    expect(data).toBeNull();
    vi.restoreAllMocks();
  });

  it('pulizia cache con clearCache e clearAllCache', async () => {
    await saveCache('foo', { value: 'foo' });
    await saveCache('bar', { value: 'bar' });
    await clearCache('foo');
    expect(await readCache('foo')).toBeNull();
    await clearAllCache();
    expect(await readCache('bar')).toBeNull();
  });
});
