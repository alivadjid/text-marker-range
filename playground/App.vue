<script setup lang="ts">
import { ref } from "vue";
import {
  TextKey,
  type Marker,
  type NewMarker,
} from "vue3-highlight-text-color";

import { loremFirst, loremSecond, loremThird } from "./fixtures";

const storageName = "texthighlight";
const savedMarkers = ref<Marker[]>([]);

function handleNewHighlight(createdRange: NewMarker) {
  const nextMarker = { ...createdRange, id: Date.now() };
  savedMarkers.value = [...savedMarkers.value, nextMarker];
  setStorage(savedMarkers.value);
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
  <TextKey
    v-for="i in 3"
    :text="i === 1 ? loremFirst : i === 2 ? loremSecond : loremThird"
    :textId="i"
    :markers="savedMarkers"
    @handleNewHighlight="handleNewHighlight"
  />
</template>

<style></style>
