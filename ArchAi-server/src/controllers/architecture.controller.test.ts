import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { ArchitectureController } from './architecture.controller';

describe('ArchitectureController.generateBuildPromptsStream', () => {
  it('streams prompts and closes response when stream completes', async () => {
    const promptEvents = [
      { nodeId: 'node-1', buildPrompt: 'Build API service' },
      { nodeId: 'node-2', buildPrompt: 'Build Redis cache' },
    ];

    const aiService = {
      generateBuildPromptsStream: vi.fn(async function* () {
        for (const event of promptEvents) {
          yield event;
        }
      }),
    };

    const architectureService = { aiService };
    const controller = new ArchitectureController(architectureService as never);

    const req = {
      body: { graph: { nodes: [], edges: [] }, architecture: {}, frontend: undefined },
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as Request;

    const writes: string[] = [];
    const res = {
      setHeader: vi.fn(),
      flushHeaders: vi.fn(),
      write: vi.fn((chunk: string) => {
        writes.push(chunk);
      }),
      end: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    await controller.generateBuildPromptsStream(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(writes.some((w) => w.startsWith('event: prompt'))).toBe(true);
    expect(writes.some((w) => w.includes('"nodeId":"node-1"'))).toBe(true);
    expect(writes.some((w) => w.includes('"nodeId":"node-2"'))).toBe(true);
    expect(writes.some((w) => w.includes('event: done'))).toBe(true);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });

  it('stops streaming when client disconnects', async () => {
    const promptEvents = [
      { nodeId: 'node-1', buildPrompt: 'Build API service' },
      { nodeId: 'node-2', buildPrompt: 'Build Redis cache' },
    ];

    const aiService = {
      generateBuildPromptsStream: vi.fn(async function* () {
        for (const event of promptEvents) {
          yield event;
        }
      }),
    };

    const architectureService = { aiService };
    const controller = new ArchitectureController(architectureService as never);

    let onClose: (() => void) | undefined;
    const req = {
      body: { graph: { nodes: [], edges: [] }, architecture: {}, frontend: undefined },
      on: vi.fn((event: string, handler: () => void) => {
        if (event === 'close') {
          onClose = handler;
        }
      }),
      off: vi.fn(),
    } as unknown as Request;

    const writes: string[] = [];
    const res = {
      setHeader: vi.fn(),
      flushHeaders: vi.fn(),
      write: vi.fn((chunk: string) => {
        writes.push(chunk);
        if (chunk.includes('"nodeId":"node-1"')) {
          onClose?.();
        }
      }),
      end: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    await controller.generateBuildPromptsStream(req, res, next);

    expect(writes.some((w) => w.includes('"nodeId":"node-1"'))).toBe(true);
    expect(writes.some((w) => w.includes('"nodeId":"node-2"'))).toBe(false);
    expect(writes.some((w) => w.includes('event: done'))).toBe(false);
    expect(res.end).not.toHaveBeenCalled();
    expect(req.off).toHaveBeenCalledWith('close', expect.any(Function));
    expect(next).not.toHaveBeenCalled();
  });
});
