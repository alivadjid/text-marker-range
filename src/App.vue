<script setup lang="ts">
import { ref } from "vue";
import TextDataKeyWithExpansion from "@/components/TextDataKeyWithExpansion.vue";

import { NewMarker } from "./interface";
import { storageName } from "@/constants";
import { loremFirst, loremSecond, loremThird } from "@/fixtures/index";

type savedHighlight = Required<NewMarker>;
const savedMarkers = ref<savedHighlight[]>([]);

function handleNewHighlight(createdRange: NewMarker) {
  const markers = getStorage();

  if (markers) {
    const parseHighlights = JSON.parse(markers);
    parseHighlights.push({ ...createdRange, id: Date.now() });
    setStorage(parseHighlights);
  } else {
    setStorage([{ ...createdRange, id: Date.now() }]);
  }
}

function setStorage(item: NewMarker[]) {
  localStorage.setItem(storageName, JSON.stringify(item));
}

function getStorage() {
  return localStorage.getItem(storageName);
}

const markers = getStorage();

if (markers) {
  savedMarkers.value = JSON.parse(markers);
}
</script>
<template>
  <TextDataKeyWithExpansion
    v-for="i in 3"
    :text="i === 1 ? loremFirst : i === 2 ? loremSecond : loremThird"
    :textId="i"
    :markers="savedMarkers"
    @handleNewHighlight="handleNewHighlight"
  />
</template>

<style></style>
