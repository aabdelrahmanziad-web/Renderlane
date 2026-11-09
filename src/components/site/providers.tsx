"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";

type IntroState = { ready: boolean; markReady: () => void };
const IntroContext = createContext<IntroState>({ ready: true, markReady: () => {} });

export const useIntro = () => useContext(IntroContext);

export function SiteProviders({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  // Lock scrolling while the intro plays
  useEffect(() => {
    document.documentElement.style.overflow = ready ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [ready]);

  return (
    <IntroContext.Provider value={{ ready, markReady }}>
      <MotionConfig reducedMotion="user">
        <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
          {children}
        </ReactLenis>
      </MotionConfig>
    </IntroContext.Provider>
  );
}
