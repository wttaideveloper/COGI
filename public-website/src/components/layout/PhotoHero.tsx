import { MediaPreview } from '@/components/ui/MediaPreview'

export type PhotoHeroProps = { title: string; subtitle?: string; imageUrl?: string }

export function PhotoHero({ title, subtitle, imageUrl }: PhotoHeroProps) {
  return (
      <section className="about-hero" aria-labelledby="page-heading">
        <div className="about-hero-inner">
          <div>
            <h1 id="page-heading">{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <MediaPreview src={imageUrl || '/images/cogi-gathering.png'} alt={title} className="about-hero-photo" />
        </div>
      </section>
  )
}
