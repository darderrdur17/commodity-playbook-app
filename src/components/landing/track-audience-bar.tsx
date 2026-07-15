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
        <div className="w-px h-6 bg-border flex-shrink-0 self-center" />
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
        <p className="hidden lg:flex items-center gap-1.5 ml-auto text-xs text-muted-fg whitespace-nowrap py-3.5 sm:py-4">
          <Info className="w-3.5 h-3.5" />
          Select your track to see the right content
        </p>
      </div>
    </div>
  );
}
