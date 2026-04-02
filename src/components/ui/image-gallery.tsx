import { cn } from '@/lib/utils'

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop',
] as const

type ImageGalleryProps = {
  title?: string
  subtitle?: string
  images?: readonly string[]
  className?: string
}

/**
 * Horizontal strip gallery: hovered column grows (desktop). Uses site typography.
 */
export function ImageGallery({
  title = 'Our Latest Creations',
  subtitle = 'A visual collection of our most recent works – each piece crafted with intention, emotion, and style.',
  images = DEFAULT_IMAGES,
  className,
}: ImageGalleryProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col items-center justify-start py-12',
        className,
      )}
    >
      <div className="max-w-3xl px-4 text-center">
        <h2 className="font-heading text-2xl uppercase tracking-tight text-text sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-light">{subtitle}</p>
      </div>

      <div className="mt-10 flex h-[400px] w-full max-w-5xl items-center gap-2 px-4">
        {images.map((src) => (
          <div
            key={src}
            className="group relative h-[400px] w-56 flex-grow overflow-hidden rounded-lg transition-all duration-500 hover:w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover object-center"
              src={src}
              alt=""
            />
          </div>
        ))}
      </div>
    </section>
  )
}
