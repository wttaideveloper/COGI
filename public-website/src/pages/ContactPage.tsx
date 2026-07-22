import { useQuery } from '@tanstack/react-query'
import { getGlobalSettings } from '@/api/globalSettings'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { ContactForm } from '@/components/forms/ContactForm'

export function ContactPage() {
  const { data: settings } = useQuery({ queryKey: ['globalSettings'], queryFn: getGlobalSettings })

  return (
    <>
      <SEO title="Contact" description="Get in touch with Companions of Grace International" path="/contact" />
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" />
      <div className="mx-auto max-w-5xl px-4 py-16 grid gap-12 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl text-teal-deep">Send a Message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Card>
        <div className="space-y-8">
          <Card>
            <h2 className="font-display text-xl text-teal-deep">Contact Information</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-semibold text-ink-muted">Email</dt>
                <dd><a href={`mailto:${settings?.contactEmail}`} className="text-teal-deep hover:text-gold">{settings?.contactEmail}</a></dd>
              </div>
              {settings?.address && (
                <div>
                  <dt className="text-sm font-semibold text-ink-muted">Office</dt>
                  <dd>{settings.address}</dd>
                </div>
              )}
            </dl>
          </Card>
          <Card>
            <h2 className="font-display text-xl text-teal-deep">Connect on Social</h2>
            <ul className="mt-4 space-y-2">
              {settings?.socialLinks.map((link) => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-teal-deep hover:text-gold">{link.label}</a>
                </li>
              ))}
            </ul>
          </Card>
          <div className="rounded-xl bg-mist-dark p-8 text-center text-ink-muted" aria-label="Map placeholder">
            <p className="text-sm">Office map — configurable via Global Settings in Strapi</p>
          </div>
        </div>
      </div>
    </>
  )
}
