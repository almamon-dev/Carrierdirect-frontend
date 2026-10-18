export function sortTableData<T extends Record<string, any>>(
  data: T[],
  sortKey: string | null,
  sortDir: 'asc' | 'desc'
): T[] {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;

    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }

    const strA = String(av).trim();
    const strB = String(bv).trim();

    if (/^[$€£¥]?\s*[\d,]+(\.\d+)?$/.test(strA) && /^[$€£¥]?\s*[\d,]+(\.\d+)?$/.test(strB)) {
      const numA = parseFloat(strA.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(strB.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === 'asc' ? numA - numB : numB - numA;
      }
    }

    const comp = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
    return sortDir === 'asc' ? comp : -comp;
  });
}

export function getSavedWrapCells(tableId?: string, defaultWrapCells = false): boolean {
  if (tableId) {
    try {
      const saved = localStorage.getItem(`cd_table_wrap_${tableId}`);
      if (saved !== null) return saved === 'true';
    } catch {}
  } else {
    try {
      const saved = localStorage.getItem('cd_table_wrap_global');
      if (saved !== null) return saved === 'true';
    } catch {}
  }
  return defaultWrapCells;
}

export function saveWrapCells(val: boolean, tableId?: string): void {
  if (tableId) {
    try {
      localStorage.setItem(`cd_table_wrap_${tableId}`, String(val));
    } catch {}
  } else {
    try {
      localStorage.setItem('cd_table_wrap_global', String(val));
    } catch {}
  }
}
