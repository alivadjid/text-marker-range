import { MARKER_COLOR_LIST } from "@/constants";

export type BookmarkColor = (typeof MARKER_COLOR_LIST)[number];

export interface TextRange {
  start: number;
  end: number;
}

export interface MarkerRange {
  range: TextRange;
  textId: number;
}

export interface NewMarker extends MarkerRange {
  color: string;
}

export interface Marker extends NewMarker {
  id: string | number;
}
