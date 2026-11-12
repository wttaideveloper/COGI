import { expect, it } from 'vitest'
import { defaultSiteConfig, mergeSiteConfig } from './siteConfig'
import { mergeSiteCopy } from '@/data/siteCopy'

it('keeps published section ordering including custom blocks between built-ins', () => {
  const sections = defaultSiteConfig.homepage.sections!.map(section => ({ ...section, order: section.order + 10 }))
  sections.find(section => section.id === 'mission')!.order = 1
  sections.push({ id: 'custom-test', label: 'Custom', enabled: true, order: 2, summary: '' })
  const result = mergeSiteConfig({ homepage: { ...defaultSiteConfig.homepage, sections } })
  expect(result.homepage.sections!.slice(0, 2).map(s => s.id)).toEqual(['mission', 'custom-test'])
})

it('preserves removed content, empty navigation and an intentionally cleared video', () => {
  const copy = mergeSiteCopy({ board: { ...defaultSiteConfig.copy.board, members: [] }, donate: { ...defaultSiteConfig.copy.donate, faqs: [] } })
  expect(copy.board.members).toEqual([])
  expect(copy.donate.faqs).toEqual([])
  const config = mergeSiteConfig({ headerNav: [], footerNav: [], homepage: { ...defaultSiteConfig.homepage, heroVideoUrl: '' } })
  expect(config.headerNav).toEqual([])
  expect(config.homepage.heroVideoUrl).toBe('')
})
