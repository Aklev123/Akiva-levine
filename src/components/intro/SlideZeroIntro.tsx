import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SlideZeroIntro.module.css";

const classNames = (
  ...tokens: Array<string | false | null | undefined>
): string => tokens.filter(Boolean).join(" ");

type SlideZeroPhase = "analysis" | "phone" | "dashboard" | "final";

export type SlideZeroIntroProps = {
  /** Called once the cinematic intro reaches the final resting state. */
  onComplete?: () => void;
  /**
   * When true (default) the intro will automatically advance through phases.
   * Disable this if you need to control the timeline manually for testing.
   */
  autoAdvance?: boolean;
};

const PREFERRED_TIMELINE = [2000, 3200, 4800];

const usePrefersReducedMotion = (): boolean => {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefers(event.matches);
    };

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);

      return () => {
        query.removeEventListener("change", handleChange);
      };
    }

    query.addListener(handleChange);

    return () => {
      query.removeListener(handleChange);
    };
  }, []);

  return prefers;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const SlideZeroIntro: React.FC<SlideZeroIntroProps> = ({
  onComplete,
  autoAdvance = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<SlideZeroPhase>(
    prefersReducedMotion ? "final" : "analysis"
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete?.();
    }
  }, [onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("final");
      return;
    }

    if (!autoAdvance) {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setPhase("phone");
      }, PREFERRED_TIMELINE[0])
    );

    timers.push(
      setTimeout(() => {
        setPhase("dashboard");
      }, PREFERRED_TIMELINE[1])
    );

    timers.push(
      setTimeout(() => {
        setPhase("final");
        onComplete?.();
      }, PREFERRED_TIMELINE[2])
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [autoAdvance, onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateTilt = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      const normalizedX =
        (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
      const normalizedY =
        (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;

      const tiltX = clamp(-normalizedY * 12, -6, 6);
      const tiltY = clamp(normalizedX * 12, -6, 6);

      container.style.setProperty("--tilt-x", `${tiltX}deg`);
      container.style.setProperty("--tilt-y", `${tiltY}deg`);
    };

    const resetTilt = () => {
      container.style.setProperty("--tilt-x", "0deg");
      container.style.setProperty("--tilt-y", "0deg");
    };

    container.addEventListener("pointermove", updateTilt);
    container.addEventListener("pointerleave", resetTilt);

    return () => {
      container.removeEventListener("pointermove", updateTilt);
      container.removeEventListener("pointerleave", resetTilt);
    };
  }, [prefersReducedMotion]);

  const phaseClassName = useMemo(
    () => styles[`phase${phase.charAt(0).toUpperCase()}${phase.slice(1)}`],
    [phase]
  );

  return (
    <div ref={containerRef} className={classNames(styles.wrapper, phaseClassName)}>
      <div className={styles.backgroundGlow} />

      <div className={styles.brandLayer}>
        <div className={styles.brandHeader}>
          <div className={styles.logotype} aria-label="SkinFitMD">
            <span>Skin</span>
            <span>Fit</span>
            <span>MD</span>
          </div>
          <p className={styles.tagline}>
            Created by a Harvard-trained dermatologist. Guided by AI.
          </p>
        </div>

        <div className={styles.ctaGroup}>
          <button className={styles.primaryCta} type="button">
            Get Started
          </button>
          <button className={styles.secondaryCta} type="button">
            Already have an account? <span>Sign In</span>
          </button>
        </div>
      </div>

      <div className={styles.phoneRig}>
        <div className={styles.phoneFrame}>
          <div className={styles.phoneNotch} aria-hidden />
          <div className={styles.phoneScreen}>
            <div className={styles.screenTrack}>
              <section className={styles.analysisScene}>
                <div className={styles.analysisMedia}>
                  <div className={styles.faceSilhouette}>
                    <div className={styles.scanLine} />
                  </div>

                  <div className={classNames(styles.metricBadge, styles.metricTopLeft)}>
                    <span className={styles.metricLabel}>Hydration</span>
                    <span className={styles.metricValue}>82</span>
                  </div>
                  <div
                    className={classNames(styles.metricBadge, styles.metricTopRight)}
                  >
                    <span className={styles.metricLabel}>Redness</span>
                    <span className={styles.metricValue}>21</span>
                  </div>
                  <div
                    className={classNames(
                      styles.metricBadge,
                      styles.metricBottomLeft
                    )}
                  >
                    <span className={styles.metricLabel}>Texture</span>
                    <span className={styles.metricValue}>68</span>
                  </div>
                  <div
                    className={classNames(
                      styles.metricBadge,
                      styles.metricBottomRight
                    )}
                  >
                    <span className={styles.metricLabel}>Even Tone</span>
                    <span className={styles.metricValue}>74</span>
                  </div>

                  <div className={styles.progressRing}>
                    <div className={styles.progressCore}>
                      <span className={styles.progressText}>Analyzing photo…</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.dashboardScene}>
                <div className={styles.dashboardRings}>
                  {[
                    { label: "Hydration", score: 82 },
                    { label: "Barrier", score: 76 },
                    { label: "Redness", score: 21 },
                    { label: "Even Tone", score: 74 },
                  ].map((ring) => (
                    <article key={ring.label} className={styles.dashboardRing}>
                      <div className={styles.dashboardProgress}>
                        <svg viewBox="0 0 120 120" role="presentation">
                          <circle cx="60" cy="60" r="52" className={styles.dashboardTrack} />
                          <circle
                            cx="60"
                            cy="60"
                            r="52"
                            className={styles.dashboardIndicator}
                            style={{
                              strokeDashoffset: `${(1 - ring.score / 100) * 326}`,
                            }}
                          />
                        </svg>
                        <strong>{ring.score}</strong>
                      </div>
                      <span>{ring.label}</span>
                    </article>
                  ))}
                </div>

                <div className={styles.todayCard}>
                  <header>
                    <h3>Today</h3>
                    <span className={styles.streak}>+18 points</span>
                  </header>
                  <ul>
                    <li>
                      <span>AM Routine</span>
                      <span className={styles.positive}>✔ +8</span>
                    </li>
                    <li>
                      <span>Face Scan</span>
                      <span className={styles.negative}>–6</span>
                    </li>
                    <li>
                      <span>Targeted Serum</span>
                      <span className={styles.positive}>✔ +16</span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideZeroIntro;
