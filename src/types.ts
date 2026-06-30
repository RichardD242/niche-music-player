export interface Track {
    id: string;
    youtubeId: string;
    title: string;
    description: string;
}

export interface PlayerSettings {
    rotationSpeed: 'slow' | 'normal' | 'fast';
    theme: 'dark' | 'light';
    volume: number;
}

export interface PlayerState {
    tracks: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    settings: PlayerSettings;
}