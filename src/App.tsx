import { useState, useEffect } from 'react';
import type { Track, PlayerSettings } from './types';
import { loadTracks, saveTracks, loadSettings, saveSettings, extractYoutubeId } from './utils/storage';
import { VinylCanvas } from './components/VinylCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { YoutubeEngine } from './components/YoutubeEngine';
import { Play, Pause, SkipForward, SkipBack, Plus, Music, Trash2, Settings } from 'lucide-react';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(loadTracks);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [settings, setSettings] = useState<PlayerSettings>(loadSettings);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    saveTracks(tracks);
  }, [tracks]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const currentTrack = tracks[currentIndex];

  const handlePlayPause = () => {
    if (tracks.length > 0) setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYoutubeId(inputUrl);
    if (!ytId) {
      alert('that link dont look right try another one');
      return;
    }

    const newTrack: Track = {
      id: `track-${Date.now()}`,
      youtubeId: ytId,
      title: `track ${tracks.length + 1}`,
      artist: 'from a youtube link'
    };

    setTracks([...tracks, newTrack]);
    setInputUrl('');
    if (tracks.length === 0) {
      setCurrentIndex(0);
    }
  };

  const handleRemoveTrack = (id: string, index: number) => {
    const updated = tracks.filter((t) => t.id !== id);
    setTracks(updated);
    if (index === currentIndex) {
      setIsPlaying(false);
      setCurrentIndex(0);
    } else if (index < currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleClearLibrary = () => {
    setTracks([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    localStorage.removeItem('vinyl_tracks');
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white dark:bg-black text-black dark:text-white transition-colors">
      {currentTrack && (
        <YoutubeEngine
          youtubeId={currentTrack.youtubeId}
          isPlaying={isPlaying}
          onTrackEnd={handleNext}
        />
      )}

      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <VinylCanvas track={currentTrack} isPlaying={isPlaying} settings={settings} />
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex flex-col border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-900">
        {showSettings && (
          <div className="fixed inset-0 z-10" onClick={() => setShowSettings(false)} />
        )}

        <div className="flex justify-end p-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`relative z-20 w-10 h-10 rounded-full border flex items-center justify-center transition ${
              showSettings
                ? 'border-black dark:border-white'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Settings size={16} />
          </button>
        </div>

        <div className="border-b border-neutral-200 dark:border-neutral-900" />

        {showSettings && (
          <SettingsPanel settings={settings} onUpdateSettings={setSettings} onClearLibrary={handleClearLibrary} />
        )}

        <div className="flex-1 flex flex-col px-8 pt-8 overflow-y-auto">
          <span className="text-xs tracking-widest text-neutral-400">play section</span>

          <form onSubmit={handleAddTrack} className="mt-4 flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 p-1.5">
            <input
              type="text"
              placeholder="paste a link here to add it"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent outline-none px-4 text-sm placeholder-neutral-400"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0"
            >
              <Plus size={16} />
            </button>
          </form>

          <div className="mt-6 space-y-1.5">
            {tracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }}
                className={`group flex items-center justify-between rounded-full px-4 py-2.5 text-sm cursor-pointer transition ${
                  idx === currentIndex
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Music size={14} className={idx === currentIndex ? '' : 'text-neutral-400'} />
                  <span className="truncate">{track.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTrack(track.id, idx);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pb-16 pt-6">
          <div className="flex items-center gap-6 rounded-full border border-neutral-200 dark:border-neutral-800 px-6 py-3">
            <button
              onClick={handlePrev}
              disabled={tracks.length <= 1}
              className="text-neutral-400 hover:text-black dark:hover:text-white transition disabled:opacity-30"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={handlePlayPause}
              disabled={tracks.length === 0}
              className="w-11 h-11 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center disabled:opacity-30 transition"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
            </button>

            <button
              onClick={handleNext}
              disabled={tracks.length <= 1}
              className="text-neutral-400 hover:text-black dark:hover:text-white transition disabled:opacity-30"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
