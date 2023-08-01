import { ref } from "vue";
import { RangeObject } from "../interface";

let key: undefined | number;

export function addHighlightDataKey(html: string, textId: number) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  key = 0;
  const divKeys = addKey(doc.body, textId);

  return divKeys?.outerHTML;
}

function addKey(element: HTMLElement, id?: number) {
  if (element.children.length > 0) {
    Array.prototype.forEach.call(element.children, (item) => {
      // item.dataset.key = `${id}-${key}`;
      item.dataset.highlightKey = `${id}-${key}`;

      if (key !== undefined) key++;
      addKey(item, id);
    });

    return element;
  }
}

const countKey = ref(0);

export function getMaxDataKey(element: Element) {
  getMax(element);

  return countKey.value;
}

export function getMax(element: Element) {
  if (element.children && element.children.length) {
    Array.prototype.forEach.call(element.children, (el) => {
      getMax(el);
    });
  } else {
    const elementKey = (element as HTMLElement).dataset.highlightKey?.split(
      "-"
    )[1];

    if (Number(elementKey) > Number(countKey.value))
      countKey.value = Number(elementKey);
  }
}

export function rangeToObj(range: Range): RangeObject {
  return {
    startKey: (range.startContainer?.parentNode as HTMLElement).dataset
      .highlightKey,
    endKey: (range.endContainer?.parentNode as HTMLElement).dataset
      .highlightKey,

    startTextIndex: Array.prototype.indexOf.call(
      range.startContainer?.parentNode?.childNodes,
      range.startContainer
    ),
    endTextIndex: Array.prototype.indexOf.call(
      range.endContainer?.parentNode?.childNodes,
      range.endContainer
    ),

    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };
}

export function createRange() {
  const selection = document.getSelection();

  if (selection) {
    const range = selection.getRangeAt(0);

    if (range) {
      return rangeToObj(range);
    }
  }
}

export function defaultCountKey() {
  countKey.value = 0;
}
