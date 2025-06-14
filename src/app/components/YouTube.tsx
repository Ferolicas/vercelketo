interface YouTubeProps {
  value: { url: string };
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes("youtube.com")) {
      const params = new URLSearchParams(parsed.search);
      return params.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

export default function YouTube({ value }: YouTubeProps) {
  const videoId = value?.url ? extractVideoId(value.url) : null;

  if (!videoId) return null;

  return (
    <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Reproductor de vídeo de YouTube"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}