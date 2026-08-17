const prefix = 'cogi_records_doc1_'

export function loadLocalRecords<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(`${prefix}${key}`)
    if (!raw) return structuredClone(seed)
    const parsed = JSON.parse(raw) as T[]
    return Array.isArray(parsed) ? parsed : structuredClone(seed)
  } catch {
    return structuredClone(seed)
  }
}

export function saveLocalRecords<T>(key: string, rows: T[]): void {
  localStorage.setItem(`${prefix}${key}`, JSON.stringify(rows))
}
