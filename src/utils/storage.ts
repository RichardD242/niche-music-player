import type { Track, PlayerSettings } from '../types';

export const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const loadTracks = (): Track[] => {
    const saved = localStorage.getItem('vinyl_tracks')
    if (!saved) {
        return [
            {
                id: 'default-1',
                youtubeId: 'Vcljvd4Ef_o',
                title: 'Cant tell me nothing',
                artist: 'Kanye West'
            }
        ];
    }
    return JSON.parse(saved);
};

export const saveTracks = (tracks: Track[]): void => {
    localStorage.setItem('vinyl_tracks', JSON.stringify(tracks));
};

export const loadSettings = (): PlayerSettings => {
    const saved = localStorage.getItem('vinyl_settings');
    return saved ? JSON.parse(saved) : { rotationSpeed: 'normal', theme: 'dark' };
};

export const saveSettings = (settings: PlayerSettings): void => {
    localStorage.setItem('vinyl_settings', JSON.stringify(settings));
};