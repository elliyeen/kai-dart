"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/** Modal sheet on the native <dialog>: focus trap, Escape and backdrop click close it. */
export default function Sheet({ open, onClose, title, children, testId }: { open: boolean; onClose: () => void; title: string; children: ReactNode; testId: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); if (!open && d.open) d.close(); }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} data-testid={testId} aria-labelledby={`${testId}-h`}
      className="m-auto w-[min(640px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] rounded-2xl p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm">
      {open && (
        <div className="flex flex-col max-h-[calc(100dvh-24px)]">
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-200">
            <h2 id={`${testId}-h`} className="text-2xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="w-11 h-11 -mr-2 grid place-items-center rounded-full hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#0057A8]"><X className="w-5 h-5" aria-hidden="true" /></button>
          </div>
          <div className="px-6 py-5 overflow-y-auto">{children}</div>
        </div>
      )}
    </dialog>
  );
}
