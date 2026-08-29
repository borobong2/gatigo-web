const ALLOWED_STATUSES = new Set([
  'pending',
  'active',
  'diagnose',
  'verify',
  'done',
  'blocked',
]);

export const deriveLoopStatus = (state) => {
  if (!state || !Array.isArray(state.tasks)) {
    throw new Error('Loop state requires a tasks array.');
  }

  const ids = new Set();
  for (const task of state.tasks) {
    if (!task.id || ids.has(task.id)) {
      throw new Error(`Duplicate or missing task id: ${task.id ?? 'unknown'}`);
    }
    if (!ALLOWED_STATUSES.has(task.status)) {
      throw new Error(`Invalid status for ${task.id}: ${task.status}`);
    }
    ids.add(task.id);
  }

  for (const task of state.tasks) {
    for (const dependency of task.deps ?? []) {
      if (!ids.has(dependency)) {
        throw new Error(`Unknown dependency for ${task.id}: ${dependency}`);
      }
      if (dependency === task.id) {
        throw new Error(`Task cannot depend on itself: ${task.id}`);
      }
    }
  }

  const done = new Set(
    state.tasks.filter((task) => task.status === 'done').map((task) => task.id),
  );
  const dependenciesDone = (task) =>
    (task.deps ?? []).every((dependency) => done.has(dependency));
  const activeTasks = state.tasks.filter((task) =>
    ['active', 'diagnose', 'verify'].includes(task.status),
  );

  for (const task of activeTasks) {
    if (!dependenciesDone(task)) {
      throw new Error(`Active task has unfinished dependencies: ${task.id}`);
    }
  }

  const readyTasks = state.tasks.filter(
    (task) => task.status === 'pending' && dependenciesDone(task),
  );
  const unfinished = state.tasks.filter((task) => task.status !== 'done');
  if (state.terminal && unfinished.length) {
    throw new Error('Terminal loop state cannot contain unfinished tasks.');
  }

  return {
    terminal: Boolean(state.terminal),
    active: activeTasks.map((task) => task.id),
    ready: readyTasks.map((task) => task.id),
    blocked: state.tasks
      .filter(
        (task) =>
          task.status === 'blocked' ||
          (task.status === 'pending' && !dependenciesDone(task)),
      )
      .map((task) => task.id),
  };
};
