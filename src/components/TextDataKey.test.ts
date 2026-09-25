import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";

import TextDataKey from "./TextDataKey.vue";

const source = "<p>One <strong>two</strong> three</p>";

async function settle() {
  await nextTick();
  await nextTick();
}

describe("TextDataKey", () => {
  it("renders persisted markers from controlled props", async () => {
    const wrapper = mount(TextDataKey, {
      props: {
        text: source,
        textId: 1,
        markers: [
          {
            id: "two",
            textId: 1,
            color: "#FA7E61",
            range: { start: 4, end: 7 },
          },
        ],
      },
    });

    await settle();

    expect(wrapper.text()).toBe("One two three");
    expect(wrapper.find("strong > span").text()).toBe("two");
  });

  it("reacts to a new markers array without changing the source HTML", async () => {
    const wrapper = mount(TextDataKey, {
      props: { text: source, textId: 1, markers: [] },
    });

    await settle();
    await wrapper.setProps({
      markers: [
        {
          id: "one",
          textId: 1,
          color: "#B5A886",
          range: { start: 0, end: 3 },
        },
      ],
    });
    await settle();

    expect(wrapper.find("p > span").text()).toBe("One");
    expect(wrapper.find("strong").text()).toBe("two");
  });

  it("keeps separate instances independent", async () => {
    const first = mount(TextDataKey, {
      props: {
        text: "alpha",
        textId: 1,
        markers: [
          {
            id: "first",
            textId: 1,
            color: "#F44174",
            range: { start: 0, end: 5 },
          },
        ],
      },
    });
    const second = mount(TextDataKey, {
      props: { text: "bravo", textId: 2, markers: [] },
    });

    await settle();

    expect(first.find("span").text()).toBe("alpha");
    expect(second.find("span").exists()).toBe(false);
    expect(second.text()).toBe("bravo");
  });
});
