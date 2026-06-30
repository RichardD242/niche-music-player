import type { Track, PlayerSettings } from '../types';

interface VinylCanvasProps {
    track: Track | undefined;
    isPlaying: boolean;
    settings: PlayerSettings;
}

export const VinylCanvas = ({ track, isPlaying, settings }: VinylCanvasProps) => {
    const duration = settings.rotationSpeed === 'slow' ? '24s' : settings.rotationSpeed === 'fast' ? '9s' : '15s';

    const thumbnailUrl = track ? `https://img.youtube.com/vi/${track.youtubeId}/maxresdefault.jpg` : null;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12">
            <div
                className="relative aspect-square w-full max-w-[480px] rounded-full bg-black flex items-center justify-center"
                style={{
                    animation: `disc-spin ${duration} linear infinite`,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                }}
            >
                <div className="absolute inset-[6%] rounded-full overflow-hidden bg-neutral-800">
                    {thumbnailUrl && (
                        <img
                            src={thumbnailUrl}
                            alt="cover art"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                if (track) (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`;
                            }}
                        />
                    )}
                </div>
                <div className="absolute w-3.5 h-3.5 rounded-full bg-black ring-1 ring-white/20" />
            </div>

            <div className="text-center max-w-[320px]">
                <p className="text-sm font-medium truncate text-black dark:text-white">
                    {track ? track.title : 'nothing is loaded yet'}
                </p>
                <p className="text-xs truncate text-neutral-500">
                    {track ? track.artist : 'add a link to get started'}
                </p>
            </div>
        </div>
    );
};
