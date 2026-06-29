import type { Track, PlayerSettings } from '../types';

interface VinylCanvasProps {
    track: Track | undefined;
    isPlaying: boolean;
    settings: PlayerSettings;
}

export const VinylCanvas = ({ track, isPlaying, settings }: VinylCanvasProps) => {
    const getSpeedClass = () => {
        if (settings.rotationSpeed === 'slow') return 'animation-duration-[30s]';
        if (settings.rotationSpeed === 'fast') return 'animation-duration-[12s]';
        return '';
    };

    const thumbnailUrl = track
        ? `https://img.youtube.com/vi/${track.youtubeId}/maxresdefault.jpg`
        : 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=500';

    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-950 p-12">
            <div className="relative aspect-square w-full max-w-[440px] flex items-center justify-center">
                <div
                    className={`absolute inset-0 rounded-full bg-black shadow-2xl transition-all duration-700 border border-zinc-900 flex items-center justify-center animate-spin-slow ${getSpeedClass()} ${!isPlaying ? 'animation-paused' : ''}`}
                >
                    <div className="absolute inset-4 rounded-full border border-zinc-900/30 border-dashed" />
                    <div className="absolute inset-12 rounded-full border border-zinc-800/20" />
                    <div className="absolute inset-20 rounded-full border border-zinc-900/30 border-dashed" />
                    <div className="absolute inset-28 rounded-full border border-zinc-800/20" />

                    {settings.vinylStyle === 'classic' && (
                        <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent opacity-60 mix-blend-overlay transform rotate-45" />
                    )}

                    <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-zinc-900 relative flex items-center justify-center bg-zinc-800">
                        <img
                            src={thumbnailUrl}
                            alt="Album Artwork"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${track?.youtubeId}/hqdefault.jpg`;
                            }}
                        />
                        <div className="absolute w-4 h-4 bg-zinc-950 rounded-full border-2 border-zinc-900 shadow-inner" />
                    </div>
                </div>

                <div className={`absolute top-0 right-4 w-32 h-32 origin-top-right transition-transform duration-700 pointer-events-none transform ${isPlaying ? 'rotate-[18deg]' : 'rotate-0'}`}>
                    <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-400 drop-shadow-md">
                        <path d="M90,10 L40,15 L45,65 L35,70 L38,80 L52,75 L48,63 L42,23 L85,18 Z" fill="currentColor" />
                        <circle cx="38" cy="75" r="5" fill="#18181b" />
                    </svg>
                </div>
            </div>
        </div>
    );
};