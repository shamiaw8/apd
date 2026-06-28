async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`failed to load ${path}`);
  }
  return response.json();
}

async function getWarehouseData() {
  const [athletes, wellness, workload, sessions] = await Promise.all([
    loadJson('data/athletes.json'),
    loadJson('data/wellness.json'),
    loadJson('data/workload.json'),
    loadJson('data/training_sessions.json')
  ]);

  return { athletes, wellness, workload, sessions };
}
