import { useState } from 'react'
import { revertSiteConfig, type RevertScope, type SiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'

export function RevertToLiveButton({
  scope,
  disabled,
  onReverted,
}: {
  scope: RevertScope
  disabled?: boolean
  onReverted: (config: SiteConfig) => void
}) {
  const [busy, setBusy] = useState(false)

  async function revert() {
    if (!window.confirm('Revert only the changes on this screen to the last published version? Drafts on other screens will stay.')) return
    setBusy(true)
    try {
      onReverted(await revertSiteConfig(scope))
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
