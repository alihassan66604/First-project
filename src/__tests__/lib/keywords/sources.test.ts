import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGoogleSuggestions, getDeepGoogleSuggestions } from '@/lib/keywords/sources/google';
import { fetchEtsySuggestions, getDeepEtsySuggestions } from '@/lib/keywords/sources/etsy';

describe('Google Autocomplete Suggestion Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly parses Firefox JSON autocomplete format', async () => {
    const mockResponse = ['digital planner', ['digital planner ipad', 'digital planner free', 'digital planner 2026']];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const results = await fetchGoogleSuggestions('digital planner', 'en');
    expect(results).toEqual(['digital planner ipad', 'digital planner free', 'digital planner 2026']);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('hl=en'),
      expect.any(Object)
    );
  });

  it('supports international language parameters (e.g., Urdu, Spanish, Hindi)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ['urdu seed', ['urdu result 1', 'urdu result 2']],
    } as any);

    const results = await fetchGoogleSuggestions('urdu seed', 'ur');
    expect(results).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('hl=ur'),
      expect.any(Object)
    );
  });

  it('handles network failure gracefully without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));
    const results = await fetchGoogleSuggestions('offline test');
    expect(results).toEqual([]);
  });

  it('gathers deep suggestions by querying modifiers', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('how%20to')) {
        return Promise.resolve({
          ok: true,
          json: async () => ['planner how to', ['how to use digital planner']],
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ['planner', ['planner stickers', 'planner printable']],
      });
    });

    const deepResults = await getDeepGoogleSuggestions({ query: 'planner', deepSearch: true });
    expect(deepResults).toContain('planner stickers');
    expect(deepResults).toContain('how to use digital planner');
  });
});

describe('Etsy Autocomplete Suggestion Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly parses Etsy bespoke typeahead JSON format', async () => {
    const mockData = {
      results: [
        { query: 'wedding invitation template' },
        { query: 'wedding invitation suite' },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);

    const results = await fetchEtsySuggestions('wedding invitation');
    expect(results).toEqual(['wedding invitation template', 'wedding invitation suite']);
  });

  it('falls back to CDN autocomplete if bespoke endpoint fails', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('bespoke')) {
        return Promise.resolve({ ok: false, status: 500 });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [{ query: 'etsy fallback sticker' }, { query: 'etsy fallback label' }],
      });
    });

    const results = await fetchEtsySuggestions('stickers');
    expect(results).toContain('etsy fallback sticker');
    expect(results).toContain('etsy fallback label');
  });

  it('deep Etsy suggestions combine modifiers', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          results: [{ query: 'planner printable pack' }],
        }),
      });
    });

    const results = await getDeepEtsySuggestions({ query: 'planner' });
    expect(results).toContain('planner printable pack');
  });
});
