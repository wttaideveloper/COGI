import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { applyTheme, defaultSiteConfig, fetchSiteConfig, type SiteConfig } from '@/lib/siteConfig'

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig)
const PUBLISH_CHANNEL = 'cogi-cms-publish'

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig)
  const queryClient = useQueryClient()

  useEffect(() => {
    let active = true

    async function load(invalidateContent = false) {
      const next = await fetchSiteConfig()
      if (!active) return
      setConfig(next)
      applyTheme(next.theme)
      if (invalidateContent) void queryClient.invalidateQueries()
    }

    void load(true)

    const onFocus = () => { void load(true) }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load(true)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'cogi_cms_published_at') void load(true)
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('storage', onStorage)

    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel(PUBLISH_CHANNEL)
      channel.onmessage = () => { void load(true) }
    } catch {
      channel = null
    }

    const poll = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load(true)
    }, 8000)

    return () => {
      active = false
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('storage', onStorage)
      channel?.close()
      window.clearInterval(poll)
    }
  }, [queryClient])

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
