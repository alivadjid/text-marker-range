import { ref } from "vue";
import { DATAKEY } from "@/constants";
import { createRange, defaultCountKey, getMaxDataKey } from "@/helpers";
import { ENodeName, NewMarker, RangeObject } from "@/interface";

const materialId = ref();
const spanColor = ref("");
const keyFound = ref(false);
const range = ref<RangeObject>();
const querySelectorDocument = ref();

function getElementIndex(
  parent: Element | NodeListOf<ChildNode> | undefined,
  element: Element | ChildNode | ParentNode
) {
  return Array.prototype.indexOf.call(parent, element);
}

function createSpan(
  appendTextNode: string | null
): HTMLSpanElement | undefined {
  const materialContent = querySelectorDocument.value.querySelector(
    `[${DATAKEY}="${materialId.value}"]`
  );

  if (!materialContent) return;

  const dataKey = getMaxDataKey(materialContent) + 1;

  defaultCountKey();

  const span = document.createElement("span");

  span.style.backgroundColor = spanColor.value;
  span.dataset.highlightKey = `${materialId.value}-${dataKey}`;

  let textNode;

  if (appendTextNode) {
    textNode = document.createTextNode(appendTextNode);
    span.appendChild(textNode);
  }

  return span;
}

function goUpCycle(
  childNode: ChildNode,
  upperElement: ChildNode | ParentNode,
  z: number,
  endTextIndex: number
) {
  if (
    (upperElement as HTMLElement).dataset?.highlightKey ===
      range.value?.endKey &&
    z === Number(range.value?.endTextIndex) + endTextIndex
  ) {
    (childNode as Text).splitText(Number(range.value?.endOffset));

    const createdSpan = createSpan(childNode.textContent);

    if (createdSpan) {
      childNode.replaceWith(createdSpan);
    }

    keyFound.value = true;
  } else if (childNode.nodeName === ENodeName.textNode) {
    const createdSpan = createSpan(childNode.textContent);

    if (createdSpan) {
      childNode.replaceWith(createdSpan);
    }
  } else if (childNode.childNodes.length) {
    treeLevelDown(childNode);
  }
}

function goDownCycle(element: ChildNode, j: number, elementDataKey: string) {
  const childNode = element.childNodes[j];

  if (
    elementDataKey === range.value?.endKey &&
    j === range.value?.endTextIndex
  ) {
    if (childNode.textContent) {
      (childNode as Text).splitText(Number(range.value?.endOffset));
      const createdSpan = createSpan(childNode.textContent);

      if (createdSpan) {
        childNode.replaceWith(createdSpan);
      }
    }
    keyFound.value = true;
  } else if (childNode.nodeName === ENodeName.textNode) {
    const createdSpan = createSpan(childNode.textContent);

    if (createdSpan) {
      childNode.replaceWith(createdSpan);
    }
  } else if (keyFound.value) {
    //
  } else if (element.childNodes[j].childNodes.length) {
    treeLevelDown(element.childNodes[j]);
    if (keyFound.value) {
      //
    }
  }
}

function checkChildNodes(
  upperElement: ChildNode | ParentNode,
  isStart: boolean,
  whoCall: null | Element | ChildNode | ParentNode = null
) {
  const elementIndex = getElementIndex(
    upperElement.childNodes,
    whoCall as Element
  );
  const plusIndex = isStart ? 2 : 1;
  const endTextIndex = isStart ? 1 : 0;

  for (
    let z = elementIndex + plusIndex;
    z < upperElement.childNodes.length;
    z++
  ) {
    const childNode = upperElement.childNodes[z];

    goUpCycle(childNode, upperElement, z, endTextIndex);
    if (keyFound.value) break;
  }
  if (!keyFound.value && upperElement.parentNode)
    treeLevelUp(upperElement.parentNode, upperElement);
}

function treeLevelUp(
  upperElement: ChildNode | ParentNode,
  whoCall: null | Element | ChildNode | ParentNode = null,
  isStart = false
) {
  if (
    range.value?.startKey === range.value?.endKey &&
    range.value?.startTextIndex === range.value?.endTextIndex
  ) {
    (
      upperElement.parentNode?.childNodes[
        Number(range.value?.startTextIndex)
      ] as Text
    ).splitText(Number(range.value?.endOffset));
    const splitText = (upperElement as Text).splitText(
      Number(range.value?.startOffset)
    );

    const createdSpan = createSpan(splitText.textContent);

    if (createdSpan) {
      splitText.replaceWith(createdSpan);
    }

    keyFound.value = true;
  } else if (upperElement.childNodes.length > 1) {
    checkChildNodes(upperElement, isStart, whoCall);
  } else if (upperElement.nodeName === ENodeName.textNode) {
    const elementSplitText = (upperElement as Text).splitText(
      Number(range.value?.startOffset)
    );

    const createdSpan = createSpan(elementSplitText.textContent);

    if (createdSpan) {
      elementSplitText.replaceWith(createdSpan);
    }
    if (upperElement.parentNode)
      treeLevelUp(upperElement.parentNode, upperElement, true);
  } else if (upperElement.parentNode) {
    treeLevelUp(upperElement.parentNode, upperElement);
  }
}

function treeLevelDown(element: ChildNode) {
  const elementDataKey = String((element as HTMLElement).dataset.highlightKey);

  if (element.childNodes.length > 1) {
    const stopParentNodeIndex =
      elementDataKey === range.value?.endKey
        ? range.value?.endTextIndex
        : element.childNodes.length - 1;

    for (let j = 0; j <= Number(stopParentNodeIndex); j++) {
      goDownCycle(element, j, elementDataKey);
      if (keyFound.value) break;
    }
    if (keyFound.value) {
      //
    }
  } else if (element.childNodes[0]?.nodeName === ENodeName.textNode) {
    const childElement = element.childNodes[0];

    if (elementDataKey === range.value?.endKey) {
      (childElement as Text).splitText(Number(range.value?.endOffset));

      const createdSpan = createSpan(childElement.textContent);

      if (createdSpan) {
        childElement.replaceWith(createdSpan);
      }
      keyFound.value = true;
    } else {
      const createdSpan = createSpan(childElement.textContent);

      if (createdSpan) {
        childElement.replaceWith(createdSpan);
      }
    }
  } else if (element.childNodes[0].childNodes.length) {
    treeLevelDown(element.childNodes[0]);
    if (keyFound.value) {
      //
    }
  }
}

export function useMarker(
  { color, id }: { color: string; id: number },
  rangeObj?: NewMarker,
  querySelectorIn: Document = document
): NewMarker {
  querySelectorDocument.value = querySelectorIn;
  materialId.value = id;
  spanColor.value = color;

  if (rangeObj) {
    range.value = {
      startKey: String(rangeObj.startKey),
      startTextIndex: Number(rangeObj.startTextIndex),
      startOffset: Number(rangeObj.startOffset),
      endKey: String(rangeObj.endKey),
      endTextIndex: Number(rangeObj.endTextIndex),
      endOffset: Number(rangeObj.endOffset),
    };
  } else {
    range.value = createRange();
  }

  const startTextHtml = querySelectorIn.querySelector(
    `[${DATAKEY}="${range.value?.startKey}"]`
  );

  if (startTextHtml) {
    treeLevelUp(startTextHtml.childNodes[Number(range.value?.startTextIndex)]);
  }

  let marker: NewMarker;
  if (!rangeObj) {
    marker = {
      startKey: range.value?.startKey,
      startTextIndex: range.value?.startTextIndex,
      endKey: range.value?.endKey,
      endTextIndex: range.value?.endTextIndex,
      startOffset: range.value?.startOffset,
      endOffset: range.value?.endOffset,
      color: spanColor.value,
      textId: id,
    };
  }

  materialId.value = undefined;
  spanColor.value = "";
  keyFound.value = false;
  range.value = undefined;

  document.getSelection()?.empty();

  return marker!;
}
