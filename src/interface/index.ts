import { MARKER_COLOR_LIST } from "@/constants";

export type BookmarkColor = (typeof MARKER_COLOR_LIST)[number];

export interface TextRange {
  start: number;
  end: number;
}

export interface NewMarker {
  color: string;
  range: TextRange;
  textId: number;
}

export interface Marker extends NewMarker {
  id: string | number;
}
