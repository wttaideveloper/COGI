import { expect, it } from 'vitest'
import { resolveNavHref, uniqueHeaderNav } from './Header'

it('keeps one home entry and reserves Donate for the CTA', () => {
  const items = uniqueHeaderNav([
    { id: 'home', label: 'Home', href: '/' },
    { id: 'give', label: 'Donate', href: '/donate/' },
    { id: 'contact', label: 'Contact Us', href: '/contact-us' },
    { id: 'duplicate', label: 'Contact', href: '/contact' },
  ], '/donate')
  expect(items.map(item => resolveNavHref(item))).toEqual(['/', '/contact'])
})

it('keeps the overview link within an About dropdown', () => {
  const children = [{ id: 'overview', label: 'Overview', href: '/about' }]
  expect(uniqueHeaderNav([{ id: 'about', label: 'About', href: '/about', children }], '/donate')[1].children).toEqual(children)
})
