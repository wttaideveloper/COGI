import { describe, expect, it } from 'vitest'
import { normalizeGlobalSettings } from './globalSettings'
import { fallbackGlobalSettings } from '@/data/fallback'

describe('global settings API boundary', () => {
  it('maps the Strapi schema used after the initial page load', () => {
    const settings = normalizeGlobalSettings({ primaryEmail: 'office@example.org', phone: '123', social: { linkedin: 'https://linkedin.com/company/example' } })
    expect(settings.contactEmail).toBe('office@example.org')
    expect(settings.contactPhone).toBe('123')
    expect(settings.socialLinks).toEqual([{ platform: 'linkedin', url: 'https://linkedin.com/company/example', label: 'LinkedIn' }])
  })
  it('supports wrapped responses and missing or malformed social data without crashing', () => {
    for (const input of [null, {}, { socialLinks: null }, { socialLinks: {} }, { attributes: { social: null } }]) {
      expect(Array.isArray(normalizeGlobalSettings(input).socialLinks)).toBe(true)
    }
    expect(normalizeGlobalSettings({ attributes: { primaryEmail: 'wrapped@example.org' } }).contactEmail).toBe('wrapped@example.org')
    expect(normalizeGlobalSettings({ socialLinks: [null, {}, ...fallbackGlobalSettings.socialLinks] }).socialLinks).toEqual(fallbackGlobalSettings.socialLinks)
  })
  it('preserves deliberately empty social lists', () => {
    expect(normalizeGlobalSettings({ socialLinks: [] }).socialLinks).toEqual([])
    expect(normalizeGlobalSettings({ social: {} }).socialLinks).toEqual([])
  })
})
