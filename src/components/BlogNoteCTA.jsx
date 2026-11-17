import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';

const EMAIL = 'aditya.rathore10101@gmail.com';

/**
 * Closing block on each note. No form, no endpoint: a real mailto so the
 * promise in the copy is one a static site can keep.
 */
export default function BlogNoteCTA({ subject = 'New portfolio notes' }) {
  return (
    <div className="w-full my-6 p-5 sm:p-6 rounded-2xl bg-black/[0.03] border border-stone-300/70">
      <div className="flex items-start gap-3 mb-3.5">
        <div className="p-2 rounded-xl bg-stone-900/5 text-[#161514] shrink-0 mt-0.5">
          <Mail className="w-4 h-4 text-stone-700" />
        </div>
        <div>
          <h3 className="font-semibold text-[15px] sm:text-[16px] text-[#161514] tracking-tight">
            Get the next note by email
          </h3>
          <p className="text-[13px] sm:text-[13.5px] text-[#57534E] leading-relaxed mt-0.5">
            No newsletter service and nothing to subscribe to. Send me a line and I will reply whenever something new is published.
          </p>
        </div>
      </div>

      <a
        href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
        className="pressable inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#161514] hover:bg-[#2B2927] text-white text-[13px] font-medium transition-colors"
      >
        <span>Email me</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
      </a>

      <p className="mt-2.5 font-mono text-[11px] text-[#6B6660] select-all">{EMAIL}</p>
    </div>
  );
}
