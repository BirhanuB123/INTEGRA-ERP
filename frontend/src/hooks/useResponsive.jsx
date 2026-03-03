import { useSyncExternalStore } from 'react';
import isBrowser from '@/utils/isBrowser';

const responsiveConfig = {
  xs: 0,
  sm: 576,
  isMobile: 768,
  md: 768,
  lg: 992,
  xl: 1200,
};

const SERVER_SNAPSHOT = { xs: true, sm: false, isMobile: true, md: false, lg: false, xl: false };

let cachedWidth = -1;
let cachedSnapshot = null;

function getSnapshot() {
  if (!isBrowser || typeof window.innerWidth !== 'number') {
    return SERVER_SNAPSHOT;
  }
  const width = window.innerWidth;
  if (width === cachedWidth && cachedSnapshot) return cachedSnapshot;
  cachedWidth = width;
  cachedSnapshot = {
    xs: width >= responsiveConfig.xs,
    sm: width >= responsiveConfig.sm,
    isMobile: width >= responsiveConfig.isMobile,
    md: width >= responsiveConfig.md,
    lg: width >= responsiveConfig.lg,
    xl: width >= responsiveConfig.xl,
  };
  return cachedSnapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

const subscribers = new Set();
function subscribe(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function useResponsiveStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Notify all subscribers when window is resized (invalidate cache and trigger re-read)
if (isBrowser && typeof window !== 'undefined') {
  let raf = null;
  window.addEventListener('resize', () => {
    cachedWidth = -1;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      raf = null;
      subscribers.forEach((cb) => cb());
    });
  });
}

export function configResponsive(config) {
  Object.assign(responsiveConfig, config);
}

export default function useResponsive() {
  const screenSize = useResponsiveStore();
  const isMobile = !screenSize.md;
  return { screenSize, isMobile };
}
