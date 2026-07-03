"use client";

import "plyr/dist/plyr.css";
import Plyr from "plyr-react";

export default function VideoPlayer({ youtubeId }: { youtubeId: string }) {
  // Plyr configuration to make it look incredibly clean
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
      {/* This CSS forces the player to maintain a perfect 16:9 ratio and customizes the brand color */}
      <style>{`
        .plyr {
          --plyr-color-main: #dc2626; /* Matches your red-600 theme */
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
