import { useQuery } from '@tanstack/react-query'
import { getGlobalSettings } from '@/api/globalSettings'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { ContactForm } from '@/components/forms/ContactForm'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function ContactPage() {
  const { data: settings } = useQuery({ queryKey: ['globalSettings'], queryFn: getGlobalSettings })
  const { copy, footer } = useSiteConfig()
  const page = copy.contact
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
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-5xl px-4 py-16 grid gap-12 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl text-teal-deep">{page.formTitle}</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Card>
        <div className="space-y-8">
          <Card>
            <h2 className="font-display text-xl text-teal-deep">{page.infoTitle}</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-semibold text-ink-muted">Email</dt>
                <dd><a href={`mailto:${settings?.contactEmail}`} className="text-teal-deep hover:text-gold">{settings?.contactEmail}</a></dd>
              </div>
              {settings?.contactPhone ? <div><dt className="text-sm font-semibold text-ink-muted">Phone</dt><dd><a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></dd></div> : null}
              {settings?.address && (
                <div>
                  <dt className="text-sm font-semibold text-ink-muted">Office</dt>
                  <dd>{settings.address}</dd>
                </div>
              )}
            </dl>
          </Card>
          <Card>
            <h2 className="font-display text-xl text-teal-deep">{page.socialTitle}</h2>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-teal-deep hover:text-gold">{link.label}</a>
                </li>
              ))}
            </ul>
          </Card>
          <div className="rounded-xl bg-mist-dark p-8 text-center text-ink-muted" aria-label="Map placeholder">
            <p className="text-sm">{page.mapNote}</p>
          </div>
        </div>
      </div>
    </>
  )
}
