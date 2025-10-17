const wrapper = document.getElementById("slideZeroPreview");
const phases = ["phaseAnalysis", "phasePhone", "phaseDashboard", "phaseFinal"];

const setPhase = (phase) => {
  wrapper.classList.remove(...phases);
  wrapper.classList.add(phase);
};

const schedulePhases = () => {
  setPhase("phaseAnalysis");

  const timers = [];
  timers.push(
    setTimeout(() => {
      setPhase("phasePhone");
    }, 2000)
  );

  timers.push(
    setTimeout(() => {
      setPhase("phaseDashboard");
    }, 3200)
  );

  timers.push(
    setTimeout(() => {
      setPhase("phaseFinal");
    }, 4800)
  );

  return () => timers.forEach((timer) => clearTimeout(timer));
};

let cancelTimers = () => {};

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const handleMotionPreference = () => {
  cancelTimers();
  if (mediaQuery.matches) {
    setPhase("phaseFinal");
  } else {
    cancelTimers = schedulePhases();
  }
};

handleMotionPreference();
mediaQuery.addEventListener("change", handleMotionPreference);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const handlePointerMove = (event) => {
  const bounds = wrapper.getBoundingClientRect();
  const normalizedX =
    (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
  const normalizedY =
    (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;

  const tiltX = clamp(-normalizedY * 12, -6, 6);
  const tiltY = clamp(normalizedX * 12, -6, 6);

  wrapper.style.setProperty("--tilt-x", `${tiltX}deg`);
  wrapper.style.setProperty("--tilt-y", `${tiltY}deg`);
};

const resetTilt = () => {
  wrapper.style.setProperty("--tilt-x", "0deg");
  wrapper.style.setProperty("--tilt-y", "0deg");
};

wrapper.addEventListener("pointermove", handlePointerMove);
wrapper.addEventListener("pointerleave", resetTilt);
