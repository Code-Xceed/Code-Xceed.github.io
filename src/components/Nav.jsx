import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { gmailCompose } from '../email';

/**
 * One navigation bar for every entry.
 * Home: brand + links. Sub-pages: back + links + section pill.
 * Contact opens Gmail compose so it works without a desktop mail client.
 */

export default function Nav({ onNavigate, back = false, label, labelIcon = null }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const onHome = pathname === '/' || pathname === '';

  const go = (href) => (event) => {
    event.preventDefault();
    if (href === '/') {
      if (onNavigate) onNavigate('/');
      return;
    }
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  };

  const goWork = (event) => {
    event.preventDefault();
    if (onHome) {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (onNavigate) onNavigate('/');
    window.setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 420);
  };

  return (
    <header className="relative z-40 w-full max-w-3xl mx-auto px-6 sm:px-8 pt-5 sm:pt-6 safe-top select-none">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[rgba(22,21,20,0.08)]">
        {back ? (
          <a
            href="/"
            onClick={go('/')}
            className="pressable group inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 -ml-1 sm:-ml-2 rounded-lg text-[11px] sm:text-xs font-mono text-[#57534E] hover:text-[#161514] hover:bg-black/[0.04] active:scale-95 transition-all duration-150"
            aria-label="Back to home page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-500 group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span className="hidden sm:inline">Back</span>
          </a>
        ) : (
          <a
            href="/"
            onClick={goWork}
            className="text-[12px] sm:text-[13px] font-medium text-[#161514] tracking-tight py-1.5 hover:opacity-70 transition-opacity"
          >
            Aditya Rathore
          </a>
        )}

        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-5 text-[11px] sm:text-xs font-mono text-[#57534E]">
          <button type="button" onClick={goWork} className="py-1.5 hover:text-[#161514] transition-colors">
            Work
          </button>
          <a href="/interests/video-editing/" onClick={go('/interests/video-editing/')} className="py-1.5 hover:text-[#161514] transition-colors">
            Video
          </a>
          <a href={gmailCompose()} target="_blank" rel="noopener noreferrer" className="py-1.5 hover:text-[#161514] transition-colors">
            Contact
          </a>
        </nav>

        {label ? (
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/[0.04] border border-black/[0.06] select-none shrink-0">
            {labelIcon}
            <span className="text-[11px] font-mono font-medium text-[#161514] whitespace-nowrap">{label}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
