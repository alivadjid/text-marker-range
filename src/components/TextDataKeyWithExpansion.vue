<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";

import TextDataKey from "@/components/TextDataKey.vue";

import Colors from "@/components/Colors.vue";

import type { BookmarkColor, Marker, NewMarker } from "../interface";

import { useMouse } from "@/composables/useMouse";
import { createMarkerFromRange } from "../core/highlight";

const emit = defineEmits<{
  handleNewHighlight: [marker: NewMarker];
}>();
const props = defineProps<{
  markers: readonly Marker[];
  text: string;
  textId: number;
}>();

const { x, y } = useMouse();

const isShowSnack = ref(false);

const mouseItemDown = ref(false);
const mouseItemMove = ref(false);
const mouseItemUp = ref(false);

const textId = ref();
const textDataKey = ref<InstanceType<typeof TextDataKey>>();
const selectedRange = shallowRef<Range>();
const markersForText = computed(() =>
  props.markers.filter((marker) => marker.textId === props.textId)
);
const snackbarx = ref();
const snackbary = ref();
const timer = 3000;
const timeout = ref();
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
      mouseItemUp.value = true;
      handleTextChoose(id);
    }
  }
  mouseItemDown.value = false;
  mouseItemMove.value = false;
}

async function handleTextChoose(chosenTextId: number) {
  textId.value = chosenTextId;
  isShowSnack.value = true;
  setPosition();
}

function setPosition() {
  snackbarx.value = `${x.value + 10}px`;
  snackbary.value = `${y.value - 50}px`;

  if (timeout.value) {
    clearTimeout(timeout.value);
    setTimer();
  } else {
    setTimer();
  }
}

function setTimer() {
  timeout.value = setTimeout(() => {
    defaultSnackBar();
  }, timer);
}

function defaultSnackBar() {
  isShowSnack.value = false;
  snackbarx.value = undefined;
  snackbary.value = undefined;
}

function handleColorChoose(color: BookmarkColor) {
  const root = textDataKey.value?.element;
  const range = selectedRange.value;
  if (!root || !range || textId.value === undefined) return;

  const newBookmark = createMarkerFromRange(root, range, color, textId.value);

  if (newBookmark) {
    isShowSnack.value = false;
    selectedRange.value = undefined;
    emit("handleNewHighlight", newBookmark);
  }
}
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
      <div :class="$style.modalBackground">
        <Colors @colorChoose="handleColorChoose" />
      </div>
    </Teleport>
  </div>
</template>

<style module lang="scss">
.modalBackground {
  position: absolute;
  top: v-bind(snackbary);
  left: v-bind(snackbarx);
  z-index: 999;
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 208px;
  height: 35px;
  background-color: rgba(0, 0, 0, 50%);
}
</style>
