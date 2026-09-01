import { useState } from 'react'
import { restoreDraftSnapshot, revertSiteConfig, type RevertScope, type SiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'

export function UndoDraftButton({
  scope,
  disabled,
  onRestored,
}: {
  scope: RevertScope
  disabled?: boolean
  onRestored: (config: SiteConfig) => void
}) {
  const [busy, setBusy] = useState(false)

  async function undo() {
    if (!window.confirm('Undo unsaved edits on this screen and restore the last saved draft?')) return
    setBusy(true)
    try {
      onRestored(restoreDraftSnapshot(scope))
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" className="btn-secondary" disabled={disabled || busy} onClick={() => void undo()}>
      {busy ? 'Undoing…' : 'Undo draft'}
    </button>
  )
}

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
    if (!window.confirm('Restore this screen to the last published live version? Drafts on other screens will stay.')) return
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
