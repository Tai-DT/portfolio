'use client';

// Animated aurora gradient background — pure CSS, GPU-cheap.
// Three blurred color blobs drift slowly behind the content;
// a faint grid overlay adds depth. Adapts to light/dark via CSS vars.
export default function AuroraBackground() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Aurora blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      {/* Faint grid overlay */}
      <div className="absolute inset-0 aurora-grid" />

      {/* Vignette to keep edges readable */}
      <div className="absolute inset-0 aurora-vignette" />
    </div>
  );
}
