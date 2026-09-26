<script setup lang="ts">
import { ref } from "vue";
import {
  TextHighlighter,
  subtractMarkerRange,
  type Marker,
  type MarkerRange,
  type NewMarker,
} from "vue-text-highlighter";

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
const examples = [
  {
    id: 1,
    title: "Параграф 1 — базовое выделение",
    description:
      "Выделите часть обычного текста, выберите цвет и обновите страницу: сохранённое выделение будет восстановлено.",
    text: loremFirst,
  },
  {
    id: 2,
    title: "Параграф 2 — списки и вложенная разметка",
    description:
      "Выделения сохраняются по текстовым позициям, поэтому работают внутри элементов списка и другой вложенной HTML-разметки.",
    text: loremSecond,
  },
  {
    id: 3,
    title: "Параграф 3 — несколько абзацев в одном документе",
    description:
      "Внутри этого блока можно начать выделение в одном абзаце или списке и закончить в другом: это один TextHighlighter и один textId.",
    text: loremThird,
  },
];

function handleNewHighlight(createdRange: NewMarker) {
  const nextMarker = { ...createdRange, id: Date.now() };
  savedMarkers.value = [...savedMarkers.value, nextMarker];
  setStorage(savedMarkers.value);
}

function handleRemoveHighlight(removedRange: MarkerRange) {
  savedMarkers.value = subtractMarkerRange(savedMarkers.value, removedRange);
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
  <main :class="$style.playground">
    <header :class="$style.header">
      <p :class="$style.eyebrow">Vue Text Highlighter</p>
      <h1>Три независимых документа</h1>
      <p :class="$style.notice">
        Выделение, выбор цвета и удаление работают только внутри одного блока.
        Не начинайте выделение в одном документе и не заканчивайте в другом.
      </p>
    </header>

    <section
      v-for="example in examples"
      :key="example.id"
      :class="$style.example"
      :aria-labelledby="`example-${example.id}`"
    >
      <header :class="$style.exampleHeader">
        <p :class="$style.documentId">Документ {{ example.id }}</p>
        <h2 :id="`example-${example.id}`">{{ example.title }}</h2>
        <p>{{ example.description }}</p>
      </header>
      <TextHighlighter
        :text="example.text"
        :text-id="example.id"
        :markers="savedMarkers"
        :colors="playgroundColors"
        @handle-new-highlight="handleNewHighlight"
        @handle-remove-highlight="handleRemoveHighlight"
      />
    </section>
  </main>
</template>

<style module>
.playground {
  display: grid;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
  text-align: left;
}

.header,
.example {
  padding: 24px;
  background: rgb(255 255 255 / 5%);
  border: 1px solid rgb(148 163 184 / 28%);
  border-radius: 16px;
}

.header h1,
.example h2,
.header p,
.example p {
  margin-top: 0;
}

.header h1 {
  margin-bottom: 8px;
}

.eyebrow,
.documentId {
  margin-bottom: 8px;
  color: #7dd3fc;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.notice {
  max-width: 760px;
  margin-bottom: 0;
  color: #fde68a;
}

.example {
  display: grid;
  gap: 20px;
}

.exampleHeader {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(148 163 184 / 20%);
}

.exampleHeader h2 {
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.exampleHeader p:last-child {
  margin-bottom: 0;
  color: rgb(226 232 240 / 86%);
}
</style>
