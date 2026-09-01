import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import type { SiteConfig } from '@/lib/siteConfig'

type HomeSection = NonNullable<SiteConfig['homepage']['sections']>[number]

export function isCustomHomeSection(section: HomeSection) {
  return Boolean(section.kind && section.kind !== 'built-in') || section.id.startsWith('custom-')
}

export function isSplitHomeSection(section: HomeSection) {
  return section.kind === 'split' || section.id === 'splitPrograms' || section.id === 'splitStories'
}

function SplitLink({ href, label }: { href: string; label: string }) {
  const className = 'mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-teal-deep hover:text-gold'
  if (href.startsWith('http')) {
    return <a href={href} className={className}>{label} →</a>
  }
  return <Link to={href} className={className}>{label} →</Link>
}

export function SplitBand({ section, imageLeft, tone = 'white' }: { section: HomeSection; imageLeft?: boolean; tone?: 'white' | 'mist' }) {
  const title = section.title || section.label
  const body = section.content || ''
  const left = imageLeft ?? section.imageSide === 'left'
  const image = (
    <div className="relative min-h-[240px] h-full overflow-hidden md:min-h-[340px]">
      {section.imageUrl ? (
        <img src={section.imageUrl} alt={section.imageAlt || title} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="flex h-full min-h-[240px] items-center justify-center bg-mist-dark text-sm text-ink-muted md:min-h-[340px]">Photo</div>
      )}
    </div>
  )
  const copy = (
    <div className="flex items-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
      <div className="mx-auto max-w-xl">
        {section.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{section.eyebrow}</p> : null}
        <h2 className="font-display text-4xl font-semibold italic leading-tight text-teal-deep md:text-5xl">{title}</h2>
        {body ? <p className="mt-6 text-lg leading-relaxed text-ink-muted">{body}</p> : null}
        {section.buttonLabel && section.buttonHref ? <SplitLink href={section.buttonHref} label={section.buttonLabel} /> : null}
      </div>
    </div>
  )

  return (
    <section className={tone === 'mist' ? 'bg-[#f5f8fc]' : 'bg-white'} aria-label={title}>
      <div className="grid md:grid-cols-2">
        {left ? (
          <>
            {image}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {image}
          </>
        )}
      </div>
    </section>
  )
}

export function CustomHomeSection({ section }: { section: HomeSection }) {
  const kind = section.kind || 'text'
  const title = section.title || section.label
  const body = section.content || ''
  const button = section.buttonLabel && section.buttonHref ? (
    section.buttonHref.startsWith('http') ? (
      <a href={section.buttonHref} className="mt-8 inline-flex rounded-sm bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">
        {section.buttonLabel}
      </a>
    ) : (
      <ButtonLink to={section.buttonHref} className="mt-8 rounded-sm uppercase tracking-[0.2em]">{section.buttonLabel}</ButtonLink>
    )
  ) : null

  if (kind === 'split' || isSplitHomeSection(section)) {
    return <SplitBand section={section} />
  }

  if (kind === 'banner') {
    return (
      <section className="border-y border-mist-dark bg-white py-14 text-ink md:py-20" aria-label={title}>
        {section.imageUrl ? <img src={section.imageUrl} alt={section.imageAlt || ''} className="mx-auto mb-8 h-56 max-w-4xl rounded-xl object-cover px-4" /> : null}
        <div className="mx-auto max-w-4xl px-4 text-center">
          {section.eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{section.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-teal-deep md:text-5xl">{title}</h2>
          {body ? <p className="mt-5 text-lg text-ink-muted">{body}</p> : null}
          {button}
        </div>
      </section>
    )
  }

  if (kind === 'cta') {
    return (
      <section className="border-y border-mist-dark bg-white py-20 text-teal-deep" aria-label={title}>
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
      <section className="border-y border-mist-dark bg-white py-20 text-ink" aria-label={title}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          {title ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{title}</p> : null}
          <p className="mt-6 font-display text-2xl italic leading-relaxed text-teal-deep md:text-3xl">{body}</p>
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
    <section className="bg-white py-14 md:py-20" aria-label={title}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-display text-3xl text-teal-deep md:text-5xl">{title}</h2>
        {body ? <p className="mt-6 text-lg leading-relaxed text-ink-muted">{body}</p> : null}
        {button}
        {section.buttonHref?.startsWith('/') && !section.buttonLabel ? <Link to={section.buttonHref} className="mt-6 inline-block text-xs font-bold uppercase tracking-[0.2em] text-teal-deep">Learn more</Link> : null}
      </div>
    </section>
  )
}
