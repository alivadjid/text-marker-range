<script setup lang="ts">
import { ref, onMounted } from "vue";

import { addHighlightDataKey } from "@/helpers";
import { NewMarker } from "@/interface";
import { useMarker } from "@/composables/useMarker";
import { DATAKEY } from "@/constants";

const {
  text = "",
  textId = 1,
  markers = [],
} = defineProps(["text", "textId", "markers"]);

const textWithHighlightDataKey = ref();
textWithHighlightDataKey.value = addHighlightDataKey(text, textId);

onMounted(() => {
  const parser = new DOMParser();

  const dom = parser.parseFromString(
    textWithHighlightDataKey.value,
    "text/html"
  );

  dom.body.dataset.highlightKey = String(textId);
  let exitDom: Document | undefined;

  markers.forEach((marker: NewMarker) => {
    if (marker.color) {
      useMarker({ color: marker.color, id: Number(textId) }, marker, dom);
      exitDom = dom;
    }
  });

  if (!exitDom) return;
  const childNodes = Array.from(exitDom.body.childNodes);

  document
    .querySelector(`[${DATAKEY}="${textId}"]`)
    ?.replaceChildren(...childNodes);
});
</script>

<template>
  <div v-html="textWithHighlightDataKey" :textId="textId"></div>
</template>

<style></style>
