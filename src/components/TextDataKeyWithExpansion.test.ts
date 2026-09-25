import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import TextDataKey from "./TextDataKey.vue";
import TextDataKeyWithExpansion from "./TextDataKeyWithExpansion.vue";

async function settle() {
  await nextTick();
  await nextTick();
}

afterEach(() => {
  document.body.replaceChildren();
  window.getSelection()?.removeAllRanges();
});

describe("TextDataKeyWithExpansion", () => {
  it("emits a marker after selecting text and choosing a color", async () => {
    const wrapper = mount(TextDataKeyWithExpansion, {
      attachTo: document.body,
      props: {
        text: "<p>Hello world</p>",
        textId: 1,
        markers: [],
      },
    });

    await settle();

    const textRoot = wrapper.findComponent(TextDataKey).element;
    const textNode = textRoot.querySelector("p")?.firstChild;
    const range = document.createRange();
    range.setStart(textNode!, 0);
    range.setEnd(textNode!, 5);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    await wrapper.findComponent(TextDataKey).trigger("mousedown");
    await wrapper.findComponent(TextDataKey).trigger("mousemove");
    await wrapper.findComponent(TextDataKey).trigger("mouseup");
    await settle();

    const colorButton = document.body.querySelector("button");
    expect(colorButton).not.toBeNull();
    colorButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await settle();

    expect(wrapper.emitted("handleNewHighlight")).toEqual([
      [
        {
          color: "#4C1E4F",
          range: { start: 0, end: 5 },
          textId: 1,
        },
      ],
    ]);
  });
});
