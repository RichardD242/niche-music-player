import { useState, useEffect, useRef } from 'react';
import type { Track, PlayerSettings } from './types';
import { loadTracks, saveTracks, loadSettings, saveSettings, extractYoutubeId } from './utils/storage';
import { extractColors } from './utils/colors';
import { VinylCanvas } from './components/VinylCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { YoutubeEngine } from './components/YoutubeEngine';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Plus,
  Music,
  Trash2,
  Settings,
  Maximize2,
  Minimize2,
  Pencil,
  Check,
  X,
  Volume2,
  VolumeX,
  Download,
  Upload,
  LayoutGrid,
  Repeat,
  Shuffle,
} from 'lucide-react';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(loadTracks);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [settings, setSettings] = useState<PlayerSettings>(loadSettings);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showCrate, setShowCrate] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [ambientColors, setAmbientColors] = useState<string[]>([]);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [replayCount, setReplayCount] = useState<number>(0);

  const isLoopingRef = useRef(isLooping);
  const isShuffleRef = useRef(isShuffle);
  const tracksRef = useRef(tracks);
  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (!settings.ambientColor || !currentTrack) {
      setAmbientColors([]);
      return;
    }
    extractColors(`https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`)
      .then(setAmbientColors);
  }, [currentTrack, settings.ambientColor]);

  const handlePlayPause = () => {
    if (tracks.length > 0) setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTrackEnd = () => {
    const len = tracksRef.current.length;
    if (len === 0) return;
    if (isLoopingRef.current) {
      setReplayCount((c) => c + 1);
      return;
    }
    if (isShuffleRef.current) {
      setCurrentIndex((prev) => {
        let next = Math.floor(Math.random() * len);
        if (len > 1 && next === prev) next = (next + 1) % len;
        return next;
      });
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % len);
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isPlaying, tracks, currentIndex, isShuffle]);

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
      description: 'from a youtube link',
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

  const handleExportPlaylist = () => {
    if (tracks.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tracks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'vinyl_playlist.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportPlaylist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setTracks(parsed);
            setCurrentIndex(0);
            setIsPlaying(false);
          } else {
            alert('Wrong file format');
          }
        } catch {
          alert('Error reading file');
        }
      };
    }
  };

  const handleStartEdit = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    setEditingId(track.id);
    setEditTitle(track.title);
    setEditDescription(track.description);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };
  
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setTracks(
      tracks.map((t) =>
        t.id === editingId
          ? { ...t, title: editTitle.trim() || t.title, description: editDescription.trim() }
          : t
      )
    );
    setEditingId(null);
  };

  const handleToggleShuffle = () => {
    if (isShuffle) {
      setIsShuffle(false);
    } else {
      setIsShuffle(true);
      setIsLooping(false);
      if (tracks.length > 1) {
        let next = Math.floor(Math.random() * tracks.length);
        if (next === currentIndex) next = (next + 1) % tracks.length;
        setCurrentIndex(next);
        setIsPlaying(true);
      }
    }
  };

  const activeIconStyleDark = settings.theme === 'dark'
    ? { backgroundColor: '#fff', color: '#000' }
    : { backgroundColor: '#000', color: '#fff' };

  const transportControls = (
    <div className="flex items-center gap-5 rounded-full border border-neutral-200 dark:border-neutral-800 px-6 py-3">
      <button
        onClick={handleToggleShuffle}
        disabled={tracks.length <= 1}
        className="p-1.5 rounded-full transition disabled:opacity-30"
        style={isShuffle ? activeIconStyleDark : {}}
      >
        <Shuffle size={15} className={isShuffle ? '' : 'text-neutral-400'} />
      </button>

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

      <button
        onClick={() => { setIsLooping((l) => !l); setIsShuffle(false); }}
        disabled={tracks.length === 0}
        className="p-1.5 rounded-full transition disabled:opacity-30"
        style={isLooping ? activeIconStyleDark : {}}
      >
        <Repeat size={15} className={isLooping ? '' : 'text-neutral-400'} />
      </button>
    </div>
  );

  const volumeControl = (
    <div className="flex items-center gap-3 rounded-full border border-neutral-200 dark:border-neutral-800 px-5 py-3">
      {settings.volume === 0 ? (
        <VolumeX size={18} className="text-neutral-400 shrink-0" />
      ) : (
        <Volume2 size={18} className="text-neutral-400 shrink-0" />
      )}
      <input
        type="range"
        min={0}
        max={100}
        value={settings.volume}
        onChange={(e) => setSettings({ ...settings, volume: Number(e.target.value) })}
        className="w-40 accent-black dark:accent-white"
      />
    </div>
  );

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white dark:bg-black text-black dark:text-white transition-colors">

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportPlaylist}
        accept=".json"
        className="hidden"
      />

      {currentTrack && (
        <YoutubeEngine
          key={`${currentTrack.youtubeId}-${replayCount}`}
          youtubeId={currentTrack.youtubeId}
          isPlaying={isPlaying}
          volume={settings.volume}
          onTrackEnd={handleTrackEnd}
        />
      )}

      <div
        className={`relative h-1/2 md:h-full transition-all duration-700 ease-in-out ${
          isFullscreen ? 'w-full' : 'w-full md:w-1/2'
        }`}
      >
        {settings.ambientColor && ambientColors.length > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {ambientColors.map((color, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: color,
                  filter: settings.ambientBlur ? 'blur(100px)' : 'none',
                  opacity: 0.6,
                  mixBlendMode: 'screen',
                  width: ['65%', '60%', '70%', '60%'][i],
                  height: ['65%', '60%', '70%', '60%'][i],
                  top: ['5%', '35%', '20%', '45%'][i],
                  left: ['5%', '30%', '40%', '5%'][i],
                  animation: settings.ambientAnimation
                    ? `ambientDrift${i} ${[18, 24, 20, 26][i]}s ease-in-out infinite alternate`
                    : 'none',
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <VinylCanvas
          track={currentTrack}
          isPlaying={isPlaying}
          settings={settings}
          isFullscreen={isFullscreen}
          controls={
            <div className="flex flex-col items-start gap-4">
              {transportControls}
              {volumeControl}
            </div>
          }
        />
      </div>

      <div
        className={`relative flex flex-col border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-900 transition-all duration-700 ease-in-out overflow-hidden ${
          isFullscreen ? 'w-0 h-0 md:h-full opacity-0' : 'w-full md:w-1/2 h-1/2 md:h-full opacity-100'
        }`}
      >
        {(showSettings || showCrate) && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => { setShowSettings(false); setShowCrate(false); }}
          />
        )}

        <div className="flex justify-end gap-2 p-6">
          <button
            onClick={() => { setShowCrate(!showCrate); setShowSettings(false); }}
            className={`relative z-20 w-10 h-10 rounded-full border flex items-center justify-center transition ${
              showCrate
                ? 'border-black dark:border-white'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => { setShowSettings(!showSettings); setShowCrate(false); }}
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

        {showCrate && (
          <div className="absolute inset-x-0 top-[73px] bottom-0 z-20 bg-white dark:bg-black overflow-y-auto">
            <div className="grid grid-cols-3 gap-px bg-neutral-100 dark:bg-neutral-900">
              {tracks.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => { setCurrentIndex(idx); setIsPlaying(true); setShowCrate(false); }}
                  className="relative aspect-square overflow-hidden bg-neutral-200 dark:bg-neutral-800 group"
                >
                  <img
                    src={`https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`}
                    alt={track.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  {idx === currentIndex && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-black dark:ring-white" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col px-8 pt-8 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-widest text-neutral-400">play section</span>
              {tracks.length > 0 && (
                <span className="text-xs text-neutral-400">{currentIndex + 1} / {tracks.length}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleExportPlaylist}
                disabled={tracks.length === 0}
                title="export playlist"
                className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center transition disabled:opacity-30"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="import playlist"
                className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
              >
                <Upload size={14} />
              </button>
            </div>
          </div>

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
                onClick={() => {
                  if (editingId === track.id) return;
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                }}
                className={`group flex items-center justify-between rounded-full px-4 py-2.5 text-sm cursor-pointer transition ${
                  idx === currentIndex
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {editingId === track.id ? (
                  <form
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={handleSaveEdit}
                    className="flex-1 flex items-center gap-2 rounded-full bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 px-3 py-1.5"
                  >
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="title"
                      className="flex-1 min-w-0 bg-transparent outline-none text-sm text-black dark:text-white"
                    />
                    <input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="description"
                      className="flex-1 min-w-0 bg-transparent outline-none text-sm text-black dark:text-white"
                    />
                    <button type="submit" className="shrink-0 text-neutral-400 hover:text-black dark:hover:text-white transition">
                      <Check size={14} />
                    </button>
                    <button type="button" onClick={handleCancelEdit} className="shrink-0 text-neutral-400 hover:text-black dark:hover:text-white transition">
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Music size={14} className={idx === currentIndex ? '' : 'text-neutral-400'} />
                      <span className="truncate">{track.title}</span>
                      {idx === currentIndex && isLooping && (
                        <span className="text-xs shrink-0 opacity-60 font-medium">On Repeat</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button onClick={(e) => handleStartEdit(e, track)} className="p-1">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTrack(track.id, idx);
                        }}
                        className="p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pb-16 pt-6">
          {transportControls}
          {volumeControl}
        </div>
      </div>
    </div>
  );
}
