import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { loadSettings, saveSettings } from './utils/storage';

const steps = [
  {
    title: 'add a song',
    body: 'paste any youtube link into the box at the top of the list and hit the plus button (tip: type album cover at the end of your yt search)',
  },
  {
    title: 'play and pause',
    body: 'hit the big circle button in the middle or just press space on your keyboard',
  },
  {
    title: 'skip songs',
    body: 'use the skip buttons on the player or press the left and right arrow key',
  },
  {
    title: 'shuffle',
    body: 'press the shuffle button on the left of the controls',
  },
  {
    title: 'loop',
    body: 'press the repeat button on the right of the controls (to turn it off just press it again)',
  },
  {
    title: 'rename a song',
    body: 'hover over any song in the list and click the pencil (you can rename it and add a description)',
  },
  {
    title: 'reorrder songs',
    body: 'for chaning the order just hover over a song and drag on the grid icon to move it around',
  },
  {
    title: 'browse your playlist',
    body: 'click the box icon at the top right to see all your songs as covers (thumbnails) click a cover to play it',
  },
  {
    title: 'settings',
    body: 'click the gear icon at the top right you can switch between dark and light mode change the spin speed and adjust the ambient color backgruound',
  },
  {
    title: 'export and import',
    body: 'hit the download icon next to play section to save your playlist as a json then hit the upload icon to load your saved playlist back in',
  },
  {
    title: 'fullscreen',
    body: 'press the expand icon at the top right of the disk side to go fullscreen (press it again to go back)',
  },
  {
    title: 'BEFORE YOU START',
    body: 'the whole project runs on your localstorage inside your browser so nothing gets unless you delete the cache or clear browser data',
  },
];

export default function Tutorial() {
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

        <h1 className="text-3xl font-semibold mb-2">how to use this</h1>
        <p className="text-neutral-400 text-sm mb-16">everything you need to know</p>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6">
              <span className="text-xs text-neutral-300 dark:text-neutral-700 pt-1 w-5 shrink-0 text-right">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-medium mb-1">{step.title}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
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
