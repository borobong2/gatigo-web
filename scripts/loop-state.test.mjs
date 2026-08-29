import { describe, expect, test } from 'vitest';
import { deriveLoopStatus } from './loop-state.mjs';

const state = (tasks, terminal = false) => ({ tasks, terminal });

describe('deriveLoopStatus', () => {
  test('derives ready tasks from completed dependencies', () => {
    const result = deriveLoopStatus(
      state([
        { id: 'A', status: 'done', deps: [] },
        { id: 'B', status: 'pending', deps: ['A'] },
        { id: 'C', status: 'pending', deps: ['B'] },
      ]),
    );

    expect(result.ready).toEqual(['B']);
    expect(result.blocked).toEqual(['C']);
  });

  test('reports active and explicitly blocked tasks', () => {
    const result = deriveLoopStatus(
      state([
        { id: 'A', status: 'active', deps: [] },
        { id: 'B', status: 'blocked', deps: [] },
      ]),
    );

    expect(result.active).toEqual(['A']);
    expect(result.blocked).toEqual(['B']);
  });

  test('rejects unknown dependencies and statuses', () => {
    expect(() =>
      deriveLoopStatus(state([{ id: 'A', status: 'pending', deps: ['X'] }])),
    ).toThrow('Unknown dependency');
    expect(() =>
      deriveLoopStatus(state([{ id: 'A', status: 'waiting', deps: [] }])),
    ).toThrow('Invalid status');
  });

  test('requires every task to be done before terminal state', () => {
    expect(() =>
      deriveLoopStatus(state([{ id: 'A', status: 'pending', deps: [] }], true)),
    ).toThrow('Terminal loop state');
    expect(
      deriveLoopStatus(state([{ id: 'A', status: 'done', deps: [] }], true)),
    ).toEqual({ terminal: true, active: [], ready: [], blocked: [] });
  });
});
