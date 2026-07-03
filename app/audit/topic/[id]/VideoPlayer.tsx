"use client";

import dynamic from "next/dynamic";
import "plyr-react/plyr.css";

// 1. We dynamically import the package to completely disable Server-Side Rendering (SSR).
// 2. We use .then() to manually catch the export and bypass Turbopack's strict check.
const Plyr = dynamic(
  () => import("plyr-react").then((mod: any) => mod.Plyr || mod.default),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex aspect-video w-full items-center justify-center bg-black font-bold text-zinc-500">
        Loading Player...
      </div>
    )
  }
);

export default function VideoPlayer({ youtubeId }: { youtubeId: string }) {
  const plyrOptions = {
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'
    ],
    youtube: {
      noCookie: true,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1
    }
  };

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
      <style>{`
        .plyr {
          --plyr-color-main: #dc2626; /* CA Audit Red */
          --plyr-video-background: #000;
        }
      `}</style>
      
      <Plyr
        source={{
          type: "video",
          sources: [{ src: youtubeId, provider: "youtube" }],
        }}
        options={plyrOptions}
      />
    </div>
  );
}
