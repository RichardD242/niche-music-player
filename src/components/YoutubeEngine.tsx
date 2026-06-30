import { useEffect, useRef, useState } from 'react';

interface YoutTubeEngieProps {
    youtubeId: string;
    isPlaying: boolean;
    volume: number;
    onTrackEnd: () => void;
}

export const YoutubeEngine = ({ youtubeId, isPlaying, volume, onTrackEnd }: YoutTubeEngieProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(false);
    }, [youtubeId]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://www.youtube.com') return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'onStateChange' && data.info === 0) {
                    onTrackEnd();
                }
            } catch {
                return;
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, [onTrackEnd]);

    const postCommand = (command: string, args: any[] = []) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: command, args }),
                'https://www.youtube.com'
            );
        }
    };

    useEffect(() => {
        if (!isReady) return;
        postCommand(isPlaying ? 'playVideo' : 'pauseVideo');
    }, [isReady, isPlaying, youtubeId]);

    useEffect(() => {
        if (!isReady) return;
        postCommand('setVolume', [volume]);
    }, [isReady, volume, youtubeId]);

    return (
        <iframe
            ref={iframeRef}
            onLoad={() => setIsReady(true)}
            className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&rel=0&autoplay=${isPlaying ? 1 : 0}&origin=${window.location.origin}`}
            allow="autoplay"
            title="YouTube Player"
        />
    );
};
