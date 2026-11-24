import type { FooterSettings, HeaderSettings, NavigationMenu, SeoSettings, ThemeSettings } from '@/types'

export const colorPresets: Array<{ name: string } & ThemeSettings> = [
  {
    name: 'White & Blue',
    primaryColor: '#1F2937',
    secondaryColor: '#4B5563',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    accentColor: '#5B8FB5',
    buttonHoverColor: '#4A7FA3',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headingFontFamily: 'Arial, Helvetica, sans-serif',
  },
  {
    name: 'Grace Forest',
    primaryColor: '#1B4D3E',
    secondaryColor: '#12362C',
    backgroundColor: '#F3F6F4',
    textColor: '#1A2E28',
    accentColor: '#C4A574',
    buttonHoverColor: '#D4B88A',
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    headingFontFamily: 'Georgia, "Times New Roman", serif',
  },
  {
    name: 'Ocean Hope',
    primaryColor: '#0A4D4A',
    secondaryColor: '#083B39',
    backgroundColor: '#F2F8F7',
    textColor: '#1C2A28',
    accentColor: '#C9A227',
    buttonHoverColor: '#E0BC4A',
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFontFamily: 'Merriweather, Georgia, serif',
  },
  {
    name: 'Warm Mission',
    primaryColor: '#8B4513',
    secondaryColor: '#3D2914',
    backgroundColor: '#FAF6F1',
    textColor: '#2A2118',
    accentColor: '#D4A017',
    buttonHoverColor: '#E8B82A',
    fontFamily: 'Lato, Arial, sans-serif',
    headingFontFamily: 'Playfair Display, Georgia, serif',
  },
]

export const fontOptions = [
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans, system-ui, sans-serif' },
  { label: 'Inter (Modern Clean)', value: 'Inter, system-ui, sans-serif' },
  { label: 'Poppins (Friendly)', value: 'Poppins, Inter, sans-serif' },
  { label: 'Lato (Warm Corporate)', value: 'Lato, Arial, sans-serif' },
  { label: 'Open Sans (Readable)', value: '"Open Sans", Arial, sans-serif' },
  { label: 'Montserrat (Bold)', value: 'Montserrat, Arial, sans-serif' },
]

export const headingFontOptions = [
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Bricolage Grotesque', value: 'Bricolage Grotesque, system-ui, sans-serif' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond, Georgia, serif' },
  { label: 'Merriweather (Editorial)', value: 'Merriweather, Georgia, serif' },
  { label: 'Playfair Display (Elegant)', value: '"Playfair Display", Georgia, serif' },
  { label: 'Lora (Readable Serif)', value: 'Lora, Georgia, serif' },
  { label: 'Montserrat (Sans Heading)', value: 'Montserrat, Arial, sans-serif' },
]

export const mockTheme: ThemeSettings = {
  primaryColor: colorPresets[0].primaryColor,
  secondaryColor: colorPresets[0].secondaryColor,
  backgroundColor: colorPresets[0].backgroundColor,
  textColor: colorPresets[0].textColor,
  accentColor: colorPresets[0].accentColor,
  buttonHoverColor: colorPresets[0].buttonHoverColor,
  fontFamily: colorPresets[0].fontFamily,
  headingFontFamily: colorPresets[0].headingFontFamily,
}

export const mockHeader: HeaderSettings = {
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  logoUrl: '/images/cogi-logo.png',
  logoAlt: 'Companions of Grace International',
  logoHeight: 48,
  ctaText: 'Give now',
  ctaLink: '/donate',
  sticky: false,
}

export const mockFooter: FooterSettings = {
  backgroundColor: '#203548',
  textColor: '#edf3f7',
  logoUrl: '/images/cogi-logo.png',
  logoHeight: 40,
  description: 'Equipping healthcare professionals for Kingdom engagement through training, community, and mission.',
  copyright: '© Companions of Grace International. All rights reserved.',
  showSocial: true,
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  linkedinUrl: 'https://linkedin.com/company/coginternational',
  whatsappUrl: '',
}

export const mockSeo: SeoSettings = {
  metaTitle: 'COGI – Companions of Grace International',
  metaDescription: 'Equipping healthcare professionals for Kingdom engagement through training, community, and missional healthcare programs worldwide.',
  keywords: 'COGI, Companions of Grace, healthcare missions, missional healthcare, Christian healthcare',
  ogImageUrl: '/images/cogi-hero.png',
  siteUrl: 'https://coginternational.org',
}

export const mockFooterNavigation: NavigationMenu = {
  id: '2',
  name: 'Footer Navigation',
  location: 'footer',
  items: [
    { id: 'f1', label: 'About Us', href: '/about', visible: true },
    { id: 'f2', label: 'Programs', href: '/programs', visible: true },
    { id: 'f3', label: 'Get Involved', href: '/get-involved', visible: true },
    { id: 'f4', label: 'Contact', href: '/contact', visible: true },
    { id: 'f5', label: 'Privacy', href: '/privacy-policy', visible: true },
  ],
}
