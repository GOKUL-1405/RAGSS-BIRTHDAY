/* js/memory-registry.js */
// Central registry to ensure each memory is used only once across sections
const usedMemoryIds = new Set();

export function registerMemory(id) {
  if (id) usedMemoryIds.add(id);
}

export function isMemoryUsed(id) {
  return usedMemoryIds.has(id);
}

export function getUnusedMemories(allMemories) {
  return allMemories.filter(m => !usedMemoryIds.has(m.id));
}
