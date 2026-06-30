import type { PlayerSettings } from '../types';

interface SettingsPanelProps {
  settings: PlayerSettings;
  onUpdateSettings: (settings: PlayerSettings) => void;
  onClearLibrary: () => void;
}

export const SettingsPanel = ({ settings, onUpdateSettings, onClearLibrary }: SettingsPanelProps) => {
  return (
    <div className="absolute right-6 top-16 w-72 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-5 space-y-5 shadow-2xl z-20">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest text-neutral-400">appearance</span>
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 p-1">
          {(['dark', 'light'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onUpdateSettings({ ...settings, theme: mode })}
              className={`px-3 py-1 rounded-full text-xs transition ${
                settings.theme === mode
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-neutral-400'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest text-neutral-400">spin speed</span>
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 p-1">
          {(['slow', 'normal', 'fast'] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => onUpdateSettings({ ...settings, rotationSpeed: speed })}
              className={`px-3 py-1 rounded-full text-xs transition ${
                settings.rotationSpeed === speed
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-neutral-400'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClearLibrary}
        className="w-full py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition"
      >
        clear all the tracks
      </button>
    </div>
  );
};
