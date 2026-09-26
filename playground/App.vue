<script setup lang="ts">
import { computed, ref } from "vue";
import {
  TextHighlighter,
  subtractMarkerRange,
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
type Locale = "ru" | "en";

const locale = ref<Locale>("en");
const isRangesPanelOpen = ref(false);
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
        showRanges: "Показать диапазоны",
        closeRanges: "Закрыть диапазоны",
        savedRanges: "Сохранённые диапазоны",
        savedText: "Текст",
        range: "Диапазон",
        noSavedRanges: "Сохранённых диапазонов пока нет.",
        clearSaved: "Очистить сохранения",
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
        showRanges: "Show ranges",
        closeRanges: "Close ranges",
        savedRanges: "Saved ranges",
        savedText: "Text",
        range: "Range",
        noSavedRanges: "No saved ranges yet.",
        clearSaved: "Clear saved highlights",
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
const savedRangesByText = computed(() =>
  examples.map((example) => ({
    id: example.id,
    markers: savedMarkers.value.filter((marker) => marker.textId === example.id),
  }))
);

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

function clearSavedMarkers() {
  savedMarkers.value = [];
  localStorage.removeItem(storageName);
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
        <div :class="$style.headerControls">
          <button
            type="button"
            :class="$style.rangesButton"
            :aria-expanded="isRangesPanelOpen"
            aria-controls="saved-ranges-panel"
            @click="isRangesPanelOpen = true"
          >
            {{ copy.showRanges }}
          </button>
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

  <Teleport to="body">
    <Transition
      :enter-active-class="$style.drawerEnterActive"
      :enter-from-class="$style.drawerEnterFrom"
      :enter-to-class="$style.drawerEnterTo"
      :leave-active-class="$style.drawerLeaveActive"
      :leave-from-class="$style.drawerLeaveFrom"
      :leave-to-class="$style.drawerLeaveTo"
    >
      <aside
        v-if="isRangesPanelOpen"
        id="saved-ranges-panel"
        :class="$style.rangesDrawer"
        role="dialog"
        :aria-label="copy.savedRanges"
      >
        <header :class="$style.drawerHeader">
          <div>
            <p :class="$style.drawerEyebrow">Vue Text Highlighter</p>
            <h2>{{ copy.savedRanges }}</h2>
          </div>
          <button
            type="button"
            :class="$style.closeButton"
            :aria-label="copy.closeRanges"
            @click="isRangesPanelOpen = false"
          >
            ×
          </button>
        </header>

        <div :class="$style.drawerBody">
          <section
            v-for="group in savedRangesByText"
            :key="group.id"
            :class="$style.rangeGroup"
          >
            <h3>{{ copy.savedText }} {{ group.id }}</h3>
            <p v-if="group.markers.length === 0" :class="$style.emptyRanges">
              {{ copy.noSavedRanges }}
            </p>
            <ul v-else :class="$style.rangeList">
              <li v-for="marker in group.markers" :key="marker.id">
                <span
                  :class="$style.colorSwatch"
                  :style="{ backgroundColor: marker.color }"
                  aria-hidden="true"
                />
                <span>{{ copy.range }} {{ marker.range.start }}–{{ marker.range.end }}</span>
                <code>#{{ marker.id }}</code>
              </li>
            </ul>
          </section>
        </div>

        <footer :class="$style.drawerFooter">
          <button
            type="button"
            :class="$style.clearButton"
            :disabled="savedMarkers.length === 0"
            @click="clearSavedMarkers"
          >
            {{ copy.clearSaved }}
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
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

.headerControls {
  display: flex;
  gap: 8px;
  align-items: center;
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

.rangesButton,
.clearButton,
.closeButton {
  color: #e0f2fe;
  font: inherit;
  font-weight: 700;
  background: rgb(14 116 144 / 35%);
  border: 1px solid rgb(125 211 252 / 45%);
}

.rangesButton {
  padding: 7px 10px;
  font-size: 0.8rem;
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

.rangesDrawer {
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 1000;
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: min(600px, 100vw);
  min-height: 100dvh;
  color: #e2e8f0;
  background: #172033;
  border-left: 1px solid rgb(148 163 184 / 38%);
  box-shadow: -18px 0 48px rgb(15 23 42 / 48%);
}

.drawerEnterActive,
.drawerLeaveActive {
  transition: transform 220ms ease, opacity 220ms ease;
}

.drawerEnterFrom,
.drawerLeaveTo {
  opacity: 0;
  transform: translateX(100%);
}

.drawerEnterTo,
.drawerLeaveFrom {
  opacity: 1;
  transform: translateX(0);
}

.drawerHeader,
.drawerFooter {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgb(148 163 184 / 20%);
}

.drawerHeader h2,
.drawerHeader p {
  margin: 0;
}

.drawerEyebrow {
  margin-bottom: 4px !important;
  color: #7dd3fc;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.closeButton {
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 1.5rem;
  line-height: 1;
}

.drawerBody {
  display: grid;
  gap: 24px;
  padding: 24px;
  overflow: auto;
}

.rangeGroup h3 {
  margin: 0 0 10px;
  color: #bae6fd;
  font-size: 1rem;
}

.rangeList {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.rangeList li {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(148 163 184 / 18%);
  border-radius: 8px;
}

.rangeList code {
  margin-left: auto;
  color: #94a3b8;
  font-size: 0.75rem;
}

.colorSwatch {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  border: 1px solid rgb(255 255 255 / 65%);
  border-radius: 50%;
}

.emptyRanges {
  margin: 0;
  color: #94a3b8;
}

.drawerFooter {
  justify-content: flex-end;
  border-top: 1px solid rgb(148 163 184 / 20%);
  border-bottom: 0;
}

.clearButton {
  padding: 9px 12px;
}

.clearButton:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
