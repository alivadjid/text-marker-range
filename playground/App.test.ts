import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import TextDataKey from "../src/components/TextDataKey.vue";
import App from "./App.vue";

async function settle() {
  await nextTick();
  await nextTick();
  await nextTick();
}

afterEach(() => {
  document.body.replaceChildren();
  localStorage.clear();
  window.getSelection()?.removeAllRanges();
});

describe("playground highlight removal", () => {
  it("renders three explicitly independent text documents", async () => {
    const wrapper = mount(App);
    await settle();

    expect(wrapper.get("h1").text()).toBe("Три независимых документа");
    expect(wrapper.findAll("section")).toHaveLength(3);
    expect(wrapper.findAllComponents(TextDataKey)).toHaveLength(3);
    expect(wrapper.text()).toContain(
      "Не начинайте выделение в одном документе и не заканчивайте в другом."
    );
  });

  it("removes persisted markers that intersect the selected range", async () => {
    localStorage.setItem(
      "texthighlight",
      JSON.stringify([
        {
          id: "existing-marker",
          color: "#0F766E",
          range: { start: 0, end: 5 },
          textId: 1,
        },
      ])
    );

    const wrapper = mount(App, { attachTo: document.body });
    await settle();

    const firstText = wrapper.findAllComponents(TextDataKey)[0];
    const textNode = firstText.element.querySelector("p span")?.firstChild;
    const range = document.createRange();
    range.setStart(textNode!, 0);
    range.setEnd(textNode!, 5);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    await firstText.trigger("mousedown");
    await firstText.trigger("mousemove");
    await firstText.trigger("mouseup");
    await settle();

    document.body
      .querySelector('button[aria-label="Убрать выделение"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await settle();

    expect(localStorage.getItem("texthighlight")).toBe("[]");
    expect(firstText.element.querySelector("[data-highlight-id]")).toBeNull();
  });

  it("keeps both remaining parts when deleting inside a marker", async () => {
    localStorage.setItem(
      "texthighlight",
      JSON.stringify([
        {
          id: "existing-marker",
          color: "#0F766E",
          range: { start: 2, end: 20 },
          textId: 1,
        },
      ])
    );

    const wrapper = mount(App, { attachTo: document.body });
    await settle();

    const firstText = wrapper.findAllComponents(TextDataKey)[0];
    const markedText = firstText.element.querySelector("span")?.firstChild;
    const range = document.createRange();
    range.setStart(markedText!, 3);
    range.setEnd(markedText!, 6);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    await firstText.trigger("mousedown");
    await firstText.trigger("mousemove");
    await firstText.trigger("mouseup");
    await settle();

    document.body
      .querySelector('button[aria-label="Убрать выделение"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await settle();

    expect(JSON.parse(localStorage.getItem("texthighlight") ?? "[]")).toEqual([
      {
        id: "existing-marker",
        color: "#0F766E",
        range: { start: 2, end: 5 },
        textId: 1,
      },
      {
        id: "existing-marker:after:8",
        color: "#0F766E",
        range: { start: 8, end: 20 },
        textId: 1,
      },
    ]);
  });
});
