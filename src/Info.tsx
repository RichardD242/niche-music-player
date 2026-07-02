import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { loadSettings, saveSettings } from './utils/storage';

export default function Info() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadSettings().theme);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'hidden'; };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const s = loadSettings();
    saveSettings({ ...s, theme });
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-16 md:px-20 md:py-24">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <a
            href="/"
            className="text-xs tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            back
          </a>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center transition"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <h1 className="text-3xl font-semibold mb-2">Niche Music Player</h1>
        <p className="text-neutral-400 text-sm mb-16">clean, no accounts, no tracking, no ads, minimal, private, open source</p>
        <p className="text-neutral-400 text-sm mb-16">non-commercial open-source educational project, all rights to artists and content creators</p>

        <div className="space-y-16">
          <div>
            <p className="text-sm text-neutral-500 leading-relaxed mb-1">made by</p>
            <p className="text-lg font-medium">richard</p>
          </div>

          <a
            href="https://github.com/RichardD242/niche-music-player"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 px-6 py-5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition group"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 text-black dark:text-white fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">RichardD242</p>
              <p className="text-xs text-neutral-400 mt-0.5">source code</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>

        <div className="mt-24 pt-8 border-t border-neutral-100 dark:border-neutral-900">
          <a
            href="/"
            className="text-xs tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            back to the player
          </a>
        </div>
      </div>
    </div>
  );
}
