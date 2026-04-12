import { describe, it, expect } from 'vitest';
import { extractJsonFromResponse, retryWithBackoff, sanitizePrompt } from '../utils/helpers';

describe('extractJsonFromResponse', () => {
  it('parses plain JSON object', () => {
    const result = extractJsonFromResponse('{"name": "test", "value": 42}');
    expect(result).toEqual({ name: 'test', value: 42 });
  });

  it('extracts JSON from markdown code block', () => {
    const result = extractJsonFromResponse('```json\n{"key": "value"}\n```');
    expect(result).toEqual({ key: 'value' });
  });

  it('extracts JSON without language tag', () => {
    const result = extractJsonFromResponse('```\n{"foo": "bar"}\n```');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('handles text before JSON', () => {
    const result = extractJsonFromResponse('Here is the response:\n\n{"result": true}');
    expect(result).toEqual({ result: true });
  });

  it('handles text after JSON', () => {
    const result = extractJsonFromResponse('{"count": 5}\n\nThat is the result.');
    expect(result).toEqual({ count: 5 });
  });

  it('unwraps single-element arrays', () => {
    const result = extractJsonFromResponse('[{"item": "one"}]');
    expect(result).toEqual({ item: 'one' });
  });

  it('returns multi-element arrays as-is', () => {
    const result = extractJsonFromResponse('[{"a": 1}, {"b": 2}]') as unknown[];
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('throws on invalid JSON', () => {
    expect(() => extractJsonFromResponse('not json at all')).toThrow();
  });

  it('handles nested objects', () => {
    const result = extractJsonFromResponse('{"outer": {"inner": {"deep": true}}}');
    expect(result).toEqual({ outer: { inner: { deep: true } } });
  });

  it('handles arrays inside objects', () => {
    const result = extractJsonFromResponse('{"items": ["a", "b", "c"], "count": 3}');
    expect(result).toEqual({ items: ['a', 'b', 'c'], count: 3 });
  });
});

describe('retryWithBackoff', () => {
  it('returns result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await retryWithBackoff(fn, 3, 10);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure then succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('ok');

    const result = await retryWithBackoff(fn, 3, 1);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  }, 10000);

  it('throws after max retries exhausted', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));

    await expect(retryWithBackoff(fn, 2, 1)).rejects.toThrow('always fails');
    // initial call + 2 retries = 3 total
    expect(fn).toHaveBeenCalledTimes(3);
  }, 10000);
});

describe('sanitizePrompt', () => {
  it('removes HTML tags', () => {
    const result = sanitizePrompt('Hello <b>world</b>');
    expect(result).toBe('Hello world');
  });

  it('removes nested tags', () => {
    const result = sanitizePrompt('<div><p>Nested</p></div>');
    expect(result).toBe('Nested');
  });

  it('trims whitespace', () => {
    const result = sanitizePrompt('  some prompt  ');
    expect(result).toBe('some prompt');
  });

  it('handles empty input', () => {
    const result = sanitizePrompt('');
    expect(result).toBe('');
  });

  it('handles prompt with no tags', () => {
    const result = sanitizePrompt('Build a REST API with Express');
    expect(result).toBe('Build a REST API with Express');
  });
});
