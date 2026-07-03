"use client";

import dynamic from "next/dynamic";
import "plyr-react/plyr.css";

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
) as any;

export default function VideoPlayer({ youtubeId }: { youtubeId: string }) {
    const plyrOptions = {
    controls: [
      'play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'
    ],
    settings: ['speed'], 
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
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
          --plyr-color-main: #dc2626;
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
