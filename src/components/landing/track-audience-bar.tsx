"use client";

import { Info } from "lucide-react";
import {
  TRACK_BAR_INNER,
  TRACK_BAR_SHELL,
  TRACK_BAR_TOP,
  TRACK_TAB_BASE,
} from "@/lib/layout-constants";
import { cn } from "@/lib/utils";

export type LandingTrack = "career" | "sales";

interface TrackAudienceBarProps {
  activeTrack: LandingTrack;
  onTrackChange: (track: LandingTrack) => void;
}

export function TrackAudienceBar({ activeTrack, onTrackChange }: TrackAudienceBarProps) {
  return (
    <div className={TRACK_BAR_SHELL} style={{ top: TRACK_BAR_TOP }}>
      <div className={TRACK_BAR_INNER}>
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onTrackChange("career")}
            className={cn(
              TRACK_TAB_BASE,
              activeTrack === "career"
                ? "border-primary-400 text-primary-400"
                : "border-transparent text-muted-fg hover:text-gray-900"
            )}
          >
            I invest my career in commodity markets
          </button>
          <div className="w-px h-5 bg-border flex-shrink-0" aria-hidden />
          <button
            type="button"
            onClick={() => onTrackChange("sales")}
            className={cn(
              TRACK_TAB_BASE,
              activeTrack === "sales"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-muted-fg hover:text-gray-900"
            )}
          >
            I sell solutions into commodity trading firms
          </button>
        </div>
        <p className="hidden xl:flex items-center gap-1.5 flex-shrink-0 text-xs text-muted-fg pl-3 sm:pl-4">
          <Info className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          <span className="whitespace-nowrap">Select your track to see the right content</span>
        </p>
      </div>
    </div>
  );
}
