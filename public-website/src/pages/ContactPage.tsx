import { PhotoHero } from '@/components/layout/PhotoHero'
import { useQuery } from '@tanstack/react-query'
import { getGlobalSettings } from '@/api/globalSettings'
import { SEO } from '@/components/ui/SEO'
import { Card } from '@/components/ui/Card'
import { ContactForm } from '@/components/forms/ContactForm'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function ContactPage() {
  const { data: settings } = useQuery({ queryKey: ['globalSettings'], queryFn: getGlobalSettings })
  const { copy, footer } = useSiteConfig()
  const page = copy.contact
  const email = page.email || settings?.contactEmail
  const phone = page.phone || settings?.contactPhone
  const office = page.office || settings?.address
  const configuredSocial = [
    { platform: 'facebook', label: 'Facebook', url: footer.facebookUrl },
    { platform: 'instagram', label: 'Instagram', url: footer.instagramUrl },
    { platform: 'linkedin', label: 'LinkedIn', url: footer.linkedinUrl },
    { platform: 'youtube', label: 'YouTube', url: footer.youtubeUrl },
  ].filter(link => link.url)
  const socialLinks = configuredSocial.length ? configuredSocial : settings?.socialLinks || []

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/contact" />
      <PhotoHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="about-body mx-auto max-w-6xl grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-display text-2xl text-teal-deep">{page.formTitle}</h2>
          <div className="mt-6">
            <ContactForm submitLabel={page.submitLabel} />
          </div>
        </Card>
        <div className="space-y-8">
          <Card>
            <h2 className="font-display text-xl text-teal-deep">{page.infoTitle}</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-semibold text-ink-muted">Email</dt>
                <dd><a href={`mailto:${email}`} className="text-teal-deep hover:text-accent-ink">{email}</a></dd>
              </div>
              {phone ? <div><dt className="text-sm font-semibold text-ink-muted">Phone</dt><dd><a href={`tel:${phone}`}>{phone}</a></dd></div> : null}
              {office && (
                <div>
                  <dt className="text-sm font-semibold text-ink-muted">Office</dt>
                  <dd>{office}</dd>
                </div>
              )}
            </dl>
          </Card>
          <Card>
            <h2 className="font-display text-xl text-teal-deep">{page.socialTitle}</h2>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-teal-deep hover:text-accent-ink">{link.label}</a>
                </li>
              ))}
            </ul>
          </Card>
          <div className="rounded-xl bg-mist-dark p-8 text-center text-ink-muted" >
            <p className="text-sm">{page.mapNote}</p>
          </div>
        </div>
      </div>
    </>
  )
}
