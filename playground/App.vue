<script setup lang="ts">
import { ref } from "vue";
import {
  TextKey,
  type Marker,
  type MarkerRange,
  type NewMarker,
} from "vue3-highlight-text-color";

import { loremFirst, loremSecond, loremThird } from "./fixtures";

const storageName = "texthighlight";
const savedMarkers = ref<Marker[]>([]);
const playgroundColors = [
  "#0F766E",
  "#0EA5E9",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#E11D48",
  "#EA580C",
  "#CA8A04",
  "#65A30D",
  "#15803D",
  "#334155",
  "#FFFFFF",
];

function handleNewHighlight(createdRange: NewMarker) {
  const nextMarker = { ...createdRange, id: Date.now() };
  savedMarkers.value = [...savedMarkers.value, nextMarker];
  setStorage(savedMarkers.value);
}

function rangesIntersect(first: MarkerRange["range"], second: MarkerRange["range"]) {
  return first.start < second.end && second.start < first.end;
}

function handleRemoveHighlight(removedRange: MarkerRange) {
  savedMarkers.value = savedMarkers.value.filter(
    (marker) =>
      marker.textId !== removedRange.textId ||
      !rangesIntersect(marker.range, removedRange.range)
  );
  setStorage(savedMarkers.value);
}

function setStorage(item: Marker[]) {
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
    :colors="playgroundColors"
    @handleNewHighlight="handleNewHighlight"
    @handleRemoveHighlight="handleRemoveHighlight"
  />
</template>

<style></style>
