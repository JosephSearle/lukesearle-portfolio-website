import type { Video } from '@/lib/projects';

export function VideoPlayer({ video, fallbackTitle }: { video: Video; fallbackTitle: string }) {
  const title = video.title ?? fallbackTitle;
  if (video.src) {
    return (
      // biome-ignore lint/a11y/useMediaCaption: captions are not part of the content schema yet
      <video
        controls
        preload="metadata"
        poster={video.poster}
        aria-label={title}
        className="h-full w-full bg-black object-contain"
      >
        <source src={video.src} />
      </video>
    );
  }
  return (
    <iframe
      src={video.url}
      title={title}
      loading="lazy"
      allow="fullscreen; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="h-full w-full border-0"
    />
  );
}
