import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-0 z-50 m-auto max-h-[90vh] w-[min(90vw,560px)] overflow-y-auto rounded-xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/50',
        !isOpen && 'hidden',
      )}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <div className="sticky top-0 flex items-center justify-between border-b border-mist-dark bg-white px-6 py-4">
        <h2 id="modal-title" className="font-display text-xl font-semibold text-teal-deep">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-ink-muted hover:bg-mist-dark hover:text-ink"
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="px-6 py-6">{children}</div>
    </dialog>
  )
}
