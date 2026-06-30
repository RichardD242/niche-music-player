import type { Track, PlayerSettings } from '../types';

interface VinylCanvasProps {
    track: Track | undefined;
    isPlaying: boolean;
    settings: PlayerSettings;
    isFullscreen: boolean;
    controls: React.ReactNode;
}

export const VinylCanvas = ({ track, isPlaying, settings, isFullscreen, controls }: VinylCanvasProps) => {
    const duration = settings.rotationSpeed === 'slow' ? '24s' : settings.rotationSpeed === 'fast' ? '9s' : '15s';

    const thumbnailUrl = track ? `https://img.youtube.com/vi/${track.youtubeId}/maxresdefault.jpg` : null;
    const sourceUrl = track ? `https://www.youtube.com/watch?v=${track.youtubeId}` : null;

    return (
        <div
            className={`w-full h-full flex items-center justify-center gap-10 p-12 transition-all duration-700 ease-in-out ${
                isFullscreen ? 'flex-row' : 'flex-col'
            }`}
        >
            <div
                className={`relative aspect-square rounded-full bg-black flex items-center justify-center shrink-0 transition-all duration-700 ease-in-out ${
                    isFullscreen ? 'w-[min(620px,60vw)]' : 'w-full max-w-[480px]'
                }`}
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
            </div>

            {isFullscreen ? (
                <div className="max-w-lg space-y-5">
                    <p className="text-5xl font-semibold truncate text-black dark:text-white">
                        {track ? track.title : 'nothing is loaded yet'}
                    </p>
                    <p className="text-xl text-neutral-500">
                        {track ? track.description : 'add a link to get started'}
                    </p>
                    {sourceUrl && (
                        <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-base underline underline-offset-4 text-neutral-400 hover:text-black dark:hover:text-white transition"
                        >
                            open the original link
                        </a>
                    )}
                    <div className="pt-4">{controls}</div>
                </div>
            ) : (
                <div className="text-center max-w-[320px]">
                    <p className="text-sm font-medium truncate text-black dark:text-white">
                        {track ? track.title : 'nothing is loaded yet'}
                    </p>
                    <p className="text-xs truncate text-neutral-500">
                        {track ? track.description : 'add a link to get started'}
                    </p>
                </div>
            )}
        </div>
    );
};
