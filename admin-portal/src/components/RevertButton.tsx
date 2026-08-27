import { useState } from 'react'
import { revertSiteConfig, type SiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'

export function RevertToLiveButton({
  disabled,
  onReverted,
}: {
  disabled?: boolean
  onReverted: (config: SiteConfig) => void
}) {
  const [busy, setBusy] = useState(false)

  async function revert() {
    if (!window.confirm('Revert to the last published version? Draft changes on this screen will be discarded.')) return
    setBusy(true)
    try {
      onReverted(await revertSiteConfig())
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" className="btn-secondary" disabled={disabled || busy} onClick={() => void revert()}>
      {busy ? 'Reverting…' : 'Revert to live'}
    </button>
  )
}
