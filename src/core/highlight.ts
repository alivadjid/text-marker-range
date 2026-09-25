import type { Marker, NewMarker, TextRange } from "../interface";

function isTextNode(node: Node | null): node is Text {
  return node?.nodeType === Node.TEXT_NODE;
}

function collectTextNodes(root: Node) {
  const nodes: Text[] = [];

  function visit(node: Node) {
    for (const child of Array.from(node.childNodes)) {
      if (isTextNode(child)) {
        if (child.data.length > 0) nodes.push(child);
      } else {
        visit(child);
      }
    }
  }

  visit(root);
  return nodes;
}

function isRangeInsideRoot(root: HTMLElement, range: Range) {
  return root.contains(range.startContainer) && root.contains(range.endContainer);
}

export function isTextRange(value: unknown): value is TextRange {
  return (
    typeof value === "object" &&
    value !== null &&
    "start" in value &&
    "end" in value &&
    typeof value.start === "number" &&
    typeof value.end === "number" &&
    Number.isSafeInteger(value.start) &&
    Number.isSafeInteger(value.end) &&
    value.start >= 0 &&
    value.end > value.start
  );
}

export function createMarkerFromRange(
  root: HTMLElement,
  selection: Range,
  color: string,
  textId: number
): NewMarker | undefined {
  if (!isRangeInsideRoot(root, selection) || selection.collapsed) return;

  const prefix = document.createRange();
  prefix.setStart(root, 0);
  prefix.setEnd(selection.startContainer, selection.startOffset);

  const range = {
    start: prefix.toString().length,
    end: prefix.toString().length + selection.toString().length,
  };

  return isTextRange(range) ? { color, range, textId } : undefined;
}

function isValidMarker(
  marker: unknown,
  textId: number,
  textLength: number
): marker is Marker {
  if (typeof marker !== "object" || marker === null) return false;

  const candidate = marker as Partial<Marker>;
  return (
    candidate.textId === textId &&
    (typeof candidate.id === "string" || typeof candidate.id === "number") &&
    typeof candidate.color === "string" &&
    candidate.color.length > 0 &&
    isTextRange(candidate.range) &&
    candidate.range.end <= textLength
  );
}

/**
 * The list order is the visual priority: the last matching marker owns a text
 * segment. This is deterministic and avoids nested spans for intersections.
 */
function getMarkerAt(markers: Marker[], position: number) {
  for (let index = markers.length - 1; index >= 0; index--) {
    const marker = markers[index];
    if (marker.range.start <= position && marker.range.end > position) {
      return marker;
    }
  }
}

function wrapSegment(node: Text, start: number, end: number, marker: Marker) {
  const selectedNode = start === 0 ? node : node.splitText(start);
  const trailingNode = selectedNode.splitText(end - start);
  const span = document.createElement("span");

  span.style.backgroundColor = marker.color;
  span.dataset.highlightId = String(marker.id);
  span.append(selectedNode);
  trailingNode.before(span);
}

function mergeAdjacentSegments(root: HTMLElement) {
  function nextNonEmptySibling(node: Node) {
    let next = node.nextSibling;

    while (isTextNode(next) && next.data.length === 0) {
      const emptyNode = next;
      next = emptyNode.nextSibling;
      emptyNode.remove();
    }

    return next;
  }

  for (const span of Array.from(
    root.querySelectorAll<HTMLSpanElement>("span[data-highlight-id]")
  )) {
    let next = nextNonEmptySibling(span);

    while (
      next instanceof HTMLSpanElement &&
      next.dataset.highlightId === span.dataset.highlightId &&
      next.getAttribute("style") === span.getAttribute("style")
    ) {
      const sibling = next;
      next = nextNonEmptySibling(sibling);
      span.append(...Array.from(sibling.childNodes));
      sibling.remove();
    }
  }
}

export function renderMarkers(
  root: HTMLElement,
  source: string,
  markers: readonly Marker[],
  textId: number
) {
  root.innerHTML = source;

  const textLength = root.textContent?.length ?? 0;
  const validMarkers = markers.filter((marker) =>
    isValidMarker(marker, textId, textLength)
  );

  if (validMarkers.length === 0) return;

  const textNodes: Array<{ node: Text; start: number; end: number }> = [];
  let cursor = 0;

  for (const node of collectTextNodes(root)) {
    textNodes.push({ node, start: cursor, end: cursor + node.data.length });
    cursor += node.data.length;
  }

  for (const textNode of textNodes) {
    const boundaries = new Set([textNode.start, textNode.end]);

    for (const marker of validMarkers) {
      if (marker.range.start > textNode.start && marker.range.start < textNode.end) {
        boundaries.add(marker.range.start);
      }
      if (marker.range.end > textNode.start && marker.range.end < textNode.end) {
        boundaries.add(marker.range.end);
      }
    }

    const points = [...boundaries].sort((left, right) => right - left);
    for (let index = 0; index < points.length - 1; index++) {
      const end = points[index];
      const start = points[index + 1];
      const marker = getMarkerAt(validMarkers, start);
      if (!marker) continue;

      wrapSegment(
        textNode.node,
        start - textNode.start,
        end - textNode.start,
        marker
      );
    }
  }

  mergeAdjacentSegments(root);
}
