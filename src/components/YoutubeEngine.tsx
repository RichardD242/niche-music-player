import { useEffect, useRef } from 'react';

let ytReady = false;
const ytQueue: (() => void)[] = [];

function ensureYTApi(cb: () => void) {
  if (ytReady) { cb(); return; }
  ytQueue.push(cb);
  if (document.getElementById('yt-script')) return;
  const s = document.createElement('script');
  s.id = 'yt-script';
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
  (window as any).onYouTubeIframeAPIReady = () => {
    ytReady = true;
    ytQueue.splice(0).forEach(f => f());
  };
}

interface YoutubeEngineProps {
  youtubeId: string;
  isPlaying: boolean;
  volume: number;
  onTrackEnd: () => void;
  onTimeUpdate: (current: number, duration: number) => void;
  seekTarget: number | null;
  onSeeked: () => void;
}

export const YoutubeEngine = ({
  youtubeId,
  isPlaying,
  volume,
  onTrackEnd,
  onTimeUpdate,
  seekTarget,
  onSeeked,
}: YoutubeEngineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);
  const onTrackEndRef = useRef(onTrackEnd);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { onTrackEndRef.current = onTrackEnd; }, [onTrackEnd]);
  useEffect(() => { onTimeUpdateRef.current = onTimeUpdate; }, [onTimeUpdate]);

  useEffect(() => {
    const el = document.createElement('div');
    containerRef.current?.appendChild(el);
    let player: any;
    let interval: ReturnType<typeof setInterval>;

    ensureYTApi(() => {
      player = new (window as any).YT.Player(el, {
        videoId: youtubeId,
        playerVars: { controls: 0, rel: 0, playsinline: 1, enablejsapi: 1 },
        events: {
          onReady(e: any) {
            playerRef.current = player;
            e.target.setVolume(volumeRef.current);
            if (isPlayingRef.current) e.target.playVideo();
            interval = setInterval(() => {
              if (!player || typeof player.getCurrentTime !== 'function') return;
              onTimeUpdateRef.current(player.getCurrentTime() ?? 0, player.getDuration() ?? 0);
            }, 500);
          },
          onStateChange(e: any) {
            if (e.data === 0) onTrackEndRef.current();
          },
        },
      });
    });

    return () => {
      clearInterval(interval);
      player?.destroy?.();
      el.remove();
      playerRef.current = null;
    };
  }, [youtubeId]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    isPlaying ? p.playVideo?.() : p.pauseVideo?.();
  }, [isPlaying]);

  useEffect(() => {
    playerRef.current?.setVolume?.(volume);
  }, [volume]);

  useEffect(() => {
    if (seekTarget === null) return;
    playerRef.current?.seekTo?.(seekTarget, true);
    onSeeked();
  }, [seekTarget]);

  return <div ref={containerRef} className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none" />;
};
