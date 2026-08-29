import { readFileSync } from 'node:fs';
import { deriveLoopStatus } from './loop-state.mjs';

const state = JSON.parse(readFileSync('docs/loop/tasks.json', 'utf8'));
console.log(JSON.stringify(deriveLoopStatus(state)));
