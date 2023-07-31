import { MARKER_COLOR_LIST } from "@/constants";

export type BookmarkColor = (typeof MARKER_COLOR_LIST)[number];

export const enum ENodeName {
  textNode = "#text",
  spanNode = "SPAN",
  imageNode = "IMG",
}

export interface NewMarker {
  startKey?: string;
  startTextIndex?: number;
  endKey?: string;
  endTextIndex?: number;
  startOffset?: number;
  endOffset?: number;
  color?: string;
  id?: number;
  textId: number;
}

export interface RangeObject {
  startKey?: string;
  endKey?: string;

  startTextIndex: number;
  endTextIndex: number;

  startOffset: number;
  endOffset: number;
}
