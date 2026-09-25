<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from "vue";

import TextDataKey from "@/components/TextDataKey.vue";

import Colors from "@/components/Colors.vue";

import type { Marker, MarkerRange, NewMarker } from "../interface";

import { createMarkerFromRange } from "../core/highlight";

const emit = defineEmits<{
  handleNewHighlight: [marker: NewMarker];
  handleRemoveHighlight: [marker: MarkerRange];
}>();
const props = defineProps<{
  markers: readonly Marker[];
  text: string;
  textId: number;
  colors?: readonly string[];
}>();

const isShowSnack = ref(false);

const mouseItemDown = ref(false);
const mouseItemMove = ref(false);

const textId = ref();
const textDataKey = ref<InstanceType<typeof TextDataKey>>();
const colorMenu = ref<HTMLElement>();
const selectedRange = shallowRef<Range>();
const markersForText = computed(() =>
  props.markers.filter((marker) => marker.textId === props.textId)
);
const menuX = ref("-9999px");
const menuY = ref("-9999px");
const closeDelay = 3_500;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function clearCloseTimer() {
  if (closeTimer !== undefined) {
    clearTimeout(closeTimer);
    closeTimer = undefined;
  }
}

function startCloseTimer() {
  clearCloseTimer();
  closeTimer = setTimeout(closeColorMenu, closeDelay);
}
function onItemMouseDown() {
  mouseItemDown.value = true;
}

function onItemMouseMove() {
  if (mouseItemDown.value) mouseItemMove.value = true;
}

function onItemMouseUp(id: number) {
  if (mouseItemDown.value && mouseItemMove.value) {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : undefined;
    const root = textDataKey.value?.element;

    if (range && root && root.contains(range.commonAncestorContainer) && !range.collapsed) {
      selectedRange.value = range.cloneRange();
      handleTextChoose(id);
    }
  }
  mouseItemDown.value = false;
  mouseItemMove.value = false;
}

async function handleTextChoose(chosenTextId: number) {
  textId.value = chosenTextId;
  const range = selectedRange.value;
  if (!range) return;

  isShowSnack.value = true;
  await nextTick();

  const rects = range.getClientRects();
  const rect = rects[rects.length - 1] ?? range.getBoundingClientRect();
  const margin = 8;
  const menuWidth = Math.min(
    colorMenu.value?.offsetWidth ?? 264,
    window.innerWidth - margin * 2
  );
  const menuHeight = colorMenu.value?.offsetHeight ?? 76;
  const left = Math.max(
    margin,
    Math.min(
      rect.left + rect.width / 2 - menuWidth / 2,
      window.innerWidth - menuWidth - margin
    )
  );
  const top =
    rect.bottom + margin + menuHeight <= window.innerHeight
      ? rect.bottom + margin
      : Math.max(margin, rect.top - menuHeight - margin);

  menuX.value = `${left}px`;
  menuY.value = `${top}px`;
}

function closeColorMenu() {
  clearCloseTimer();
  isShowSnack.value = false;
  selectedRange.value = undefined;
  menuX.value = "-9999px";
  menuY.value = "-9999px";
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!colorMenu.value?.contains(event.target as Node)) closeColorMenu();
}

function onDocumentKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") closeColorMenu();
}

function handleColorChoose(color: string) {
  const root = textDataKey.value?.element;
  const range = selectedRange.value;
  if (!root || !range || textId.value === undefined) return;

  const newBookmark = createMarkerFromRange(root, range, color, textId.value);

  if (newBookmark) {
    closeColorMenu();
    emit("handleNewHighlight", newBookmark);
  }
}

function handleRemoveHighlight() {
  const root = textDataKey.value?.element;
  const range = selectedRange.value;
  if (!root || !range || textId.value === undefined) return;

  const marker = createMarkerFromRange(root, range, "", textId.value);
  if (marker) {
    closeColorMenu();
    emit("handleRemoveHighlight", {
      range: marker.range,
      textId: marker.textId,
    });
  }
}

watch(isShowSnack, (isOpen) => {
  if (isOpen) {
    document.addEventListener("pointerdown", onDocumentPointerDown);
    document.addEventListener("keydown", onDocumentKeyDown);
    startCloseTimer();
  } else {
    clearCloseTimer();
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    document.removeEventListener("keydown", onDocumentKeyDown);
  }
});

onBeforeUnmount(() => {
  clearCloseTimer();
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  document.removeEventListener("keydown", onDocumentKeyDown);
});
</script>

<template>
  <TextDataKey
    ref="textDataKey"
    :text="props.text"
    :textId="props.textId"
    :data-highlight-key="props.textId"
    :markers="markersForText"
    @mousedown="onItemMouseDown"
    @mousemove="onItemMouseMove"
    @mouseup.prevent="() => onItemMouseUp(props.textId)"
  />

  <div v-if="isShowSnack">
    <Teleport to="body">
      <div
        ref="colorMenu"
        :class="$style.colorMenu"
        role="dialog"
        aria-label="Выбор цвета выделения"
        @pointerenter="clearCloseTimer"
        @pointerleave="startCloseTimer"
      >
        <Colors
          :colors="props.colors"
          @colorChoose="handleColorChoose"
          @remove="handleRemoveHighlight"
        />
      </div>
    </Teleport>
  </div>
</template>

<style module lang="scss">
.colorMenu {
  position: fixed;
  top: v-bind(menuY);
  left: v-bind(menuX);
  z-index: 999;
  width: min(264px, calc(100vw - 16px));
  padding: 12px;
  background: #fff;
  border: 1px solid rgb(15 23 42 / 12%);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgb(15 23 42 / 20%);
}
</style>
