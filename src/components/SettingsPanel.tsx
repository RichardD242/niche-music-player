import type { PlayerSettings } from '../types';

interface SettingsPanelProps {
  settings: PlayerSettings;
  onUpdateSettings: (settings: PlayerSettings) => void;
  onClearLibrary: () => void;
}

export const SettingsPanel = ({ settings, onUpdateSettings, onClearLibrary }: SettingsPanelProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Configuration</h3>

      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">Turntable Speed</span>
        <div className="flex gap-2">
          {(['slow', 'normal', 'fast'] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => onUpdateSettings({ ...settings, rotationSpeed: speed })}
              className={`px-3 py-1 border text-xs capitalize transition ${
                settings.rotationSpeed === speed
                  ? 'border-white text-white bg-zinc-900'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">Vinyl Finish</span>
        <div className="flex gap-2">
          {(['classic', 'matte'] as const).map((style) => (
            <button
              key={style}
              onClick={() => onUpdateSettings({ ...settings, vinylStyle: style })}
              className={`px-3 py-1 border text-xs capitalize transition ${
                settings.vinylStyle === style
                  ? 'border-white text-white bg-zinc-900'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onClearLibrary}
          className="w-full py-2 border border-red-900/40 hover:border-red-600 text-red-500 text-xs transition"
        >
          Reset Library Cache
        </button>
      </div>
    </div>
  );
};
