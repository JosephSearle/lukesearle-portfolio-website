import type { Media } from '@/lib/projects';
import Image from 'next/image';

/** Fills its (relatively positioned, aspect-ratio'd) parent. */
export function Still({ media, priority = false }: { media: Media; priority?: boolean }) {
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      priority={priority}
      className="object-cover"
    />
  );
}
