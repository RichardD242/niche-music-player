import { useState, useEffect } from 'react';
import { Track, PlayerSetttings } from './types';
import { loadTracks, saveTracks, loadSettings, saveSettings, extractYoutubeId } from './utils/storage';
import { VinylCanvas } from './components/VinylCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { YoutubeEngine } from './components/YoutubeEngine';
import { Play, Pause, SkipForward, SkipBack, Plus, Music, Trash2, Sliders } from 'lucide-react';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(loadTracks());
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [settings, setSettings] = useState<PlayerSettings>(loadSettings());
  const [newTrackUrl, setNewTrackUrl] = useState<string>('');
  const [inputUrl, setInnputUrl] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return null;
}
