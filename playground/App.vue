<script setup lang="ts">
import { computed, ref } from "vue";
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
type Locale = "ru" | "en";

const locale = ref<Locale>("en");
const copy = computed(() =>
  locale.value === "ru"
    ? {
        languageLabel: "Язык интерфейса",
        switchToRussian: "Переключить на русский",
        switchToEnglish: "Switch to English",
        title: "Три независимых документа",
        notice:
          "Выделение, выбор цвета и удаление работают только внутри одного блока. Не начинайте выделение в одном документе и не заканчивайте в другом.",
        document: "Документ",
        examples: [
          {
            title: "Параграф 1 — базовое выделение",
            description:
              "Выделите часть обычного текста, выберите цвет и обновите страницу: сохранённое выделение будет восстановлено.",
          },
          {
            title: "Параграф 2 — списки и вложенная разметка",
            description:
              "Выделения сохраняются по текстовым позициям, поэтому работают внутри элементов списка и другой вложенной HTML-разметки.",
          },
          {
            title: "Параграф 3 — несколько абзацев в одном документе",
            description:
              "Внутри этого блока можно начать выделение в одном абзаце или списке и закончить в другом: это один TextHighlighter и один textId.",
          },
        ],
      }
    : {
        languageLabel: "Interface language",
        switchToRussian: "Switch to Russian",
        switchToEnglish: "Switch to English",
        title: "Three independent documents",
        notice:
          "Selecting, colouring, and removing highlights work only within one document. Do not start a selection in one document and finish it in another.",
        document: "Document",
        examples: [
          {
            title: "Paragraph 1 — basic highlighting",
            description:
              "Select ordinary text, choose a colour, and refresh the page: the saved highlight will be restored.",
          },
          {
            title: "Paragraph 2 — lists and nested markup",
            description:
              "Highlights are saved as text offsets, so they work inside list items and other nested HTML markup.",
          },
          {
            title: "Paragraph 3 — multiple paragraphs in one document",
            description:
              "Within this block, a selection can start in one paragraph or list and end in another: it is one TextHighlighter with one textId.",
          },
        ],
      }
);
const examples = [
  {
    id: 1,
    text: loremFirst,
  },
  {
    id: 2,
    text: loremSecond,
  },
  {
    id: 3,
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
      <div :class="$style.headerTopline">
        <p :class="$style.eyebrow">Vue Text Highlighter</p>
        <div :class="$style.languageSwitcher" :aria-label="copy.languageLabel">
          <button
            type="button"
            :class="[$style.languageButton, { [$style.activeLanguage]: locale === 'ru' }]"
            :aria-label="copy.switchToRussian"
            :aria-pressed="locale === 'ru'"
            @click="locale = 'ru'"
          >
            RU
          </button>
          <button
            type="button"
            :class="[$style.languageButton, { [$style.activeLanguage]: locale === 'en' }]"
            :aria-label="copy.switchToEnglish"
            :aria-pressed="locale === 'en'"
            @click="locale = 'en'"
          >
            EN
          </button>
        </div>
      </div>
      <h1>{{ copy.title }}</h1>
      <p :class="$style.notice">{{ copy.notice }}</p>
    </header>

    <section
      v-for="example in examples"
      :key="example.id"
      :class="$style.example"
      :aria-labelledby="`example-${example.id}`"
    >
      <header :class="$style.exampleHeader">
        <p :class="$style.documentId">{{ copy.document }} {{ example.id }}</p>
        <h2 :id="`example-${example.id}`">
          {{ copy.examples[example.id - 1].title }}
        </h2>
        <p>{{ copy.examples[example.id - 1].description }}</p>
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

.headerTopline {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
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

.languageSwitcher {
  display: inline-flex;
  padding: 3px;
  background: rgb(15 23 42 / 45%);
  border: 1px solid rgb(148 163 184 / 35%);
  border-radius: 8px;
}

.languageButton {
  min-width: 38px;
  padding: 5px 8px;
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: transparent;
  border: 0;
  border-radius: 5px;
}

.languageButton:hover {
  border-color: transparent;
}

.activeLanguage {
  color: #0f172a;
  background: #7dd3fc;
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
