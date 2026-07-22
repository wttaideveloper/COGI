import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { applyTheme, defaultSiteConfig, fetchSiteConfig, type SiteConfig } from '@/lib/siteConfig'

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig)

  useEffect(() => {
    let active = true
    fetchSiteConfig().then((next) => {
      if (!active) return
      setConfig(next)
      applyTheme(next.theme)
    })
    return () => {
      active = false
    }
  }, [])

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
