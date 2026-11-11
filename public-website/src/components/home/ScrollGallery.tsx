import type { RefObject } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MediaPreview } from '@/components/ui/MediaPreview'

type Photo = { imageUrl: string; alt?: string }

export function ScrollGallery({ photos, reduced, scene }: { scene: RefObject<HTMLElement | null>; photos: Photo[]; reduced: boolean }) {
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start start', 'end 75%'] })
  const turn = useTransform(scrollYProgress, [0, 1], [12, -232])
  return (
    <div className="scroll-gallery">
      <motion.div className="scroll-gallery-wheel" style={{ rotateY: reduced ? 0 : turn }}>
        {photos.slice(0, reduced ? 1 : 3).map((photo, index) => (
          <div key={index} className="scroll-gallery-face" style={{ transform: `rotateY(${index * 120}deg) translateZ(var(--gallery-depth))` }}>
            <MediaPreview src={photo.imageUrl} alt={photo.alt || 'Fellowship photograph'} className="h-full w-full" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
