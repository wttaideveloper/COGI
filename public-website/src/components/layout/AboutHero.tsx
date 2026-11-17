import { NavLink } from 'react-router-dom'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { PhotoHero, type PhotoHeroProps } from './PhotoHero'

export function AboutHero(props: PhotoHeroProps) {
  const { headerNav } = useSiteConfig()
  const group = headerNav.find(item => item.href === '/about')
  const links = group?.children?.filter(item => item.visible !== false && item.href) || []

  return (
    <>
      <PhotoHero {...props} />
      {links.length > 0 && (
        <nav className="about-navigation" aria-label="About Us pages">
          <div>{links.map(link => <NavLink key={link.id} to={link.href!} end>{link.label}</NavLink>)}</div>
        </nav>
      )}
    </>
  )
}
