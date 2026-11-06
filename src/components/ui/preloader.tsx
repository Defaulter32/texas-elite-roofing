import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const preloadAssets = [
  "/assets/roofing-generated/hero-roofer.png",
  "/assets/roofing-generated/services-modern-roof.png",
  "/assets/roofing-generated/project-cottage.png",
  "/assets/roofing-generated/project-modern-home.png",
  "/assets/roofing-generated/project-mountain-home.png",
];

function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem("ter-preloader-seen") === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    window.sessionStorage.setItem("ter-preloader-seen", "1");
  } catch {
    // Private browsing can deny session storage; the loader still completes.
  }
}

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(() => !hasSeenPreloader());
  const [progress, setProgress] = useState(() => (hasSeenPreloader() ? 100 : 0));
  const [exiting, setExiting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!visible) {
      onComplete?.();
      return;
    }
    if (exiting) return;

    let cancelled = false;
    let exitTimer: number | undefined;
    let maxTimer: number | undefined;
    const startedAt = performance.now();
    let loaded = 0;

    const finish = () => {
      if (cancelled || exiting) return;
      setProgress(100);
      const minimumDelay = Math.max(0, 900 - (performance.now() - startedAt));
      exitTimer = window.setTimeout(() => {
        if (cancelled) return;
        setExiting(true);
        exitTimer = window.setTimeout(() => {
          if (cancelled) return;
          markPreloaderSeen();
          setVisible(false);
          onComplete?.();
        }, reduced ? 180 : 560);
      }, minimumDelay);
    };

    const assetPromises = preloadAssets.map((src) => new Promise<void>((resolve) => {
      const image = new Image();
      const settle = () => {
        loaded += 1;
        if (!cancelled) setProgress(Math.round((loaded / preloadAssets.length) * 92));
        resolve();
      };
      image.onload = settle;
      image.onerror = settle;
      image.src = src;
    }));

    const fontReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([...assetPromises, fontReady]).then(finish);
    maxTimer = window.setTimeout(finish, 2600);

    return () => {
      cancelled = true;
      if (exitTimer) window.clearTimeout(exitTimer);
      if (maxTimer) window.clearTimeout(maxTimer);
    };
  }, [exiting, onComplete, reduced, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          animate={exiting ? { opacity: 0 } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.18 : 0.42, ease: [0.23, 1, 0.32, 1] }}
          aria-label="Loading Texas Elite Roofing"
          role="status"
        >
          <div className="preloader__image" aria-hidden="true" />
          <div className="preloader__veil" aria-hidden="true" />
          <div className="preloader__content">
            <div className="preloader__brand">
              <svg viewBox="0 0 32 20" aria-hidden="true"><path d="M1 17 12 3l7 8 4-5 8 11H1Z" fill="currentColor" /><path d="m9 17 10-10 7 10H9Z" fill="var(--accent)" /></svg>
              <span>Texas Elite</span>
            </div>
            <p>Roofing and Construction</p>
            <div className="preloader__status"><span>Preparing the field notes</span><span>{String(progress).padStart(2, "0")}%</span></div>
            <div className="preloader__track"><motion.span animate={{ scaleX: progress / 100 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} /></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
