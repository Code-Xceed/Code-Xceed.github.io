import React, { useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { gmailCompose } from '../email';

/**
 * Primary contact action.
 *
 * A plain link to Gmail compose: it works regardless of whether the visitor has
 * a desktop mail client, and there is no floating media to cover surrounding
 * copy. The handshake clip plays inside the pill on hover or focus.
 */
export default function ContactDealButton() {
  const [active, setActive] = useState(false);
  const videoRef = useRef(null);

  const play = () => {
    setActive(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const stop = () => {
    setActive(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <a
      href={gmailCompose()}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className="pressable group relative h-11 w-[168px] px-3.5 rounded-full bg-[#161514] text-[#FAFAF8] text-sm font-medium hover:bg-[#2B2927] shadow-[0_2px_10px_rgba(22,21,20,0.08)] inline-flex items-center justify-center gap-2 transition-colors duration-200 select-none"
      aria-label="Email Aditya on Gmail"
    >
      <span className="relative h-6 w-6 rounded-full overflow-hidden bg-white/10 shrink-0">
        <video
          ref={videoRef}
          src="/cat-handshake.mp4"
          poster="/cat-handshake-thumb.webp"
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {!active && (
          <Mail className="absolute inset-0 m-auto w-3.5 h-3.5 text-[#FAFAF8]/80" aria-hidden="true" />
        )}
      </span>

      <span className="relative h-5 overflow-hidden" aria-hidden="true">
        <span
          className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: active ? 'translateY(-20px)' : 'translateY(0)' }}
        >
          <span className="h-5 leading-5 tracking-tight">Get in touch</span>
          <span className="h-5 leading-5 tracking-tight">Let&apos;s talk</span>
        </span>
      </span>
    </a>
  );
}
