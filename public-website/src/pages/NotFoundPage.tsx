import { Link } from 'react-router-dom'
import { SEO } from '@/components/ui/SEO'
import { ButtonLink } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" />
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-display text-8xl font-bold text-teal-deep/20">404</p>
        <h1 className="mt-4 font-display text-3xl text-teal-deep">Page Not Found</h1>
        <p className="mt-4 text-ink-muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-8 flex gap-4">
          <ButtonLink to="/">Go Home</ButtonLink>
          <Link to="/contact" className="rounded-md border-2 border-teal-deep px-6 py-3 font-semibold text-teal-deep hover:bg-teal-deep hover:text-white">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  )
}
