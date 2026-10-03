"use client";

import { useRef, type TouchEvent } from "react";

const MIN_SWIPE_DISTANCE = 50;

type Point = { x: number; y: number };

/**
 * Touch handlers for horizontal swipe gestures. A horizontal swipe longer than
 * MIN_SWIPE_DISTANCE calls onSwipeLeft / onSwipeRight; anything else (a tap or
 * a mostly vertical move) falls back to onClick when provided.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  onClick?: () => void,
) {
  const touchStart = useRef<Point | null>(null);
  const touchEnd = useRef<Point | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart.current) return;
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) {
      // No swipe gesture: treat as a regular tap.
      if (!touchEnd.current && onClick) onClick();
      return;
    }
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > MIN_SWIPE_DISTANCE) {
      if (distanceX > 0) onSwipeLeft();
      else onSwipeRight();
    } else if (onClick) {
      onClick();
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}
