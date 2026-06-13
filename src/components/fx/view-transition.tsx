import * as React from "react";

/**
 * Typed wrapper around React's <ViewTransition>. The component is provided
 * by the canary React that Next bundles (enabled via
 * experimental.viewTransition); the installed stable `react` types omit
 * it, so we reach for it through a cast. If it's ever unavailable we just
 * render children — navigation still works, it simply doesn't morph.
 */
interface ViewTransitionProps {
  name?: string;
  share?: "morph" | "auto" | "none";
  enter?: string;
  exit?: string;
  default?: string;
  children: React.ReactNode;
}

const Impl = (
  React as unknown as {
    ViewTransition?: React.ComponentType<ViewTransitionProps>;
  }
).ViewTransition;

export function ViewTransition(props: ViewTransitionProps) {
  if (!Impl) return <>{props.children}</>;
  return <Impl {...props} />;
}
