import { readFileSync } from 'node:fs';

const state = JSON.parse(readFileSync('docs/loop/tasks.json', 'utf8'));
const active = state.tasks.filter((task) => task.status === 'active');

if (state.terminal || active.length === 1) {
  console.log(
    JSON.stringify({ terminal: state.terminal, active: active[0]?.id }),
  );
  process.exit(0);
}

console.error('Loop state requires exactly one active task until terminal.');
process.exit(1);
