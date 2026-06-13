/**
 * Shared scroll-velocity signal. SmoothScroll/Projects write Lenis'
 * velocity here each frame; WebGL effects (e.g. the project panels'
 * RGB-shift) read it in their render loop without re-rendering React.
 */
export const scrollSignal = { velocity: 0 };
