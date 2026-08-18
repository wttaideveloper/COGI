import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import type { SiteConfig } from '@/lib/siteConfig'

type HomeSection = NonNullable<SiteConfig['homepage']['sections']>[number]

export function isCustomHomeSection(section: HomeSection) {
  return Boolean(section.kind && section.kind !== 'built-in') || section.id.startsWith('custom-')
}

export function CustomHomeSection({ section }: { section: HomeSection }) {
  const kind = section.kind || 'text'
  const title = section.title || section.label
  const body = section.content || ''
  const button = section.buttonLabel && section.buttonHref ? (
    section.buttonHref.startsWith('http') ? (
      <a href={section.buttonHref} className="mt-8 inline-flex rounded-sm bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-deep">
        {section.buttonLabel}
      </a>
    ) : (
      <ButtonLink to={section.buttonHref} className="mt-8 rounded-sm uppercase tracking-[0.2em]">{section.buttonLabel}</ButtonLink>
    )
  ) : null

  if (kind === 'banner') {
    return (
      <section className="relative overflow-hidden py-24 text-white" aria-label={title}>
        {section.imageUrl ? <img src={section.imageUrl} alt={section.imageAlt || ''} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          {section.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{section.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide md:text-5xl">{title}</h2>
          {body ? <p className="mt-5 text-lg text-white/90">{body}</p> : null}
          {button}
        </div>
      </section>
    )
  }

  if (kind === 'split') {
    return (
      <section className="bg-white py-24" aria-label={title}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
          {section.imageUrl ? (
            <img src={section.imageUrl} alt={section.imageAlt || ''} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center bg-[#f6f3ee] text-sm text-ink-muted">Photo</div>
          )}
          <div>
            <h2 className="font-display text-3xl text-teal-deep md:text-5xl">{title}</h2>
            {body ? <p className="mt-5 text-lg leading-relaxed text-ink-muted">{body}</p> : null}
            {button}
          </div>
        </div>
      </section>
    )
  }

  if (kind === 'cta') {
    return (
      <section className="bg-gold py-20 text-teal-deep" aria-label={title}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          {section.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em]">{section.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">{title}</h2>
          {body ? <p className="mt-5 text-lg">{body}</p> : null}
          {button}
        </div>
      </section>
    )
  }

  if (kind === 'quote') {
    return (
      <section className="bg-[#161412] py-20 text-white" aria-label={title}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          {title ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{title}</p> : null}
          <p className="mt-6 font-display text-2xl italic leading-relaxed md:text-3xl">{body}</p>
        </div>
      </section>
    )
  }

  if (kind === 'image') {
    return (
      <section className="bg-white py-16" aria-label={title}>
        <div className="mx-auto max-w-6xl px-4">
          {section.imageUrl ? <img src={section.imageUrl} alt={section.imageAlt || title} className="w-full object-cover" /> : null}
          {body || title ? <p className="mt-4 text-center text-sm text-ink-muted">{body || title}</p> : null}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-24" aria-label={title}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-display text-3xl text-teal-deep md:text-5xl">{title}</h2>
        {body ? <p className="mt-6 text-lg leading-relaxed text-ink-muted">{body}</p> : null}
        {button}
        {section.buttonHref?.startsWith('/') && !section.buttonLabel ? <Link to={section.buttonHref} className="mt-6 inline-block text-xs font-bold uppercase tracking-[0.2em] text-teal-deep">Learn more</Link> : null}
      </div>
    </section>
  )
}
