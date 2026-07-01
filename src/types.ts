export interface Track {
    id: string;
    youtubeId: string;
    title: string;
    description: string;
}

export interface PlayerSettings {
    rotationSpeed: 'perfect slow' | 'slow' | 'normal' | 'fast';
    theme: 'dark' | 'light';
    volume: number;
    ambientColor: boolean;
    ambientBlur: boolean;
    ambientAnimation: boolean;
}

export interface PlayerState {
    tracks: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    settings: PlayerSettings;
}