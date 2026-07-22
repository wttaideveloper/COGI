export function exportCsv<T extends Record<string, unknown>>(rows: T[], columns: Array<{ key: keyof T; label: string }>, filename: string): void {
  const csv = [columns.map((c) => c.label).join(','), ...rows.map((row) => columns.map((c) => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
