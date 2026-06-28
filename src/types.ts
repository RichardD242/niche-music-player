export interface Track {
    id: string;
    youtubeId: string;
    title: string;
    artist: string;
}

export interface PlayerSettings {
    rotationSpeed: 'slow' | 'normal' | 'fast';
    vinylStyle: 'classic' | 'matte';
}

export interface PlayerState {
    tracks: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    settings: PlayerSettings;
}