import { useState } from 'react';
import type { PlayerSettings } from '../types';

interface SettingsPanelProps {
  settings: PlayerSettings;
  onUpdateSettings: (settings: PlayerSettings) => void;
  onClearLibrary: () => void;
}

const OnOff = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 p-1">
    {([true, false] as const).map((v) => (
      <button
        key={String(v)}
        onClick={() => onChange(v)}
        className={`px-3 py-1 rounded-full text-xs transition ${
          value === v
            ? 'bg-black text-white dark:bg-white dark:text-black'
            : 'text-neutral-400'
        }`}
      >
        {v ? 'on' : 'off'}
      </button>
    ))}
  </div>
);

export const SettingsPanel = ({ settings, onUpdateSettings, onClearLibrary }: SettingsPanelProps) => {
  const [showAmbientMore, setShowAmbientMore] = useState(false);

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
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-1">
          {(['perfect slow', 'slow', 'normal', 'fast'] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => onUpdateSettings({ ...settings, rotationSpeed: speed })}
              className={`px-3 py-1 rounded-xl text-xs transition whitespace-nowrap ${
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-widest text-neutral-400">ambient color</span>
            <button
              onClick={() => setShowAmbientMore((p) => !p)}
              className="text-xs text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 transition"
            >
              {showAmbientMore ? 'less' : 'more'}
            </button>
          </div>
          <OnOff
            value={settings.ambientColor}
            onChange={(v) => onUpdateSettings({ ...settings, ambientColor: v })}
          />
        </div>

        {showAmbientMore && (
          <div className="space-y-3 pl-3 border-l border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest text-neutral-400">animation</span>
              <OnOff
                value={settings.ambientAnimation}
                onChange={(v) => onUpdateSettings({ ...settings, ambientAnimation: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest text-neutral-400">blur</span>
              <OnOff
                value={settings.ambientBlur}
                onChange={(v) => onUpdateSettings({ ...settings, ambientBlur: v })}
              />
            </div>
          </div>
        )}
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
