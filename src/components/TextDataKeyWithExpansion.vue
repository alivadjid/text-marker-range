<script setup lang="ts">
import { ref } from "vue";

import TextDataKey from "@/components/TextDataKey.vue";

import Colors from "@/components/Colors.vue";

import { BookmarkColor, NewMarker } from "@/interface";

import { useMouse } from "@/composables/useMouse";
import { useMarker } from "@/composables/useMarker";

const emit = defineEmits(["handleNewHighlight"]);
const props = defineProps<{
  markers: NewMarker[];
  text: string;
  textId: number;
}>();

const { x, y } = useMouse();

const isShowSnack = ref(false);

const mouseItemDown = ref(false);
const mouseItemMove = ref(false);
const mouseItemUp = ref(false);

const textId = ref();
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
    mouseItemUp.value = true;
    handleTextChoose(id);
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
  const newBookmark = useMarker({ color, id: textId.value });

  if (newBookmark) {
    isShowSnack.value = false;
    emit("handleNewHighlight", newBookmark);
  }
}
</script>

<template>
  <TextDataKey
    :text="props.text"
    :textId="props.textId"
    :data-highlight-key="props.textId"
    :markers="
      props.markers
        .filter((marker) => marker.textId === props.textId)
        .sort((a, b) => (a > b ? 1 : -1))
    "
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
  align-items: center;
  justify-content: center;
  width: 208px;
  height: 40px;
  background-color: rgba(0, 0, 0, 60%);
}
</style>
